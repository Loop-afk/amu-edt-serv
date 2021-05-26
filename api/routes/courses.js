const config = require('../config')
const { Router } = require('express')

const router = Router()

// Initialize Controller
const coursesController = require('../controllers/coursesController')


// Get courses
router.get('/affichage/', coursesController.list)
//New Courses
router.get('/nouveau/cours/', coursesController.newCourse)
router.get('/supprimer/cours/', coursesController.deleteCourse)



module.exports = router