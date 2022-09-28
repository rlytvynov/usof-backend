const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const {checkAdmin, checkAuthUser} = require('../utils/authCheck')

router.get('/', checkAuthUser, postController.getAllPosts)
router.post('/', checkAuthUser, postController.createNewPost)
router.get('/:post_id', postController.getPostById)
router.get('/:post_id/comments', postController.getCommentsByPostId)
router.post('/:post_id/comments', checkAuthUser, postController.createCommentToPostById)
router.get('/:post_id/categories', checkAuthUser, postController.getCategoriesByPostId)
router.get('/:post_id/like', checkAuthUser, postController.getLikesByPostId)
router.post('/:post_id/like', checkAuthUser, postController.createNewLikeToPost)
router.patch('/:post_id', checkAuthUser, postController.updatePost)
router.delete('/:post_id', checkAuthUser, postController.deletePost)
router.delete('/:post_id/like', checkAuthUser, postController.deleteLikeToPost)

module.exports = router