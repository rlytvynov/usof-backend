const sequelize = require('../database/db')
const { DataTypes } = require('sequelize')
const Comment = require('./CommentModel.js')
const Like = require('./LikeModel.js')

const Post = sequelize.define("Post", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    publishDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'active',
        allowNull: false
    }
},{
    tableName: 'posts',
    timestamps: false
})

Post.sync()

Post.hasMany(Comment, {
    foreignKey: "postID",
    onDelete: "cascade"
})

//Comment.belongsTo(Post)

Post.hasMany(Like, {
    foreignKey: "postID",
    onDelete: "cascade"
})

module.exports = Post