import express from "express";
import homController from "../controllers/homController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homController.getHomPage);

    router.get('/test1', homController.getTestPage);

    router.get('/buimanhcuong',(req, res) =>{
        return res.send('Hello world with buimanhcuong')
    });
    
    return app.use("/", router);
}

module.exports = initWebRoutes;