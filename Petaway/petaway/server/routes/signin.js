const router = require('express').Router();
const bcrypt = require("bcrypt");
const { User, validateSignIn } = require("../models/user");


router.post("/", async (req, res) => {
    try {
        const {error} = validateSignIn(req.body);
        if (error) {
            res.json({error: "Error!"});
            return;
        }

        const user = await User.findOne({email: req.body.email});
        if (!user) {
            res.json({error: "Email or password is incorrect!"});
            return;
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            res.json({ error: "Email or password is incorrect!" });
            return;
        }

        const token = user.generateAuthToken();
        res.json({data: token, message: "Logged Successfully"});
    } 
    catch (e) {
        console.error(e);
    }
});

module.exports = router;