const ErrorResponse = require("../handlers/error");
const db = require("../db");
const bcrypt = require("bcrypt");
const generateId = require("../functions/generateId");


exports.createAdmin = async (req, res, next) => {
    const { username, name, email, password } = req.body;
    const adminId = generateId(25);
    try {
        const result = await db.query('USE ??', [`${process.env.DB_PREFIX}admins`]);
        console.log("The result", result);

        const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
        const hashedPassword = await bcrypt.hash(password, salt);
        let sql = 'INSERT INTO ?? (_id, name, username, email, password) VALUES (?, ?, ?, ?, ?)';
        let placeholders = ['users', adminId, name, username, email, hashedPassword];
        const insertAdmin = await db.query(sql, placeholders);
        
        if (insertAdmin) res.status(200).json({ created: true });
    } catch (e) {
        console.log(e);
        res.status(404).json({ created: false, message: "An error occured!" });
    }
};

// exports.removeAdmin = async (req, res, next) => {
//     const { param } = req.body;

//     try {
//         let sql = 'SELECT * FROM ?? WHERE name = ? OR username = ? or email = ?';

//         const adminFound = await db.query(sql, ['admins.users', param, param, param]);
//         sql = "DELETE FROM ?? WHERE name = ? OR username = ? OR email = ?";
//         const deletedAdmin = await db.query(sql, ['admins.users', param, param, param]);
//         if (adminFound && deletedAdmin) res.status(200).json({ removed: true });
//     } catch (e) {
//         console.log(e);
//         res.status(404).json({ removed: false, message: "An error occured!" });
//     }
// };