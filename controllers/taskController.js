import { User } from '../models/userModel.js'
import push from 'web-push'
import axios from 'axios'

const taskController = {

 getAllTasks: async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Initialize an array to store tasks with subject information
    const tasksWithSubjects = [];

    // Iterate through each subject
    for (const subject of user.subjects) {
      // Iterate through each task in the subject
      for (const task of subject.tasks) {
        const taskWithSubject = {
          subjectData: {
            subjectId: subject._id,
            subjectName: subject.name,
            dosen: subject.dosen,
            // Add other subject information if needed
          },
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          completed: task.completed,
          _id: task._id,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        };

        tasksWithSubjects.push(taskWithSubject);
      }
    }

    // Sort tasks based on dueDate
    tasksWithSubjects.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return dateA - dateB;
    });

    return res.status(200).json(tasksWithSubjects);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
},

  // Membuat tugas baru untuk suatu mata pelajaran milik pengguna tertentu
  createTask: async (req, res) => {
    try {
      const { subjectId } = req.params
      const userId = req.user._id
      const { title, description, type, subjectName, dueDate } = req.body

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const subject = user.subjects.id(subjectId)
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' })
      }

      subject.tasks.push({
        title,
        description,
        type,
        subjectName,
        dueDate,
      })

      await user.save()

      return res
        .status(201)
        .json({ title, description, type, subjectName, dueDate })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  // Mendapatkan daftar tugas untuk suatu mata pelajaran milik pengguna tertentu
  getTasks: async (req, res) => {
    try {
      const { subjectId } = req.params
      const userId = req.user._id

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const subject = user.subjects.id(subjectId)
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' })
      }

      const tasks = subject.tasks

      return res.status(200).json(tasks)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  // Menghapus suatu tugas dari suatu mata pelajaran milik pengguna tertentu
  deleteTask: async (req, res) => {
    try {
      const { subjectId, taskId } = req.params
      const userId = req.user._id

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const subject = user.subjects.id(subjectId)
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' })
      }

      const taskIndex = subject.tasks.findIndex((task) => task._id == taskId)

      if (taskIndex === -1) {
        return res.status(404).json({ message: 'Task not found' })
      }

      // Remove the task from the array
      subject.tasks.splice(taskIndex, 1)

      // Save changes to the database
      await user.save()

      return res.status(200).json({ message: 'Task deleted successfully' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  // Mengupdate suatu tugas dari suatu mata pelajaran milik pengguna tertentu
  updateTask: async (req, res) => {
    try {
      const { subjectId, taskId } = req.params
      const userId = req.user._id
      const { title, description, dueDate } = req.body

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const subject = user.subjects.id(subjectId)
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' })
      }

      const task = subject.tasks.id(taskId)
      if (!task) {
        return res.status(404).json({ message: 'Task not found' })
      }

      // Update task properties
      task.title = title
      task.description = description
      task.dueDate = dueDate

      // Save changes to the database
      await user.save()

      return res
        .status(200)
        .json({ title, description, dueDate })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  // Mendapatkan detail suatu tugas dari suatu mata pelajaran milik pengguna tertentu
  getTaskDetail: async (req, res) => {
    try {
      const { subjectId, taskId } = req.params
      const userId = req.user._id

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const subject = user.subjects.id(subjectId)
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' })
      }

      const task = subject.tasks.id(taskId)
      if (!task) {
        return res.status(404).json({ message: 'Task not found' })
      }

      return res.status(200).json(task)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  },

  // Mengubah status suatu tugas menjadi selesai
  completeTask: async (req, res) => {
    try {
      const { subjectId, taskId } = req.params
      const userId = req.user._id

      const user = await User.findById(userId)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      const subject = user.subjects.id(subjectId)
      if (!subject) {
        return res.status(404).json({ message: 'Subject not found' })
      }

      const task = subject.tasks.id(taskId)
      if (!task) {
        return res.status(404).json({ message: 'Task not found' })
      }

      // Toggle the completed status
      task.completed = !task.completed

      // Save changes to the database
      await user.save()

      return res
        .status(200)
        .json({ message: 'Task status updated successfully' })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Internal Server Error' })
    }
  },
}

export default taskController
