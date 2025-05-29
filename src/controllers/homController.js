import db from '../models/index.js';
import CRUDService from '../services/CRUDservice.js';

let getHomPage = (req, res) => {
    return res.render('homepage.ejs');
}
let getTestPage = (req, res) => {
    return res.render('test/test1.ejs');
}
let getMoviePage = (req, res) => {
    return res.render('movie_1.ejs');
};
let getAllMovie = (req, res) => {
    return res.render('all_movies.ejs');
};
let getCRUD = (req, res) => {
    return res.render('crud.ejs');
};
let postCRUD = async (req, res) => {
    await CRUDService.createNewUser(req.body);
    return res.send('post crud from server');
}
let displayGetCRUD = async (req, res) => {  
    let data = await CRUDService.getAllUser();
    console.log('data from get all user:', data);
    return res.render('displayCRUD.ejs', {
        dataTable: data,
    });
}
let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        return res.render('editCRUD.ejs', {
            user: userData,
        });
    }
    else {
         return res.send('User not found');
    }
}
let putCRUD = async (req, res) => {
    let data = req.body;
    let allUser = await CRUDService.updateUserData(data);
    return res.render('displayCRUD.ejs', {
        dataTable: allUser,
    })

}

module.exports = {
    getHomPage: getHomPage,
    getTestPage: getTestPage,
    getMoviePage: getMoviePage,
    getAllMovie: getAllMovie,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
}