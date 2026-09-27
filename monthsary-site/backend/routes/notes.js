const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET /api/notes — all notes, newest first
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, message, created_at FROM notes ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (err) {
    console.error('Failed to fetch notes:', err.message);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// POST /api/notes — add a new note
router.post('/', async (req, res) => {
  const { name, message } = req.body || {};

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'A message is required' });
  }

  const cleanName = (name || '').trim().slice(0, 40) || null;
  const cleanMessage = message.trim().slice(0, 500);

  try {
    const [result] = await pool.query(
      'INSERT INTO notes (name, message) VALUES (?, ?)',
      [cleanName, cleanMessage]
    );
    const [rows] = await pool.query(
      'SELECT id, name, message, created_at FROM notes WHERE id = ?',
      [result.insertId]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Failed to save note:', err.message);
    res.status(500).json({ error: 'Failed to save note' });
  }
});

module.exports = router;
