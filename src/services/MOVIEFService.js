import { Model } from 'sequelize';
import db from '../models/index.js';


let addFavorite = async (userId, movieId) => {
    let existed = await db.Favorite.findOne({ where: { userId, movieId } });
    if (existed) return { success: false, message: 'Đã yêu thích phim này.' };
    await db.Favorite.create({ userId, movieId });
    return { success: true, favorited: true };
};

let removeFavorite = async (userId, movieId) => {
    let deleted = await db.Favorite.destroy({ where: { userId, movieId } });
    if (!deleted) return { success: false, message: 'Không tìm thấy phim yêu thích.' };
    return { success: !!deleted, favorited: false };
};

let getFavoriteMovieIds = async (userId) => {
    let favs = await db.Favorite.findAll({ where: { userId }, raw: true });
    return favs.map(f => f.movieId);
};

module.exports = {
    addFavorite: addFavorite,
    removeFavorite: removeFavorite,
    getFavoriteMovieIds: getFavoriteMovieIds,
};