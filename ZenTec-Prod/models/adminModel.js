const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },

    username: {
        required: true,
        type: String
    },

    email: {
        required: true,
        type: String,
    },

    password: {
        required: true,
        type: String,
    }
});

// Hashing password

adminSchema.pre("save", async function( next ) {
    if (!this.isModified("password")) {
        next();
    }
    
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
    this.password = await bcrypt.hash(this.password, salt);
    
});

// Match between client and server password

adminSchema.methods.matchPassword = async function (password)  {
    return await bcrypt.compare(password, this.password);
};

// JSON Web Token

adminSchema.methods.getSignedToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};


const Admin = mongoose.model("admin", adminSchema);
module.exports = Admin;