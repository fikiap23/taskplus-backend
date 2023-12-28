import express from 'express'
import subjectController from '../controllers/subjectController.js'
import protectRoute from '../middlewares/protectRoute.js'

const router = express.Router()

router.get('/list', protectRoute, subjectController.getSubjects)
router.get('/types', protectRoute, subjectController.getAllSubjectNames)
router.get('/:subjectId', protectRoute, subjectController.getSubjectById)

router.put('/:subjectId', protectRoute, subjectController.updateSubject)
router.post('/create', protectRoute, subjectController.createSubject)
router.delete('/:subjectId', protectRoute, subjectController.deleteSubject)


export default router