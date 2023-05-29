const express = require("express");
const { upload } = require("../utils/fileUpload");
const { createCourse, getAllCourse, getCourseBySlug, getCourseById, deleteCourse, updateCourse } = require("../controllers/courseController");
const checkUserAuth = require("../middlewares/authMiddleWares");
const router = express.Router();

router.post("/", upload.single("image"),checkUserAuth, createCourse);
router.get("/", getAllCourse);
router.get("/:slug", getCourseBySlug);
router.get("/course-id/:id", getCourseById);
router.delete("/:id",checkUserAuth, deleteCourse);
router.patch("/:id",upload.single("image"), updateCourse)

module.exports = router;
