import { User } from '../models/userModel.js';

const notesController = {
  // Menambahkan catatan baru untuk pengguna tertentu
  createNote: async (req, res) => {
    try {
      const userId = req.user._id;
      const { title, description } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const newNote = {
        title,
        description,
      };

      user.notes.push(newNote);
      await user.save();

      return res.status(201).json({ title, description });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Mendapatkan daftar catatan untuk pengguna tertentu
  getNotes: async (req, res) => {
    try {
      const userId = req.user._id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const notes = user.notes;

      return res.status(200).json(notes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Mendapatkan suatu catatan berdasarkan ID untuk pengguna tertentu
  getNoteById: async (req, res) => {
    try {
      const userId = req.user._id;
      const { noteId } = req.params;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Temukan catatan berdasarkan ID
      const note = user.notes.find((note) => note._id.toString() === noteId);

      // Pastikan catatan ditemukan
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }

      return res.status(200).json(note);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Update suatu catatan untuk pengguna tertentu berdasarkan ID
  updateNote: async (req, res) => {
    try {
      const userId = req.user._id;
      const { noteId } = req.params;
      const { title, description } = req.body;

      // Periksa apakah minimal satu properti ada dalam request body
      if (!(title || description)) {
        return res.status(400).json({
          message: 'At least one of the properties (title or description) must be provided for the update',
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Temukan indeks catatan yang ingin diupdate
      const noteIndex = user.notes.findIndex(
        (note) => note._id.toString() === noteId
      );

      // Pastikan catatan ditemukan
      if (noteIndex === -1) {
        return res.status(404).json({ message: 'Note not found' });
      }

      // Update properti title dan description jika ada dalam request body
      if (title !== undefined && title !== null && title !== '') {
        user.notes[noteIndex].title = title;
      }

      if (
        description !== undefined &&
        description !== null &&
        description !== ''
      ) {
        user.notes[noteIndex].description = description;
      }

      // Simpan perubahan ke dalam database
      await user.save();

      return res
        .status(200)
        .json({ message: 'Note updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Menghapus suatu catatan dari pengguna tertentu
  deleteNote: async (req, res) => {
    try {
      const { noteId } = req.params;
      const userId = req.user._id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Temukan indeks catatan yang ingin dihapus
      const noteIndex = user.notes.findIndex(
        (note) => note._id == noteId
      );
      // Pastikan catatan ditemukan
      if (noteIndex === -1) {
        return res.status(404).json({ error: 'Note not found' });
      }

      // Hapus catatan dari array notes
      user.notes.splice(noteIndex, 1);

      // Simpan perubahan ke dalam database
      await user.save();

      return res
        .status(200)
        .json({ message: 'Note deleted successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

export default notesController;
