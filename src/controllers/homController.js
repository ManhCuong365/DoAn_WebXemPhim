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

module.exports = {
    getHomPage: getHomPage,
    getTestPage: getTestPage,
    getMoviePage: getMoviePage,
    getAllMovie: getAllMovie,
}