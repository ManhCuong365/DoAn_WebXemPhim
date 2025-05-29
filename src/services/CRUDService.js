import db from '../models/index.js';

let createNewUser = async (data) => {
    try {
        await db.User.create({
            username: data.username,
            email: data.email,
            password: data.password,
        });
        console.log('Tạo người dùng thành công!');
    } catch (error) {
        console.log('Lỗi khi tạo người dùng:', error);
    }
}
let getAllUser = () => {
    return new Promise((resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true, 
            });
            resolve(users);
        }catch (e) {
            reject(e);
        }
    })
}
let getUserInfoById = (id) => {
    return new Promise(async(resole, reject) => {
        try{
            let user = await db.User.findOne({
                where: { id: id },
                raw: true, 
            })

            if(user) {
                resole(user);
            }
            else {
                resole([]);
            }
        }catch(e) {
            reject(e);
        }
    })
        
}
let updateUserData = (data) => {
    return new Promise(async(resolve, reject) => {
        try{
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false, // false để trả về đối tượng Sequelize thay vì đối tượng thuần
            })
            if(user){
                user.username = data.username;
                user.password = data.password;
                await user.save(); // Lưu thay đổi vào cơ sở dữ liệu

                let allUser = await db.User.findAll();
                resolve(allUser);
            }else {
                resolve();
            }
        }
        catch (e) {
            console.log(e);
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
}