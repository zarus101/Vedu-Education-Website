const express = require("express");
const { upload } = require("../utils/fileUpload");
const checkUserAuth = require("../middlewares/authMiddleWares");
const { createService, getAllService, getServiceBySlug, getServiceById, deleteService, updateService } = require("../controllers/serviceController");
const router = express.Router();

router.post("/",upload.single("image"),checkUserAuth, createService);
router.get("/", getAllService);
router.get("/:slug", getServiceBySlug);
router.get("/service-id/:id", getServiceById);
router.delete("/:id",checkUserAuth, deleteService);
router.patch("/:id",upload.single("image"),checkUserAuth, updateService)

module.exports = router;
