const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql");

const dataEncryption = new mongoose.Schema({
    iv: {
        required: true,
        type: String,
    },

    encryptedData: {
        required: true,
        type: String
    }

});

const patientSchema = new mongoose.Schema({

    firstname: {
        required: [true, "Please insert your surname!"],
        type: String
    },

    lastname: {
        required: [true, "Please insert your name!"],
        type: String
    },

    phone: {
        required: true,
        unique: [true, "This phone number is already used."],
        type: String
    },

    birthdate: {
        required: true,
        type: Date
    },

    fileNumber: {
        type: Number,
        unique: true,
        required: true
    },

    username: {
        unique: [true, " This username is already used. "],
        type: String,
    },

    email: {
        unique: true,
        type: String,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email",
        ]
    },

    cnp: {
        type: String,
        unique: true
    },

    gender: {
        type: String
    },

    profileImage: {
        type: {
            name: String,
            desc: String,
            img: {
                data: Buffer,
                contentType: String
            }
        }
    },

    address: {
        type: String
    },

    date: {
        required: true,
        type: Date
    },

    doctors: [String],

    city: String,
    county: String,
    country: String,

});

// User schema 

const userSchema = new mongoose.Schema({

    userId: {
        required: true,
        type: mongoose.Schema.ObjectId
    },

    name: {
        required: [true, "Please insert your name!"],
        type: String,
    },

    username: {
        required: [true, "Please insert a unique username!"],
        type: String,
        unique: true
    },

    email: {
        type: String,
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email",
        ]
    },

    password: {
        required: [true, "Please insert a password!"],
        type: String,
        
        
    },

    date: {
        required: true,
        type: Date
    },

    profileImage: {
        name: String,
        desc: String,
        img: {
            data: Buffer,
            contentType: String
        }
    },

    type: {
        type: String,
        default: 'user'
    },

    status: {
        type: String,
        default: "Offline"
    },

    color: {
        type: String
    },
    
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    emailNumberToken: Number,
    emailNumberExpire: Date,
}); 

// Hashing password

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT));
    this.password = await bcrypt.hash(this.password, salt);
    
});

// Match between client and server password

userSchema.methods.matchPassword = async function (password)  {
    return await bcrypt.compare(password, this.password);
};

// JSON Web Token

userSchema.methods.getSignedToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

const scheduleSchema = new mongoose.Schema({

    startDate: {
        required: true,
        type: Date
    },

    endDate: {
        required: true,
        type: Date
    },

    title: { 
        required: true,
        type: String
    },

    income: {
        type: Number
    },

    typeIncome: String,

    patients: {
        required: true,
        type: Array
    },

    notes: {
        type: String
    },

    users: {
        type: [String],
        required: true
    },

    date: {
        type: Date,
        required: true
    },

    createdAt: {
        type: Date,
        required: true
    }
});

const organisationSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },

    patients: {
        type: [patientSchema]
    },

    schedules: {
        type: [scheduleSchema]
    },

    users: {
        type: [userSchema]
    },

    date: {
        required: true,
        type: Date
    }

});

// const OrganisationModel = mongoose.model("Organisation", organisationSchema);
// module.exports = OrganisationModel;
