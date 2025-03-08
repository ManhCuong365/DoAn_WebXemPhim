let getHomPage = (req, res) => {
    return res.render('homepage.ejs');
}
let getTestPage = (req, res) => {
    return res.render('test/test1.ejs');
}

module.exports = {
    getHomPage: getHomPage,
    getTestPage: getTestPage
}