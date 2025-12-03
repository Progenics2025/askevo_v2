import express from 'express';
import { pedigreeService } from '../services/pedigreeService.js';
import { authenticateToken } from '../middleware/auth.js';
import pool from '../config/database.js';

const router = express.Router();

// Get all clients for the counselor
router.get('/clients', authenticateToken, async (req, res) => {
    try {
        const [clients] = await pool.query(
            'SELECT * FROM clients WHERE counselor_id = ? ORDER BY created_at DESC',
            [req.user.id]
        );
        res.json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new client
router.post('/clients', authenticateToken, async (req, res) => {
    try {
        const { name, reference_id, dob, sex, notes } = req.body;
        const [result] = await pool.query(
            'INSERT INTO clients (counselor_id, name, reference_id, dob, sex, notes) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, name, reference_id, dob, sex, notes]
        );
        res.json({ id: result.insertId, message: 'Client created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start a pedigree session (New Chat)
router.post('/start', authenticateToken, async (req, res) => {
    try {
        // We don't need clientId anymore, we start fresh
        const result = await pedigreeService.startSession(req.user.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Send a message in the pedigree chat
router.post('/chat', authenticateToken, async (req, res) => {
    try {
        const { sessionId, message } = req.body;
        const result = await pedigreeService.processMessage(sessionId, message);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get pedigree tree data
router.get('/session/:sessionId', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM pedigrees WHERE id = ?', [req.params.sessionId]);
        if (rows.length === 0) return res.status(404).json({ message: 'Session not found' });
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
