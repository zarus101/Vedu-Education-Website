const express = require("express");
const { upload } = require("../utils/fileUpload");
const checkUserAuth = require("../middlewares/authMiddleWares");
const { createTeam, getAllTeams, getTeamById, deleteTeam, updateTeam } = require("../controllers/teamControllers");
const router = express.Router();

router.post("/", upload.single("image"),checkUserAuth, createTeam);
router.get("/", getAllTeams);
router.get("/team-id/:id", getTeamById);
router.delete("/:id",checkUserAuth, deleteTeam);
router.patch("/:id",upload.single("image"), updateTeam)

module.exports = router;
