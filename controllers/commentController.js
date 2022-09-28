const Comments = require('../models/CommentModel')
const Like = require('../models/LikeModel');

const commentController = {
    getSpecifiedComment: async (req, res) => {
        try {
            const comment = await Comments.findOne({where: {id: req.params.comment_id}})
            if(comment) {
                return res.status(200).json(comment)
            } else {
                return res.status(500).json({msg: 'Such comment does not exist'})
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
     
    getSpecifiedCommentLikes: async(req, res) => {
        try {
            const comment = await Comments.findOne({where: {id: req.params.comment_id}})
            if(comment){
                const likes = await Like.findAll({ where: {commentID: req.params.comment_id}})
                return res.status(200).json(likes)
            } else {
                return res.status(500).json({msg: "Such comment does not exist"})
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },

    createLikeToComment: async (req, res) => {
        try {
            const post = await Comments.findOne({where: {id: req.params.comment_id}})
            if(!post) {
                return res.status(500).json({msg: "Such comment does not exist"})
            } else {
                const like = await Like.findOne({where: {commentID: req.params.comment_id, userID: req.user.id}})
                if(!req.body.likeType) {
                    return res.status(500).json({msg: 'Please, like or dislike'})
                }
                if(!like || like.dataValues.type !== req.body.likeType) {
                    await Like.create({
                        userID: req.user.id,
                        commentID: req.params.comment_id,
                        publishDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
                        type: req.body.likeType
                    })
                    if(like) {
                        like.destroy()
                    }
                    return res.status(200).json({msg: 'Like has been added to database'})
                }
                return res.status(500).json({msg: 'Already liked / disliked'})
            } 
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },

    updateComment: async (req, res) => {
        try {
            const {content} = req.body
            const comment = await Comments.findOne({where: {id: req.params.comment_id, userID: req.user.id}})
            if(comment) {
                comment.update({
                    content: content ? content : comment.dataValues.content
                })
                return res.status(200).json({msg: "Data was updated"})
            } else {
                return res.status(500).json({msg: 'Such comment does not exist or you dont author'})
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },

    deleteComment: async (req, res) => {
        try {
            const comment = await Comments.findOne({where: {id: req.params.comment_id}})
            if(!comment) {
                return res.status(500).json({msg: "There is not such a post"})
            } else {
                if(req.user.id === comment.dataValues.userID || req.user.role === 'admin') {
                    comment.destroy()
                    return res.status(200).json({msg: "Comment has been deleted"})
                } else {
                    return res.status(500).json({msg: 'You can not delete this comment'})
                }
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },

    deleteLikeToComment: async (req, res) => {
        try {
            const comment = await Comments.findOne({where: {id: req.params.comment_id}})
            if(!comment) {
                return res.status(500).json({msg: "Such comments does not exist"})
            } else {
                const like = await Like.findOne({where: {commentID: req.params.comment_id, userID: req.user.id}})
                console.log(req.body.likeType)
                if(like) {
                    like.destroy()
                    return res.status(200).json({msg: 'Like has been deleted'})
                } else {
                    return res.status(500).json({msg: 'Can not delete'})
                }
            } 
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    }
}

module.exports = commentController