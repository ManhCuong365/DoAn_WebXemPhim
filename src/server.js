import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngines";
import initWebRoutes from './route/web';
import connectDB from "./config/connectDB";
import path from "path";  // Thêm module path
import session from 'express-session';
require('dotenv').config();

let app = express();

app.use(session({
    secret: 'your-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000 // 1 ngày
    }
}));
// Cấu hình Express để phục vụ file tĩnh từ thư mục 'public'
app.use(express.static(path.join(__dirname, 'public')));
// Cấu hình Express để phục vụ file tĩnh từ thư mục 'uploads'
app.use('/uploads', express.static('uploads'));

// Cấu hình body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Cấu hình view engine
viewEngine(app);

// Khởi tạo các routes
initWebRoutes(app);

connectDB();

let port = process.env.PORT;

app.listen(port, () => {
    console.log("Running on the port: " + port);
});
