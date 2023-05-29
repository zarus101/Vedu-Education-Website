const express = require("express");
const { upload } = require("../utils/fileUpload");
const checkUserAuth = require("../middlewares/authMiddleWares");
const { createCountry, getAllCountry, getCountryBySlug, getCountryById, deleteCountry, updatecountry } = require("../controllers/countryController");
const router = express.Router();

router.post("/", upload.single("image"),checkUserAuth, createCountry);
router.get("/", getAllCountry);
router.get("/:slug", getCountryBySlug);
router.get("/country-id/:id", getCountryById);
router.delete("/:id",checkUserAuth, deleteCountry);
router.patch("/:id",upload.single("image"), updatecountry)

module.exports = router;
