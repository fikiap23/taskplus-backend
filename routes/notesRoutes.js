import express from 'express';
import notesController from '../controllers/notesController.js';
import protectRoute from '../middlewares/protectRoute.js';

const router = express.Router();

router.get('/list', protectRoute, notesController.getNotes);
router.get('/:noteId', protectRoute, notesController.getNoteById);

router.put('/:noteId', protectRoute, notesController.updateNote);
router.post('/create', protectRoute, notesController.createNote);
router.delete('/:noteId', protectRoute, notesController.deleteNote);

export default router;
