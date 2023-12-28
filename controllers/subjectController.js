import { User } from '../models/userModel.js'

const subjectController = {
  // Menambahkan mata pelajaran baru untuk pengguna tertentu
  createSubject: async (req, res) => {
    try {
      const userId = req.user._id
      const { name, dosen, type_subject } = req.body

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const newSubject = {
        name,
        dosen,
        type_subject,
      }

      user.subjects.push(newSubject)
      await user.save()

      return res.status(201).json({ name, dosen, type_subject })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  // Mendapatkan daftar mata pelajaran untuk pengguna tertentu
  getSubjects: async (req, res) => {
    try {
      const userId = req.user._id

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const subjects = user.subjects

      return res.status(200).json(subjects)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  // Menghapus suatu mata pelajaran dari pengguna tertentu
  deleteSubject: async (req, res) => {
    try {
      const { subjectId } = req.params
      const userId = req.user._id

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Temukan indeks matkul yang ingin dihapus
      const subjectIndex = user.subjects.findIndex(
        (subject) => subject._id == subjectId
      )
      // Pastikan matkul ditemukan dan bahwa pengguna yang mencoba menghapus matkul adalah pemiliknya
      if (subjectIndex === -1) {
        return res.status(404).json({ error: 'Reply not found' })
      }

      const subject = user.subjects[subjectIndex]

      console.log(subject)

      if (user._id.toString() != userId.toString()) {
        return res
          .status(403)
          .json({ error: 'You are not authorized to delete this subject' })
      }

      // Hapus matkul dari array replies
      user.subjects.splice(subjectIndex, 1)

      // Simpan perubahan ke dalam database
      await user.save()

      return res.status(200).json({ message: 'Subject deleted successfully' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  },

 getAllSubjectNames: async (req, res) => {
    try {
      // Fetch user ID from the request
      const userId = req.user._id;

      // Find the user in the database
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Extract subject names and IDs from the user's subjects
      const subjectInfo = user.subjects.map((subject) => ({
        subjectId: subject._id,
        subjectName: subject.name,
      }));

      return res.status(200).json(subjectInfo);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },
   // Mendapatkan suatu mata pelajaran berdasarkan ID untuk pengguna tertentu
  getSubjectById: async (req, res) => {
    try {
      const userId = req.user._id
      const { subjectId } = req.params

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Temukan mata pelajaran berdasarkan ID
      const subject = user.subjects.find(
        (subject) => subject._id.toString() === subjectId
      )

      // Pastikan mata pelajaran ditemukan
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' })
      }

      return res.status(200).json(subject)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  },
// Update suatu mata pelajaran untuk pengguna tertentu berdasarkan ID
  updateSubject: async (req, res) => {
    try {
      const userId = req.user._id;
      const { subjectId } = req.params;
      const { name, dosen } = req.body;

      // Periksa apakah minimal satu properti ada dalam request body
      if (!(name || dosen)) {
        return res.status(400).json({
          message: 'At least one of the properties (name or dosen) must be provided for the update',
        });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Temukan indeks mata pelajaran yang ingin diupdate
      const subjectIndex = user.subjects.findIndex(
        (subject) => subject._id.toString() === subjectId
      );

      // Pastikan mata pelajaran ditemukan
      if (subjectIndex === -1) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      // Update properti name dan dosen jika ada dalam request body
      if (name !== undefined && name !== null && name !== '') {
        user.subjects[subjectIndex].name = name;
      }

      if (dosen !== undefined && dosen !== null && dosen !== '') {
        user.subjects[subjectIndex].dosen = dosen;
      }

      // Simpan perubahan ke dalam database
      await user.save();

      return res.status(200).json({ message: 'Subject updated successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },
}

export default subjectController