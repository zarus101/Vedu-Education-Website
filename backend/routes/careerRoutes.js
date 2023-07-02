const express = require("express")
const { createCareer, getAllCareers, getCareerById, deleteCareer, getCareer } = require("../controllers/careerController")
const checkUserAuth = require("../middlewares/authMiddleWares")
const { upload } = require("../utils/fileUpload")

const router = express.Router()

router.post("/", upload.single("image"), createCareer)
router.get("/", getAllCareers)
router.get("/career-id/:id", checkUserAuth, getCareerById)
router.delete("/:id", checkUserAuth, deleteCareer)
router.get("/:slug", getCareer)

module.exports = router
