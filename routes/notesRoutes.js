import express from 'express';
import notesController from '../controllers/notesController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

// Route to create a new note
router.post('/create', protectRoute, notesController.createNote);

// Route to get a list of notes
router.get('/', protectRoute, notesController.getNotes);

// Route to get details of a specific note
router.get('/:noteId', protectRoute, notesController.getNoteDetail);

// Route to update a note
router.put('/:noteId', protectRoute, notesController.updateNote);

// Route to delete a note
router.delete('/:noteId', protectRoute, notesController.deleteNote);

export default router;
