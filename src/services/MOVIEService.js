import { up } from '../migrations/20250513074147-create-movies.js';
import db from '../models/index.js';


let createNewMovie = async (data) => {
    try {
        await db.Movie.create({
            title: data.title,
            rating: data.rating,
            actors: data.actors,
            director: data.director,
            year: data.year,
            category: data.category,
            description: data.description,
            img: data.img,
            videoUrl: data.videoUrl,
            youtubeUrl: data.youtubeUrl,
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

let getMovieById = (movieId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let movie = await db.Movie.findOne({
                where: { id: movieId },
                raw: true,
            });
            if (movie) {
                resolve(movie);
            } else {
                resolve({});
            }
        } catch (e) {
            reject(e);
        }
    });
};

let updateMovieById = async (data) => {
    await db.Movie.update(
        {
            title: data.title,
            description: data.description,
            img: data.img,
            videoUrl: data.videoUrl,
            youtubeUrl: data.youtubeUrl,
            director: data.director,
            year: data.year,
            actors: data.actors,
            rating: data.rating,
            category: data.category,
            status: data.status
        },
        { where: { id: data.id } }
    );
};


let deleteMovieById = async (movieId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let movie = await db.Movie.findOne({
                where: { id: movieId },
            });
            if (movie) {
                await movie.destroy();
            } 

            resolve();
        } catch (e) {
            reject(e);
        }
    }
    );
}

// Thêm các hàm update, delete, getById nếu cần

module.exports = {
    createNewMovie: createNewMovie,
    getAllMovies: getAllMovies,
    deleteMovieById: deleteMovieById,
    getMovieById: getMovieById,
    updateMovieById: updateMovieById,
};