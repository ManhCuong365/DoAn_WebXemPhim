import db from '../models';

let deleteCommentById = async (id) => {
    try {
        await db.Comment.destroy({ where: { id } });
        return { success: true, message: 'Xóa bình luận thành công!' };
    } catch (error) {
        return { success: false, message: 'Xóa bình luận thất bại!', error };
    }
};


module.exports = {
    deleteCommentById: deleteCommentById,
};