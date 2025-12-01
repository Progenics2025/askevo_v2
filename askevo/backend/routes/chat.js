import express from 'express';
import { body, validationResult } from 'express-validator';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create chat session
router.post('/sessions', authenticateToken, [
  body('session_title').optional().trim(),
  body('language').optional().isIn(['en', 'es', 'fr', 'hi', 'te', 'ta', 'kn', 'bn', 'mr', 'ar', 'or']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { session_title, language } = req.body;
    const userId = req.user.id;

    const [result] = await pool.query(
      'INSERT INTO chat_sessions (user_id, session_title, language) VALUES (?, ?, ?)',
      [userId, session_title || `Chat ${new Date().toLocaleDateString()}`, language || 'en']
    );

    res.status(201).json({
      message: 'Session created',
      session_id: result.insertId,
    });
  } catch (error) {
    console.error('Session creation error:', error);
    res.status(500).json({ message: 'Failed to create session' });
  }
});

// Get user sessions
router.get('/sessions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [sessions] = await pool.query(
      `SELECT id, session_title, message_count, created_at, last_message_at, is_archived
       FROM chat_sessions
       WHERE user_id = ? AND is_archived = FALSE
       ORDER BY last_message_at DESC`,
      [userId]
    );

    res.json({ sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Failed to fetch sessions' });
  }
});

// Get session messages
router.get('/sessions/:sessionId/messages', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // Verify user owns session
    const [sessions] = await pool.query(
      'SELECT id FROM chat_sessions WHERE id = ? AND user_id = ?',
      [sessionId, userId]
    );

    if (sessions.length === 0) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Get messages
    const [messages] = await pool.query(
      `SELECT id, sender_type, message_text, message_type, voice_url, file_url, 
              liked, disliked, created_at
       FROM chat_messages
       WHERE session_id = ?
       ORDER BY created_at ASC`,
      [sessionId]
    );

    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
});

// Save message
router.post('/messages', authenticateToken, [
  body('session_id').isInt(),
  body('message_text').trim().notEmpty(),
  body('sender_type').isIn(['user', 'bot']),
  body('message_type').optional().isIn(['text', 'voice', 'file']),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { session_id, message_text, sender_type, message_type, voice_url, file_url, file_name, file_size } = req.body;
    const userId = req.user.id;

    // Verify user owns session
    const [sessions] = await pool.query(
      'SELECT id, session_title FROM chat_sessions WHERE id = ? AND user_id = ?',
      [session_id, userId]
    );

    if (sessions.length === 0) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const currentSession = sessions[0];

    // Save message
    const [result] = await pool.query(
      `INSERT INTO chat_messages 
       (session_id, user_id, sender_type, message_text, message_type, voice_url, file_url, file_name, file_size)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [session_id, userId, sender_type, message_text, message_type || 'text', voice_url || null, file_url || null, file_name || null, file_size || null]
    );

    // Update session title if it's the first user message and title is default-ish
    if (sender_type === 'user') {
      const isDefaultTitle = currentSession.session_title.startsWith('Chat - ');

      // Check if this is the first user message (or we can just check if title is default)
      // A simple heuristic: if title looks like a date default, update it.
      if (isDefaultTitle) {
        const newTitle = message_text.length > 30 ? message_text.substring(0, 30) + '...' : message_text;
        await pool.query(
          'UPDATE chat_sessions SET session_title = ? WHERE id = ?',
          [newTitle, session_id]
        );
      }
    }

    // Update last_message_at
    await pool.query(
      'UPDATE chat_sessions SET last_message_at = NOW(), message_count = message_count + 1 WHERE id = ?',
      [session_id]
    );

    res.status(201).json({
      message: 'Message saved',
      message_id: result.insertId,
    });
  } catch (error) {
    console.error('Save message error:', error);
    res.status(500).json({ message: 'Failed to save message' });
  }
});

// Update message feedback
router.put('/messages/:messageId/feedback', authenticateToken, [
  body('liked').optional().isBoolean(),
  body('disliked').optional().isBoolean(),
  body('feedback_text').optional().trim(),
], async (req, res) => {
  try {
    const { messageId } = req.params;
    const { liked, disliked, feedback_text } = req.body;
    const userId = req.user.id;

    // Verify user owns message
    const [messages] = await pool.query(
      'SELECT id FROM chat_messages WHERE id = ? AND user_id = ?',
      [messageId, userId]
    );

    if (messages.length === 0) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update feedback
    await pool.query(
      'UPDATE chat_messages SET liked = ?, disliked = ?, feedback_text = ? WHERE id = ?',
      [liked || false, disliked || false, feedback_text || null, messageId]
    );

    res.json({ message: 'Feedback saved' });
  } catch (error) {
    console.error('Update feedback error:', error);
    res.status(500).json({ message: 'Failed to save feedback' });
  }
});

// Archive session
router.put('/sessions/:sessionId/archive', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    // Verify user owns session
    const [sessions] = await pool.query(
      'SELECT id FROM chat_sessions WHERE id = ? AND user_id = ?',
      [sessionId, userId]
    );

    if (sessions.length === 0) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Archive session
    await pool.query(
      'UPDATE chat_sessions SET is_archived = TRUE WHERE id = ?',
      [sessionId]
    );

    res.json({ message: 'Session archived' });
  } catch (error) {
    console.error('Archive session error:', error);
    res.status(500).json({ message: 'Failed to archive session' });
  }
});

export default router;
