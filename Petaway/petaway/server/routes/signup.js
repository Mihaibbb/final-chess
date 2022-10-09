const router = require('express').Router();
const bcrypt = require("bcrypt");
const { User, validateSignUp } = require("../models/user");

router.post("/", async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { error } = validateSignUp(req.body);
        if (error) {
            console.log(error);
            res.json({error: "Error!"});
            return;
        }

        const user = await User.findOne({email: req.body.email});
        console.log(user);
        if (user) {
            res.json({error: "Email address already used!"});
            return;
        }
        
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        await new User({...req.body, password: hashPassword}).save();
        const newUser = await User.findOne({email: req.body.email});
        console.log(newUser._id);
        res.json({message: "Created account successfully!", token: newUser._id});

    } catch (e) {
        console.error(e);
    }
});


module.exports = router;