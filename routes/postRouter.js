const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const {checkAdmin, checkAuthUser} = require('../utils/authCheck')

router.get('/', postController.getAllPosts)
router.get('/:post_id', postController.getPostById)
router.get('/:post_id/comments', postController.getCommentsByPostId)
router.get('/:post_id/categories', postController.getCategoriesByPostId)
router.get('/:post_id/like', postController.getLikesByPostId)
router.post('/', checkAuthUser, postController.createNewPost)
router.post('/:post_id/comments', checkAuthUser, postController.createCommentToPostById)
router.post('/:post_id/like', checkAuthUser, postController.createNewLikeToPost)
router.patch('/:post_id', checkAuthUser, postController.updatePost)
router.delete('/:post_id', checkAuthUser, postController.deletePost)
router.delete('/:post_id/like', checkAuthUser, postController.deleteLikeToPost)

module.exports = router