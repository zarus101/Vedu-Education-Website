const express= require("express")
const { createFaq, getAllFaq, deleteFaq } = require("../controllers/faqController")
const checkUserAuth = require("../middlewares/authMiddleWares")

const router= express.Router()

router.post("/",checkUserAuth, createFaq)
router.get("/", getAllFaq)
router.delete("/:id",checkUserAuth, deleteFaq)


module.exports= router