const express = require('express')
const router = express.Router()
const commentController = require('../controllers/commentController')
const {checkAdmin, checkAuthUser} = require('../utils/authCheck')

router.get('/:comment_id', commentController.getSpecifiedComment)
router.get('/:comment_id/like', commentController.getSpecifiedCommentLikes)

router.post('/:comment_id/like', checkAuthUser, commentController.createLikeToComment)
router.patch('/:comment_id', checkAuthUser, commentController.updateComment)
router.delete('/:comment_id', checkAuthUser, commentController.deleteComment)
router.delete('/:comment_id/like', checkAuthUser, commentController.deleteLikeToComment)

module.exports = router