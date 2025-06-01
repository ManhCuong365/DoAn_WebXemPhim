import db from '../models/index.js';
import CRUDService from '../services/CRUDservice.js';

let getHomPage = (req, res) => {
    return res.render('homepage.ejs', { user: req.session.user || null });
}
let getTestPage = (req, res) => {
    return res.render('test/test1.ejs');
}
let getMoviePage = (req, res) => {
    return res.render('movie_1.ejs');
};
let getAllMovie = (req, res) => {
    return res.render('all_movies.ejs', { user: req.session.user || null });
};
let getLoginPage = (req, res) => {
    return res.render('login_page.ejs');
}
let getCRUD = (req, res) => {
    return res.render('crud.ejs');
};
let postCRUD = async (req, res) => {
    await CRUDService.createNewUser(req.body);
    // Lưu user vào session sau khi đăng ký
    req.session.user = { username: req.body.username, email: req.body.email };
    return res.render('homepage.ejs', { user: req.session.user });
}
let displayGetCRUD = async (req, res) => {  
    let data = await CRUDService.getAllUser();
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
let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDService.deleteUserById(id);
        return res.send('Delete user succeed!');
    }
    else {
        return res.send('User not found');
    }
}

let postLogin = async (req, res) => {
    let { email, password } = req.body;
    let user = await CRUDService.checkLogin(email, password);
    if (user) {
        req.session.user = { username: user.username, email: user.email };
        return res.redirect('/'); // chuyển về trang chủ
    } else {
        return res.render('login_page.ejs', { error: 'Sai email hoặc mật khẩu', user: null });
    }
};

module.exports = {
    getHomPage: getHomPage,
    getTestPage: getTestPage,
    getMoviePage: getMoviePage,
    getAllMovie: getAllMovie,
    getLoginPage: getLoginPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
    postLogin: postLogin,
}