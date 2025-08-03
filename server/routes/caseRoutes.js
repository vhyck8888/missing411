import express from 'express';
import multer from 'multer';
import path from 'path';
import Case from '../models/Case.js';
import mongoose from 'mongoose';


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});




router.patch('/:id/comment', async (req, res) => {
  const { userId, text } = req.body;
  if (!text) return res.status(400).json({ message: 'Comment text is required' });

  try {
    const updatedCase = await Case.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { user: userId, text } } },
      { new: true }
    ).populate('comments.user', 'username');

    if (!updatedCase) return res.status(404).json({ message: 'Case not found' });

    res.json(updatedCase);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const cases = await Case.find({ pending: false });
    res.json(cases);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching cases', error });
  }
});

router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { name, status, date, lastSeen, latitude, longitude, description } = req.body;

    if (!name || !status || !date || !lastSeen || !latitude || !longitude) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newCase = new Case({
      name,
      status,
      date,
      lastSeen,
      latitude,
      longitude,
      description,
      photoUrl: req.file ? req.file.filename : null,
      pending: true,
    });

    await newCase.save();
    res.status(201).json(newCase);
  } catch (error) {
    res.status(500).json({ message: 'Error creating case', error });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const foundCase = await Case.findById(id);
    if (!foundCase) return res.status(404).json({ message: 'Case not found' });

    foundCase.status = status || foundCase.status;
    await foundCase.save();

    res.json(foundCase);
  } catch (error) {
    res.status(500).json({ message: 'Error updating case status', error });
  }
});

export default router;
