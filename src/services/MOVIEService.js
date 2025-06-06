import db from '../models/index.js';


let createMovie = async (data) => {
    try {
        await db.Movie.create({
            title: data.title,
            rating: data.rating,
            actors: data.actors,
            category: data.category,
            status: data.status,
        });
        return true;
    } catch (e) {
        throw e;
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
    createMovie: createMovie,
    getAllMovies: getAllMovies,
};