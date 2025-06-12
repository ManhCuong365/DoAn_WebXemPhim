'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        static associate(models) {

            Comment.belongsTo(models.User, { foreignKey: 'userId' });
            Comment.belongsTo(models.Movie, { foreignKey: 'movieId' });
        }
    }
    Comment.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            movieId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },

        },
        {
            sequelize,
            modelName: 'Comment',
            tableName: 'Comments',
        }
    );
    return Comment;
};