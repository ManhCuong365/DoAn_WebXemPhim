'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Movies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false, // Tên phim không được để trống
      },
      rating: {
        type: Sequelize.FLOAT, // Đánh giá phim (số thập phân)
        allowNull: false,
      },
      director: {
        type: Sequelize.STRING, // Tên đạo diễn
        allowNull: true, // Có thể để trống nếu không có thông tin
      },
      actors: {
        type: Sequelize.TEXT, // Danh sách diễn viên (chuỗi dài)20
        allowNull: true,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      year: {
        type: Sequelize.INTEGER, // Năm phát hành phim
        allowNull: true, // Có thể để trống nếu không có thông tin
      },
      description: {
        type: Sequelize.TEXT, // Mô tả phim (chuỗi dài)
        allowNull: true,
      },
      img: {
        type: Sequelize.STRING, // Đường dẫn đến ảnh đại diện của phim
        allowNull: true,
        defaultValue: null, // Giá trị mặc định nếu không có ảnh
      },
      videoUrl:{
        type: Sequelize.STRING, // Đường dẫn đến video của phim
        allowNull: true,
      },
      youtubeUrl: {
        type: Sequelize.STRING, // Đường dẫn đến video trên YouTube
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: true,
        defaultValue: 'active',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Movies');
  },
};