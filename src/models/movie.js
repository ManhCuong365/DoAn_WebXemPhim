'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    static associate(models) {
      // Định nghĩa quan hệ nếu cần
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
        allowNull: true,
      },
      actors: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },  
      img: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      videoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive'), // Chỉ nhận 2 giá trị này
        allowNull: false,
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