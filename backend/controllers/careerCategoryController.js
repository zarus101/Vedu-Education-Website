const asyncHandler = require("express-async-handler");
const Category = require("../models/categoryModel");




///creatting the categories
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  try {
    if (!name || !description) {
      res.status(400);
      throw new Error("All fields are required");
    }
    const category = await Category.create({
      name,
      description,
    });

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
})


/////fetching all the categories
const getAllCategory= asyncHandler(async(req, res)=>{
    const categories= await Category.find().sort("createdAt");


    if(categories.length <=0){
        res.status(200).json({message:"please add category"})
    }

    res.status(201).json(categories)
})



///deleting the category
const deleteCategory= asyncHandler(async(req, res)=>{
    const category= await Category.findById(req.params.id);


    if(!category){
        res.status(400)
        throw new Error("category not found")
    }
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({message: "category deleted successfully"})


})






/////exports
module.exports={createCategory, getAllCategory, deleteCategory}