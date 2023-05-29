const express = require("express");
const { upload } = require("../utils/fileUpload");
const checkUserAuth = require("../middlewares/authMiddleWares");
const { createBlog, getAllBlogs, getBlogBySlug, getBlogById, deleteBlog, updateBlog } = require("../controllers/blogController");
const router = express.Router();

router.post("/", upload.single("image"),checkUserAuth, createBlog);
router.get("/", getAllBlogs);
router.get("/:slug", getBlogBySlug);
router.get("/blog-id/:id", getBlogById);
router.delete("/:id",checkUserAuth, deleteBlog);
router.patch("/:id",upload.single("image"),checkUserAuth, updateBlog)

module.exports = router;
