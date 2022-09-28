const sequelize = require('../database/db')
const { DataTypes } = require('sequelize')
const Post = require('./PostModel.js')
const Comment = require('./CommentModel.js')
const Like = require('./LikeModel.js')

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        trim: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM,
        values: ["user", "admin"],
        defaultValue: 'user',
        allowNull: false
    },
    profilePicture: {
        type: DataTypes.STRING,
        defaultValue: "http://cdn.onlinewebfonts.com/svg/img_420635.png"
    },
    rating: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
},{
    tableName: 'users',
    timestamps: false
})

User.hasMany(Like, {
    foreignKey: 'userID',
    onDelete: "cascade"
})

User.hasMany(Post, {
    foreignKey: 'userID',
    onDelete: "cascade"
})

User.hasMany(Comment, {
    foreignKey: 'userID',
    onDelete: "cascade"
})

User.sync()

module.exports = User