const Post = require('../models/PostModel')
const Category = require('../models/CategoryModel')
const PostCategory = require('../models/PostToCategory');

const categoryController = {
    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.findAll()
            if(categories) {
                return res.status(200).json(categories)
            } else {
                return res.status(200).json({msg: 'Categories not found'})
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },

    getCategory : async (req, res) => {
        try {
            const category = await Category.findOne({where: {id: req.params.category_id}})
            if(category) {
                return res.status(200).json(category)
            } else {
                return res.status(500).json({msg: "Such category does not exists"})
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },

    getPostsByCategory : async (req, res) => {
        try {
            const category = await Category.findOne({where: {id: req.params.category_id}})
            if(category){
                const posts = await Category.findAll({
                    where: {id: req.params.category_id},
                    include: [{
                        model: Post,
                        as: "posts",
                        through: PostCategory
                    }]
                })
                return res.status(200).json(posts[0].posts)
            } else {
                return res.status(500).json({msg: "There is not such category"})
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },

    createNewCategory: async (req, res) => {
        try {
            const {title, description} = req.body
            if(!title) return res.status(500).json({msg: 'Please, type a title'})

            const category = await Category.findOne({where: {title: title}})
            if(category) {
                return res.status(500).json({msg: 'Such category already exists'})
            } else {
                await Category.create({
                    title: title,
                    description: description? description : 'No description'
                })
                return res.status(500).json({msg: 'Created!'})
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    },

    updateCategory : async (req, res) => {

        try {
            const category = await Category.findOne({where: {id: req.params.category_id}})
            const {title, description} = req.body
            if(category) {
                category.update({
                    title: title ? title : category.dataValues.title,
                    description: description ? description : category.dataValues.description,
                })
                return res.status(200).json({msg: "Data was updated"})
            } else {
                return res.status(500).json({msg: "Such category does not exists"})
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }


    },

    deleteCategory : async (req, res) => {
        try {
            const category = await Category.findOne({where: {id: req.params.category_id}})
            if(category) {
                category.destroy()
                return res.status(200).json({msg: "Category was deleted"})
            } else {
                return res.status(500).json({msg: "Such category does not exists"})
            }
        } catch (error) {
            return res.status(500).json({msg: error.message})
        }
    }
}

module.exports = categoryController
