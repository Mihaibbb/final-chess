const router = require("express").Router();
const { createAdmin, removeAdmin } = require("../controllers/admin");

router.post("/create", createAdmin);
// router.post("/remove", removeAdmin);


module.exports = router;