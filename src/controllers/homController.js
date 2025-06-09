import db from '../models/index.js';
import CRUDService from '../services/CRUDservice.js';
import MOVIEService from '../services/MOVIEservice.js';
import MOVIEFService from '../services/MOVIEFService.js';
import { Op } from 'sequelize';

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
let getDashboardPage = async (req, res) => {
    // Lấy top items (ví dụ: top 5 phim rating cao nhất)
    let topItems = await db.Movie.findAll({
        order: [['rating', 'DESC']],
        limit: 5,
        raw: true
    });

    // Lấy latest items (phim mới nhất)
    let latestItems = await db.Movie.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        raw: true
    });

    // Lấy latest users
    let latestUsers = await db.User.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        raw: true
    });

    let now = new Date();
    let startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    let usersThisMonth = await db.User.count({
        where: {
            createdAt: { [Op.gte]: startOfMonth }
        }
    });

    let itemsAddedThisMonth = await db.Movie.count({
        where: {
            createdAt: { [Op.gte]: startOfMonth }
        }
    });

    res.render('dashboard.ejs', {
        topItems,
        latestItems,
        latestUsers,
        usersThisMonth,
        itemsAddedThisMonth,
        // latestReviews
    });
};

let viewAllMovies = async (req, res) => {
    let movies = await db.Movie.findAll({ raw: true });
    let favoriteMovieIds = [];
    if (req.session.user) {
        let user = await db.User.findOne({ where: { email: req.session.user.email } });
        let favs = await db.Favorite.findAll({ where: { userId: user.id }, raw: true });
        favoriteMovieIds = favs.map(f => f.movieId);
    }
    res.render('all_movies.ejs', {
        movies,
        user: req.session.user || null,
        favoriteMovieIds
    });
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

let getMovie = (req, res) => {
    return res.render('createMovie.ejs');
}

// Hàm để hiển thị trang chi tiết phim
let displayGetMovie = async (req, res) => {
    let data = await MOVIEService.getAllMovies();
    return res.render('displayMovie.ejs', {
        dataTable: data,
    });
}
// Hàm để xử lý tạo phim mới
let postMovie = async (req, res) => {
    let imgFile = req.files['imgFile'] ? req.files['imgFile'][0].filename : null;
    let videoFile = req.files['videoUrl'] ? req.files['videoUrl'][0].filename : null;
    let { title, description, imgUrl, director, actors, rating, category, status, year, youtubeUrl } = req.body; // thêm youtubeUrl

    await MOVIEService.createNewMovie({
        title,
        description,
        img: imgFile || imgUrl,
        videoUrl: videoFile,
        director,
        actors,
        rating,
        category,
        status,
        year,
        youtubeUrl
    });
    return res.redirect('/displayMovie');
};

let getEditMovie = async (req, res) => {
    let movieId = req.query.id;
    if (movieId) {
        let movieData = await MOVIEService.getMovieById(movieId);
        return res.render('editMovie.ejs', {
            movie: movieData,
        });
    } else {
        return res.send('Movie not found');
    }
}

let putMovie = async (req, res) => {
    let imgFile = req.files['imgFile'] ? req.files['imgFile'][0].filename : null;
    let videoFile = req.files['videoUrl'] ? req.files['videoUrl'][0].filename : null;
    let { id, title, description, imgUrl, director, actors, rating, category, year, status } = req.body;

    await MOVIEService.updateMovieById({
        id,
        title,
        description,
        img: imgFile || imgUrl,
        videoUrl: videoFile,
        director,
        actors,
        rating,
        category,
        year,
        status
    });
    return res.redirect('/displayMovie');
};

let deleteMovie = async (req, res) => {
    let id = req.query.id;
    await MOVIEService.deleteMovieById(id);
    return res.redirect('/displayMovie');
}

let getMovieDetail = async (req, res) => {
    let id = req.query.id;
    let movie = await db.Movie.findOne({ where: { id }, raw: true });
    // Nếu có bảng comment, lấy thêm comment ở đây
    // let comments = await db.Comment.findAll({ where: { movieId: id }, raw: true });
    res.render('movie_1.ejs', {
        movie,
        // comments,
        user: req.session.user || null
    });
};

let addFavorite = async (req, res) => {
    if (!req.session.user) {
        return res.send('Bạn cần đăng nhập để thực hiện thao tác này.');
    }
    let user = await db.User.findOne({ where: { email: req.session.user.email } });
    let { movieId } = req.body;
    let result = await MOVIEFService.addFavorite(user.id, movieId);
    return res.json(result);
};

let removeFavorite = async (req, res) => {
    if (!req.session.user) {
        return res.send('Bạn cần đăng nhập để thực hiện thao tác này.');
    }
    let user = await db.User.findOne({ where: { email: req.session.user.email } });
    let { movieId } = req.body;
    let result = await MOVIEFService.removeFavorite(user.id, movieId);
    return res.json(result);
};

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
    getMovie: getMovie,
    postMovie: postMovie,
    displayGetMovie: displayGetMovie,
    getEditMovie: getEditMovie,
    putMovie: putMovie,
    deleteMovie: deleteMovie,
    getMovieDetail: getMovieDetail,
    addFavorite: addFavorite,
    removeFavorite: removeFavorite,
}