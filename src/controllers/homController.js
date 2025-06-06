import db from '../models/index.js';
import CRUDService from '../services/CRUDservice.js';
import MOVIEService from '../services/MOVIEservice.js';

let getHomPage = async (req, res) => {
    let movies = await MOVIEService.getAllMovies();
    return res.render('homepage.ejs', { user: req.session.user || null, moviesNew: movies });
};
let getTestPage = (req, res) => {
    return res.render('test/test1.ejs');
}
let getMoviePage = (req, res) => {
    return res.render('movie_1.ejs', { user: req.session.user || null });
};
let getLoginPage = (req, res) => {
    return res.render('login_page.ejs');
}
let getDashboardPage = (req, res) => {
    return res.render('dashboard.ejs');
};

let viewAllMovies = (req, res) => {
    return res.render('all_movies.ejs', { user: req.session.user || null });
}

// Hàm để lấy trang CRUD
let getCRUD = (req, res) => {
    return res.render('crud.ejs');
};
// Hàm để xử lý đăng ký người dùng
let postCRUD = async (req, res) => {
    await CRUDService.createNewUser(req.body);
    req.session.user = { username: req.body.username, email: req.body.email };
    let movies = await MOVIEService.getAllMovies(); // thêm dòng này
    return res.render('homepage.ejs', { user: req.session.user, moviesNew: movies }); // truyền moviesNew
}

// Hàm để hiển thị danh sách người dùng
let displayGetCRUD = async (req, res) => {  
    let data = await CRUDService.getAllUser();
    return res.render('displayCRUD.ejs', {
        dataTable: data,
    });
}

// Hàm để lấy trang chỉnh sửa người dùng
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

// Hàm để cập nhật thông tin người dùng
let putCRUD = async (req, res) => {
    let data = req.body;
    let allUser = await CRUDService.updateUserData(data);
    return res.render('displayCRUD.ejs', {
        dataTable: allUser,
    })

}

// Hàm để xóa người dùng theo ID
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

// Hàm để xử lý đăng nhập
let postLogin = async (req, res) => {
    let { email, password } = req.body;
    let user = await CRUDService.checkLogin(email, password);
    if (user) {
        req.session.user = { username: user.username, email: user.email };
        return res.redirect('/');
    } else {
        return res.render('login_page.ejs', { error: 'Sai email hoặc mật khẩu', user: null });
    }
};

// Hàm để xử lý đăng xuất
let logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

// Hàm để hiển thị trang chi tiết phim
let displayGetMovie = async(req, res) => {
    let data = await MOVIEService.getAllMovies();
    return res.render('displayMovie.ejs', {
        dataTable: data,
    });
}
let getEditMovie = async (req, res) => {
    return res.render('editMovie.ejs');
}

module.exports = {
    getHomPage: getHomPage,
    getTestPage: getTestPage,
    getMoviePage: getMoviePage,
    viewAllMovies: viewAllMovies,
    getLoginPage: getLoginPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getDashboardPage: getDashboardPage,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
    postLogin: postLogin,
    logout: logout,
    displayGetMovie: displayGetMovie,
    getEditMovie: getEditMovie,
}