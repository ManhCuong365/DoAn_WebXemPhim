'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    static associate(models) {
      Movie.belongsToMany(models.User, { through: 'Favorite', foreignKey: 'movieId' });
    }
  }

  Movie.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      director: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      actors: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: true, // Có thể để trống nếu không có thông tin
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null, // Giá trị mặc định nếu không có ảnh
      },
      videoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      youtubeUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'), // Chỉ nhận 2 giá trị này
        allowNull: true,
        defaultValue: 'active', // Mặc định là 'active'
      }
    },
    {
      sequelize,
      modelName: 'Movie',
    }
  );

  return Movie;
};