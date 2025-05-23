import express from "express";
import homController from "../controllers/homController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homController.getHomPage);

    router.get('/test1', homController.getTestPage);

    router.get('/buimanhcuong', (req, res) => {
        return res.send('Hello world with buimanhcuong');
    });

    // Thêm route cho movie_1
    router.get('/movie_1', (req, res) => {
        return res.render("movie_1");  // Render file movie_1.ejs
    });

    router.get('/all_movies', (req, res) => {
        return res.render("all_movies");  // Render file movie_1.ejs
    });

    return app.use("/", router);
};

module.exports = initWebRoutes;