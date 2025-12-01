import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Configure multer
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 52428800 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'text/plain', 'application/json', 'image/png', 'image/jpeg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

// Upload file
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const userId = req.user.id;
    const sessionId = req.body.session_id || null;

    // Calculate file hash
    const fileContent = fs.readFileSync(req.file.path);
    const fileHash = crypto.createHash('sha256').update(fileContent).digest('hex');

    // Save file info to database
    const [result] = await pool.query(
      `INSERT INTO file_uploads 
       (user_id, session_id, file_name, file_type, file_size, file_path, file_hash, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        sessionId,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
        req.file.path,
        fileHash,
        req.body.description || null,
      ]
    );

    res.status(201).json({
      message: 'File uploaded successfully',
      file_id: result.insertId,
      file_name: req.file.originalname,
      file_size: req.file.size,
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ message: 'File upload failed' });
  }
});

// Get user files
router.get('/files', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [files] = await pool.query(
      `SELECT id, file_name, file_type, file_size, description, created_at, download_count
       FROM file_uploads
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({ files });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ message: 'Failed to fetch files' });
  }
});

// Download file
router.get('/files/:fileId/download', authenticateToken, async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.id;

    // Verify user owns file
    const [files] = await pool.query(
      'SELECT file_path, file_name FROM file_uploads WHERE id = ? AND user_id = ?',
      [fileId, userId]
    );

    if (files.length === 0) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const file = files[0];

    // Update download count
    await pool.query(
      'UPDATE file_uploads SET download_count = download_count + 1 WHERE id = ?',
      [fileId]
    );

    res.download(file.file_path, file.file_name);
  } catch (error) {
    console.error('Download file error:', error);
    res.status(500).json({ message: 'Failed to download file' });
  }
});

// Delete file
router.delete('/files/:fileId', authenticateToken, async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.id;

    // Verify user owns file
    const [files] = await pool.query(
      'SELECT file_path FROM file_uploads WHERE id = ? AND user_id = ?',
      [fileId, userId]
    );

    if (files.length === 0) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const file = files[0];

    // Delete from database
    await pool.query(
      'DELETE FROM file_uploads WHERE id = ?',
      [fileId]
    );

    // Delete file from disk
    if (fs.existsSync(file.file_path)) {
      fs.unlinkSync(file.file_path);
    }

    res.json({ message: 'File deleted' });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ message: 'Failed to delete file' });
  }
});

export default router;
