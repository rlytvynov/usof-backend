const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categoryController')
const {checkAdmin, checkAuthUser} = require('../utils/authCheck')

router.get('/', categoryController.getAllCategories)
router.get('/:category_id', categoryController.getCategory)
router.get('/:category_id/posts', categoryController.getPostsByCategory)
router.post('/', checkAuthUser, checkAdmin, categoryController.createNewCategory)
router.patch('/:category_id', checkAuthUser, checkAdmin, categoryController.updateCategory)
router.delete('/:category_id', checkAuthUser, checkAdmin, categoryController.deleteCategory)

module.exports = router