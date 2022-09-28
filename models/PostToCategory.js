const sequelize = require('../database/db')
const { DataTypes } = require('sequelize')
const Post = require('./PostModel.js')
const Category = require('./CategoryModel.js')

const PostCategory = sequelize.define("Post_Category", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    postID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    categoryID: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},{
    tableName: 'posts_categories',
    timestamps: false 
})

Post.belongsToMany(Category, {
    through: PostCategory,
    as: "categories",
    foreignKey: "postID",
    otherKey: "categoryID"
})

Category.belongsToMany(Post, {
    through: PostCategory,
    as: "posts",
    foreignKey: "categoryID",
    otherKey: "postID"
})

PostCategory.sync()

module.exports = PostCategory