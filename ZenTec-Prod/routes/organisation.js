const router = require('express').Router();
const { createOrganisation, removeOrganisation, getOrganisationsData, createUser, removeUser } = require("../controllers/organisation");

router.post("/create", createOrganisation);
router.delete("/remove", removeOrganisation);
router.post("/create-user", createUser);
router.delete("/remove-user", removeUser);
router.post("/data", getOrganisationsData);

module.exports = router;