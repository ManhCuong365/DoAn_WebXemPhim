'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define('Favorite', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    tableName: 'Favorites'
  });

  Favorite.associate = function(models) {
    Favorite.belongsTo(models.User, { foreignKey: 'userId' });
    Favorite.belongsTo(models.Movie, { foreignKey: 'movieId' });
  };

  return Favorite;
};