const sequelize = require('../database/db')
const { DataTypes } = require('sequelize')
const Like = require('./LikeModel.js')
const Post = require('./PostModel.js')

const Comment = sequelize.define("Comment", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    postID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    publishDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
},{
    tableName: 'comments',
    timestamps: false
})

Comment.sync()

Comment.hasMany(Like, {
    foreignKey: "commentID",
    onDelete: "cascade"
})

module.exports = Comment