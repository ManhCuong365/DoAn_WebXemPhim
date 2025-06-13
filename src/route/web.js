import express from "express";
import homController from "../controllers/homController";
import multer from 'multer';


let router = express.Router();
let upload = multer({ dest: 'uploads/' });

let initWebRoutes = (app) => {
    router.get('/', homController.getHomPage);
    router.get('/all_movies', homController.viewAllMovies);
    router.get('/crud', homController.getCRUD);
    router.post('/post-crud', homController.postCRUD);
    router.get('/movie_1', homController.getMoviePage);
    router.get('/dashboard', homController.getDashboardPage);
    router.get('/displayCRUD', homController.displayGetCRUD);
    router.get('/get-crud', homController.displayGetCRUD);
    router.get('/edit-crud', homController.getEditCRUD);
    router.post('/put-crud', homController.putCRUD);
    router.get('/delete-crud', homController.deleteCRUD);
    router.post('/login', homController.postLogin);
    router.get('/logout', homController.logout);
    router.get('/displayMovie', homController.displayGetMovie);
    router.get('/get-movie', homController.getMovie);
    router.post('/post-movie', upload.fields([
        { name: 'imgFile', maxCount: 1 },
        { name: 'videoUrl', maxCount: 1 }
    ]), homController.postMovie);
    router.get('/edit-movie', homController.getEditMovie);
    router.post('/put-movie', upload.fields([
        { name: 'imgFile', maxCount: 1 },
        { name: 'videoUrl', maxCount: 1 }
    ]), homController.putMovie);
    router.get('/delete-movie', homController.deleteMovie);
    router.post('/favorite/add', homController.addFavorite);
    router.post('/favorite/remove', homController.removeFavorite);
    router.post('/all_movies/favorite/add', homController.addFavoriteAll);
    router.post('/all_movies/favorite/remove', homController.removeFavoriteAll);
    router.post('/comment', homController.postComment);
    router.get('/displayComment', homController.displayComment);
    router.get('/comment/delete', homController.deleteComment);

    router.get('/movie_1', (req, res) => {
        return res.render("movie_1");
    });

    router.get('/login_page', homController.getLoginPage);
    router.get('/movie_detail', homController.getMovieDetail);
    router.get('/profile', homController.getProfilePage);

    return app.use("/", router);
};

module.exports = initWebRoutes;