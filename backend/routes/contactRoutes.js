const express= require("express")
const checkUserAuth = require("../middlewares/authMiddleWares")
const { createContact, getAllContact, deleteContact } = require("../controllers/contactController")

const router= express.Router()

router.post("/", createContact)
router.get("/",checkUserAuth, getAllContact)
router.delete("/:id",checkUserAuth, deleteContact)


module.exports= router