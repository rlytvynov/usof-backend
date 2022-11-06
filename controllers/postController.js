const Post = require('../models/PostModel')
const Comments = require('../models/CommentModel')
const Category = require('../models/CategoryModel')
const PostCategory = require('../models/PostToCategory');
const jwt = require('jsonwebtoken');
const Like = require('../models/LikeModel');
const User = require('../models/UserModel');

const postController = {
    getAllPosts: async (req, res) => {
        try {
            const queryData = req.query
            let posts = await Post.findAll()

            if(queryData.sort) {       
                if(queryData.sort && queryData.sort === 'onLikes') {
                    posts.sort((a, b) => {
                        return b.dataValues.rating - a.dataValues.rating
                    })
                } else {
                    posts.sort((a,b) => {
                        return new Date(b.dataValues.publishDate) - new Date(a.dataValues.publishDate)
                    })
                }
            }

            if(queryData.status) {
                for (let i = 0; i < posts.length; i++) {
                    if(queryData.status === 'active') {
                        if(posts[i].dataValues.status !== 'active') {
                            posts[i] = {}
                        }
                    } else {
                        if(req.user.role === 'admin') {
                            if(posts[i].dataValues.status !== 'locked') {
                                posts[i] = {}
                            }
                        } else {
                            if(posts[i].dataValues.status !== 'locked' || 
                            (posts[i].dataValues.status === 'locked' && posts[i].dataValues.userID !== req.user.id)) {
                                posts[i] = {}
                            }
                        }
                    }
                } 
                posts = posts.filter(element => Object.keys(element).length !== 0) 
            }

            if(queryData.category) {
                for (let i = 0; i < posts.length; i++) {
                    const categories = (await Post.findAll({
                        where: {id: posts[i].dataValues.id},
                        attributes: ['title'],
                        include: [{
                            model: Category,
                            as: "categories",
                            through: PostCategory
                        }]
                    }))[0].categories.map(item => item.dataValues.title)
                    console.log(posts[i])
                    console.log(categories)

                    if(!findCommonElement(queryData.category, categories)) {
                        posts[i] = {}
                    } 
                    //console.log('-------------------------------')
                    // for (let j = 0; j < categories[0].categories.length; j++) {
                    //     if(queryData.category.includes(categories[0].categories[j].dataValues.title)) {
                    //         posts[i] = {}
                    //     } else {
                    //         break
                    //     }
                    // }
                }  
                posts = posts.filter(element => Object.keys(element).length !== 0)         
            }

            if(queryData.from || queryData.to) {
                console.log(posts)
                for (let i = 0; i < posts.length; i++) {
                    if(new Date(posts[i].dataValues.publishDate) < new Date(queryData.from) ||
                        new Date(posts[i].dataValues.publishDate) > new Date(queryData.to)) {
                            posts[i] = {}
                        }
                }  
            }

            posts = posts.filter(element => Object.keys(element).length !== 0) 

            for (const element of posts) {
                element.dataValues.comments = (await Comments.findAll({where: {postID: element.id}})).length
            }

            const postsPerPage = 4
            if(!req.user || req.user.role !== 'admin') {
                return res.status(200).json(paginate(getPostsForUser(req, posts), postsPerPage, queryData.page ? Number(queryData.page) : 1))
            } else {
                return res.status(200).json(paginate(posts, postsPerPage, queryData.page ? Number(queryData.page) : 1))
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },
    getAllPostsWithoutPagination : async (req, res) => {
        try {
            const posts = await Post.findAll()
            for (const element of posts) {
                element.dataValues.comments = (await Comments.findAll({where: {postID: element.id}})).length
            }
            return res.status(200).json(posts)
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    }, 

    getPostById: async (req, res ) => {
        try {
            const postID = req.params.post_id
            console.log('-------------------------------------')
            const post = (!req.user || req.user.role === 'user')? await Post.findOne({where: {id: postID, status: 'active'}}) : await Post.findOne({where: {id: postID}})
            if(post) {
                const like = await Like.findOne({where: {userID: req.user? req.user.id : 0, postID: post.id}})
                return res.status(200).json({
                    id: post.id,
                    title: post.title,
                    author: (await User.findOne({where: {id: post.userID}})).login,
                    authorPhoto: (await User.findOne({where: {id: post.userID}})).profilePicture, 
                    date: post.publishDate,
                    content: post.content,
                    like: like ? like.dataValues.type : undefined,
                    status: post.status,
                    rating : post.rating
                })
            } else {
                return res.status(404).json({msg: "Not Found"})
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },

    createNewPost: async (req, res) => {
        try {

            const {title, content, categories} = req.body
            console.log(categories)

            if(title && content && categories.length) {
                const post = await Post.create({
                    userID: req.user.id,
                    title: title,
                    publishDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
                    content: content,
                    status: 'active'
                })
                for (const categoryTitle of categories) {
                    const category = await Category.findOne({
                        where: { title: categoryTitle }
                    })
                    console.log(category)
                    if(category) {
                        await PostCategory.create({
                            postID: post.id,
                            categoryID: category.dataValues.id,
                        })
                    } else {
                        post.destroy()
                        return res.status(500).json({msg: 'Please, choose correct category'})
                    }
                }
                return res.status(200).json({msg: 'Post has been created!'})
            } else {
                return req.status(500).json({msg: 'Please, fill all fields'})
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },

    getCommentsByPostId: async (req, res) => {
        try {
            const postID = req.params.post_id
            const post = (!req.user || req.user.role === 'user')? await Post.findOne({where: {id: postID, status: 'active'}}) : await Post.findOne({where: {id: postID}})
            if(post){
                const comments = await Comments.findAll({where: {postID: postID}})
                if(!comments.length) {
                    return res.status(404).json({msg: "Not Found"})
                }
                let commentModificated = []
                for (const comment of comments) {
                    const like = await Like.findOne({where: {userID: req.user? req.user.id : 0, commentID: comment.id}})
                    let newComment = {
                        id: comment.id,
                        publishDate: comment.publishDate,
                        content: comment.content,
                        author: (await User.findOne({where: {id: comment.userID}})).login,
                        authorPhoto:(await User.findOne({where: {id: comment.userID}})).profilePicture,
                        like: like ? like.dataValues.type : undefined
                    }
                    commentModificated.push(newComment)
                }
                return res.status(200).json(commentModificated)
            } else {
                return res.status(404).json({msg: "Not Found"})
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },

    createCommentToPostById: async (req, res) => {
        try {
            const postID = req.params.post_id
            const post = await Post.findOne({where: {id: postID, status: 'active'}})
            if(post){
                const {content} = req.body
                if(!content) {
                    return res.status(500).json({msg: 'Please, write comment'})
                }
                let date = new Date().toISOString().slice(0, 19).replace('T', ' ');
                let userFromToken = jwt.verify(req.cookies.refreshToken, process.env.REFRESH_TOKEN_SECRET)
                await Comments.create({
                    userID: userFromToken.id,
                    postID: postID,
                    publishDate: date,
                    content: content
                })
                return res.status(200).json({msg: 'Comment has been added'})
            } else {
                return res.status(500).json({msg: "There is not such post"})
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }

    }, 

    getCategoriesByPostId: async (req, res) => {
        try {
            const postID = req.params.post_id
            const post = req.user.role === 'admin'? await Post.findOne({where: {id: postID}}) : await Post.findOne({where: {id: postID, status: 'active'}})
            if(post){
                /*const categories = await PostCategory.findAll({where: {postID: postID}})
                const categoriesNames = []
                for (const element of categories) {
                    let categoryName = await Category.findOne({where: {id: element.categoryID}})
                    categoriesNames.push({title: categoryName.dataValues.title, description: categoryName.dataValues.description})
                }
                return res.status(200).json(categoriesNames)*/
                const categories = await Post.findAll({
                    where: {id: req.params.post_id},
                    include: [{
                        model: Category,
                        as: "categories",
                        through: PostCategory
                    }]
                })
                return res.status(200).json(categories[0].categories)
            } else {
                return res.status(500).json({msg: "There is not such post"})
            }
        } catch (error) {
            return res.status(500).json({msg: error.messag})
        }
    },

    getLikesByPostId: async (req, res) => {
        try {
            const postID = req.params.post_id
            const post = req.user.role === 'admin'? await Post.findOne({where: {id: postID}}) : await Post.findOne({where: {id: postID, status: 'active'}})
            if(post) {

                const likes = await Like.findAll({where: {postID: postID}})
                if(!likes.length) {
                   return res.status(500).json([])
                } else {
                    return res.status(200).json(likes) 
                }
            } else {
                return res.status(500).json({msg: "There is not such post"})
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },

    createNewLikeToPost: async (req, res) => {
        try {
            const post = await Post.findOne({where: {id: req.params.post_id}})
            if(!post) {
                return res.status(500).json({msg: "There is not such a post"})
            } else {
                const like = await Like.findOne({where: {postID: req.params.post_id, userID: req.user.id}})
                console.log(req.body.likeType)
                if(!like || like.dataValues.type !== req.body.likeType) {
                    await Like.create({
                        userID: req.user.id,
                        postID: req.params.post_id,
                        publishDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
                        type: req.body.likeType
                    })
                    const post = await Post.findOne({where: {id: req.params.post_id}})
                    const user = await User.findOne({where: {id: post.userID}})
                    if(req.body.likeType === 'like') {
                        console.log('before')
                        if(like) {
                            post.update({
                                rating: like.dataValues.type !== req.body.likeType ? post.dataValues.rating + 2 : post.dataValues.rating + 1
                            })
                            user.update({
                                rating: like.dataValues.type !== req.body.likeType ? user.dataValues.rating + 2 : user.dataValues.rating + 1
                            })
                        } else {
                            post.update({
                                rating: post.dataValues.rating + 1
                            })
                            user.update({
                                rating: user.dataValues.rating + 1
                            })
                        }
                        console.log('before')
                    } else {
                        if(like) {
                            post.update({
                                rating: like.dataValues.type !== req.body.likeType ? post.dataValues.rating - 2 : post.dataValues.rating - 1
                            })
                            user.update({
                                rating: like.dataValues.type !== req.body.likeType ? user.dataValues.rating - 2 : user.dataValues.rating - 1
                            })
                        } else {
                            post.update({
                                rating: post.dataValues.rating - 1
                            })
                            user.update({
                                rating: user.dataValues.rating - 1
                            })
                        }
                    }
                    if (like) {
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

    deleteLikeToPost: async (req, res) => {
        try {
            const post = await Post.findOne({where: {id: req.params.post_id}})
            if(!post) {
                return res.status(500).json({msg: "There is not such a post"})
            } else {
                const like = await Like.findOne({where: {postID: req.params.post_id, userID: req.user.id}})
                console.log(req.body.likeType)
                if(like) {
                    const post = await Post.findOne({where: {id: req.params.post_id}})
                    const user = await User.findOne({where: {id: post.userID}})
                    if(like.dataValues.type === 'dislike') {
                        post.update({
                            rating: post.dataValues.rating + 1
                        })
                        user.update({
                            rating: user.dataValues.rating + 1
                        })
                    } else {
                        post.update({
                            rating: post.dataValues.rating - 1
                        })
                        user.update({
                            rating: user.dataValues.rating - 1
                        })
                    }
                    like.destroy()
                    return res.status(200).json({msg: 'Like has been deleted'})
                } else {
                    return res.status(500).json({msg: 'Can not delete'})
                }
            } 
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },

    deletePost: async (req, res) => {
        try {
            const post = await Post.findOne({where: {id: req.params.post_id}})
            if(!post) {
                return res.status(500).json({msg: "There is not such a post"})
            } else {
                if(req.user.id === post.dataValues.userID || req.user.role === 'admin') {
                    post.destroy()
                    return res.status(200).json({msg: "Post has been deleted"})
                } else {
                    return res.status(500).json({msg: 'You can not delete this post'})
                }
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },

    updatePost: async (req, res) => {
        try {
            const post = await Post.findOne({where: {id: req.params.post_id}})
            console.log(post)
            if(!post) {
                return res.status(500).json({msg: "There is not such a post"})
            } else {
                if(req.user.id === post.dataValues.userID) {
                    const {title, content, categories, status} = req.body
                    post.update({
                        title: title ? title : post.dataValues.title,
                        content: content ? content : post.dataValues.content,
                        status: status ? status : post.dataValues.status
                    })
                    return res.status(200).json({msg: "Post has been changed"})
                } else {
                    return res.status(500).json({msg: 'You can not update this post'})
                }
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    }
}

function paginate(array, page_size, page_number) {
    return {
        totalItems: array.length,
        itemsCountPerPage: page_size,
        totalPages: Math.ceil(array.length / page_size),
        currentPage: page_number,
        posts: array.slice((page_number - 1) * page_size, page_number * page_size)
    }
}

function getPostsForUser(req, posts) {
    for (let i = 0; i < posts.length; i++) {
        if(posts[i].dataValues.status === 'locked' && (!req.user || posts[i].dataValues.userID !== req.user.id)){
            posts[i] = {}
        }
    }
    posts = posts.filter(element => Object.keys(element).length !== 0) 
    return posts
}

function findCommonElement(array1, array2) {
     
    // Loop for array1
    for(let i = 0; i < array1.length; i++) {
         
        // Loop for array2
        for(let j = 0; j < array2.length; j++) {
             
            // Compare the element of each and
            // every element from both of the
            // arrays
            if(array1[i] === array2[j]) {
             
                // Return if common element found
                return true;
            }
        }
    }
     
    // Return if no common element exist
    return false;
}

module.exports = postController