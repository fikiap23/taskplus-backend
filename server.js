import express from 'express'
import dotenv from 'dotenv'
import connectDB from './db/connectDB.js'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/userRoutes.js'
import cors from 'cors'
import subjectRoutes from './routes/subjectRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import notesRotes from './routes/notesRoutes.js'
import { v2 as cloudinary } from 'cloudinary'

dotenv.config()

connectDB()

const app = express()

app.use(
  cors()
)

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const PORT = process.env.PORT || 5000

// Tambahkan konfigurasi limit untuk express.json()
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded data in the request body
app.use(cookieParser())

// Routes
app.use('/v1/api/users', userRoutes)
app.use('/v1/api/subjects', subjectRoutes)
app.use('/v1/api/tasks', taskRoutes)
app.use('/v1/api/notes', notesRotes)

app.listen(PORT, () => {
  console.log(`Server started at  http://localhost:${PORT}`)
})
