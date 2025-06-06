import db from '../models/index.js';


let createNewMovie = async (data) => {
    try {
        await db.Movie.create({
            title: data.title,
            rating: data.rating,
            actors: data.actors,
            category: data.category,
            description: data.description,
            img: data.img,
            videoUrl: data.videoUrl,
            status: data.status,
        });
        console.log('Tạo phim thành công!');
    } catch (error) {
        console.log('Lỗi khi tạo phim:', error);
    }
};


let getAllMovies = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let movies = await db.Movie.findAll({ raw: true });
            resolve(movies);
        } catch (e) {
            reject(e);
        }
    });
};


// Thêm các hàm update, delete, getById nếu cần

module.exports = {
    createNewMovie: createNewMovie,
    getAllMovies: getAllMovies,
};