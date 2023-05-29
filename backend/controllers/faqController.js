const asyncHandler= require("express-async-handler");
const Faq = require("../models/faqModel");


const createFaq= asyncHandler(async(req, res)=>{
    const {question, answer}= req. body

    if(!question || !answer){
        res.status(400)
        throw new Error("All fields are required")
    }
    const faq= await Faq.create({
        question,
        answer
    })

    res.status(200).json(faq)
})


const getAllFaq= asyncHandler( async(req, res)=>{
    const faqs= await Faq.find().sort("createdAt")
    if(faqs.length <=0){
        res.status(200).json({message: "you do naot have any faqs, add one!"})
    }
    res.status(201).json(faqs)
})


const deleteFaq= asyncHandler(async(req, res)=>{
    const faq= await Faq.findById(req.params.id)
    if(!faq){
        res.status(400)
        throw new Error("no faq found")
    }
    await Faq.findByIdAndDelete(req.params.id)
    res.status(200).json({message: "successfully deleted"})
})
module.exports= {createFaq, getAllFaq, deleteFaq}