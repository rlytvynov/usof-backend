const sequelize = require('../database/db')
const { DataTypes } = require('sequelize')

const Like = sequelize.define( "Like",{
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
        allowNull: true
    },
    commentID: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    publishDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM,
        values: ["like", "dislike"],
        allowNull: false
    }
},{
    tableName: 'likes',
    timestamps: false
})

Like.sync()

module.exports = Like