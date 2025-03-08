import express from "express";

let configViewEngine = (app) => {
    app.use(express.static("./src/public"));
    const ejs = require("ejs");  // Thêm dòng này
    app.set("view engine", "ejs"); // Chỉ cần truyền vào "ejs" dưới dạng chuỗi
    app.set("views", "./src/views")
}

module.exports = configViewEngine