const express = require("express");
const router = express.Router();
const ToughtController = require("../controllers/toughtController");
const checkAuth = require("../helpers/auth").checkAuth;

router.get("/dashboard", checkAuth, ToughtController.dashboard);
router.post("/remove", checkAuth, ToughtController.removeTought);
router.get("/add", checkAuth, ToughtController.createTought);
router.get("/edit/:id", checkAuth, ToughtController.updateTought);
router.post("/edit", checkAuth, ToughtController.updateToughtSave);
router.post("/add", checkAuth, ToughtController.createToughtSave);
router.get("/", ToughtController.showToughts);

module.exports = router;
