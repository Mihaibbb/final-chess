const router = require('express').Router();
const { login, updatePassword, loginRemember } = require("../controllers/auth");

// Routes

router.post("/login", login);
router.post("/login-remember", loginRemember);
router.put("/update-password", updatePassword);

module.exports = router;