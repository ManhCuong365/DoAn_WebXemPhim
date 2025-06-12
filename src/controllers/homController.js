import db from '../models/index.js';
import CRUDService from '../services/CRUDservice.js';
import MOVIEService from '../services/MOVIEservice.js';
import MOVIEFService from '../services/MOVIEFService.js';
import COMService from '../services/COMService.js';
import { Op } from 'sequelize';

// 1. Trang chủ và Dashboard
let getHomPage = async (req, res) => {
    let movies = await MOVIEService.getAllMovies();
    let favoriteMovieIds = [];
    if (req.session.user) {
        let user = await db.User.findOne({ where: { email: req.session.user.email } });
        let favs = await db.Favorite.findAll({ where: { userId: user.id }, raw: true });
        favoriteMovieIds = favs.map(f => f.movieId);
    }
    return res.render('homepage.ejs', {
        user: req.session.user || null,
        moviesNew: movies,
        favoriteMovieIds
    });
};
let getDashboardPage = async (req, res) => {
    let topItems = await db.Movie.findAll({
        order: [['rating', 'DESC']],
        limit: 5,
        raw: true
    });

    let latestItems = await db.Movie.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        raw: true
    });

    let latestUsers = await db.User.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        raw: true
    });

    let latestFavorite = await db.Comment.findAll({
        order: [['createdAt', 'DESC']],
        limit: 5,
        include: [
            { model: db.Movie, attributes: ['title'] },
            { model: db.User, attributes: ['username'] }
        ],
        raw: true,
        nest: true
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

    let favoritesThisMonth = await db.Favorite.count({
        where: {
            createdAt: { [Op.gte]: startOfMonth }
        }
    });
    let commentsThisMonth = await db.Comment.count({
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
        latestFavorite,
        favoritesThisMonth,
        commentsThisMonth
    });
};


// 2. Phim (Movie))
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
let getMoviePage = (req, res) => {
    return res.render('movie_1.ejs', { user: req.session.user || null });
};
let getMovie = (req, res) => {
    return res.render('createMovie.ejs');
}
let displayGetMovie = async (req, res) => {
    let data = await MOVIEService.getAllMovies();
    return res.render('displayMovie.ejs', {
        dataTable: data,
    });
}
let getRecommendMovies = async (req, res) => {
    let movies = await MOVIEFService.getAllMovies();
    return res.render('movie_1.ejs', {
        movies,
        user: req.session.user || null
    });
}
let getMovieDetail = async (req, res) => {
    let id = req.query.id;
    let movie = await db.Movie.findOne({ where: { id }, raw: true });
    let movies = await db.Movie.findAll({
        where: { id: { [db.Sequelize.Op.ne]: id } },
        raw: true,
        limit: 6,
    });
    // Lấy bình luận và user
    let comments = await db.Comment.findAll({
        where: { movieId: id },
        include: [{ model: db.User, attributes: ['username'] }],
        order: [['createdAt', 'DESC']],
        raw: true
    });
    res.render('movie_1.ejs', {
        movie,
        movies,
        user: req.session.user || null,
        comments
    });
};


// 3. CRUD phim
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


// 4. CRUD người dùng
let getCRUD = (req, res) => {
    return res.render('crud.ejs');
};

let postCRUD = async (req, res) => {
    await CRUDService.createNewUser(req.body);
    req.session.user = { username: req.body.username, email: req.body.email };
    let movies = await MOVIEService.getAllMovies();

    let favoriteMovieIds = [];
    if (req.session.user) {
        let user = await db.User.findOne({ where: { email: req.session.user.email } });
        let favs = await db.Favorite.findAll({ where: { userId: user.id }, raw: true });
        favoriteMovieIds = favs.map(f => f.movieId);
    }

    return res.render('homepage.ejs', {
        user: req.session.user,
        moviesNew: movies,
        favoriteMovieIds // truyền vào view
    });
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

// 5. Đăng nhập và đăng xuất
let postLogin = async (req, res) => {
    let { email, password } = req.body;
    let user = await CRUDService.checkLogin(email, password);
    if (user) {
        req.session.user = { username: user.username, email: user.email };
        return res.redirect('/');
    } else {
        return res.render('login_page.ejs', { error: 'Wrong email or password', success: null, user: null });
    }
};

let getLoginPage = (req, res) => {
    return res.render('login_page.ejs', { error: null, success: null });
}
let logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};


// 6. Thêm và xóa phim yêu thích
let addFavorite = async (req, res) => {
    if (!req.session.user) {
        return res.send('Bạn cần đăng nhập để thực hiện thao tác này.');
    }
    let user = await db.User.findOne({ where: { email: req.session.user.email } });
    let { movieId } = req.body;
    let result = await MOVIEFService.addFavorite(user.id, movieId);

    // Sau khi xử lý, lấy lại movies và render homepage
    let movies = await MOVIEService.getAllMovies();
    let favoriteMovieIds = [];
    if (req.session.user) {
        let user = await db.User.findOne({ where: { email: req.session.user.email } });
        let favs = await db.Favorite.findAll({ where: { userId: user.id }, raw: true });
        favoriteMovieIds = favs.map(f => f.movieId);
    }
    return res.render('homepage.ejs', {
        user: req.session.user || null,
        moviesNew: movies,
        favoriteMovieIds,
        success: result.success ? 'Đã thêm vào danh sách yêu thích!' : null,
        error: result.success ? null : result.message
    });
};

let removeFavorite = async (req, res) => {
    if (!req.session.user) {
        return res.send('Bạn cần đăng nhập để thực hiện thao tác này.');
    }
    let user = await db.User.findOne({ where: { email: req.session.user.email } });
    let { movieId } = req.body;
    let result = await MOVIEFService.removeFavorite(user.id, movieId);

    // Sau khi xử lý, lấy lại movies và render homepage
    let movies = await MOVIEService.getAllMovies();
    let favoriteMovieIds = [];
    if (req.session.user) {
        let user = await db.User.findOne({ where: { email: req.session.user.email } });
        let favs = await db.Favorite.findAll({ where: { userId: user.id }, raw: true });
        favoriteMovieIds = favs.map(f => f.movieId);
    }
    return res.render('homepage.ejs', {
        user: req.session.user || null,
        moviesNew: movies,
        favoriteMovieIds,
        success: result.success ? 'Đã bỏ khỏi danh sách yêu thích!' : null,
        error: result.success ? null : result.message
    });
};

let addFavoriteAll = async (req, res) => {
    if (!req.session.user) {
        return res.send('Bạn cần đăng nhập để thực hiện thao tác này.');
    }
    let user = await db.User.findOne({ where: { email: req.session.user.email } });
    let { movieId } = req.body;
    let result = await MOVIEFService.addFavorite(user.id, movieId);

    let movies = await db.Movie.findAll({ raw: true });
    let favoriteMovieIds = [];
    if (req.session.user) {
        let favs = await db.Favorite.findAll({ where: { userId: user.id }, raw: true });
        favoriteMovieIds = favs.map(f => f.movieId);
    }
    return res.render('all_movies.ejs', {
        movies,
        user: req.session.user || null,
        favoriteMovieIds,
        success: result.success ? 'Đã thêm vào danh sách yêu thích!' : null,
        error: result.success ? null : result.message
    });
};

let removeFavoriteAll = async (req, res) => {
    if (!req.session.user) {
        return res.send('Bạn cần đăng nhập để thực hiện thao tác này.');
    }
    let user = await db.User.findOne({ where: { email: req.session.user.email } });
    let { movieId } = req.body;
    let result = await MOVIEFService.removeFavorite(user.id, movieId);

    let movies = await db.Movie.findAll({ raw: true });
    let favoriteMovieIds = [];
    if (req.session.user) {
        let favs = await db.Favorite.findAll({ where: { userId: user.id }, raw: true });
        favoriteMovieIds = favs.map(f => f.movieId);
    }
    return res.render('all_movies.ejs', {
        movies,
        user: req.session.user || null,
        favoriteMovieIds,
        success: result.success ? 'Đã bỏ khỏi danh sách yêu thích!' : null,
        error: result.success ? null : result.message
    });
};


// 7. Bình luận
let postComment = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login_page');
    }
    const { movieId, content } = req.body;
    const user = await db.User.findOne({ where: { email: req.session.user.email } });
    await db.Comment.create({
        content,
        movieId,
        userId: user.id,
        createdAt: new Date()
    });
    res.redirect(`/movie_detail?id=${movieId}`);
};
let displayComment = async (req, res) => {
    let data = await db.Comment.findAll({
        include: [
            { model: db.User, attributes: ['username'] },
            { model: db.Movie, attributes: ['title'] }
        ],
        raw: true
    });
    res.render('display_comment.ejs', { dataTable: data });
};
let deleteComment = async (req, res) => {
    let id = req.query.id;
    await COMService.deleteCommentById(id);
    let data = await db.Comment.findAll({
        include: [
            { model: db.User, attributes: ['username'] },
            { model: db.Movie, attributes: ['title'] }
        ],
        raw: true
    });
    res.render('display_comment.ejs', { dataTable: data });
};


module.exports = {
    getHomPage: getHomPage,
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
    addFavoriteAll: addFavoriteAll,
    removeFavoriteAll: removeFavoriteAll,
    getRecommendMovies: getRecommendMovies,
    postComment: postComment,
    deleteComment: deleteComment,
    displayComment: displayComment,

}