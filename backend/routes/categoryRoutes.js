const express= require("express")
const checkUserAuth = require("../middlewares/authMiddleWares")
const { createCategory, getAllCategory, deleteCategory } = require("../controllers/careerCategoryController")

const router= express.Router()




////routes for category

router.post("/", checkUserAuth, createCategory)
router.get("/", getAllCategory)
router.delete("/:id",checkUserAuth, deleteCategory)



module.exports= router