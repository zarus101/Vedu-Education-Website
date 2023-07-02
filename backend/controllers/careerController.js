const asyncHandler = require("express-async-handler");
const Career = require("../models/careerModel");
const { fileSizeFormatter } = require("../utils/fileUpload");
const { default: slugify } = require("slugify");
const Category = require("../models/categoryModel");
const cloudinary = require("cloudinary").v2;



////fetching all the career
const getAllCareers = asyncHandler(async (req, res) => {
  const career = await Career.find({}).sort({ createdAt: -1 }).populate("category");
  console.log(career);
  res.status(200).json(career);
})




////creating  the career
const createCareer = asyncHandler(async (req, res) => {
  const { title, salary, description, categoryId } = req.body;
  console.log(req.body)
  console.log(req.file);

  const slug = slugify(req.body.title, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    strict: true,
  });

  if (!title || !description ) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  let fileData = {};
  if (req.file) {
    // Save image to cloudinary
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Vedu-Education/career",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  // Create Career
  const career = await Career.create({
    category: categoryId,
    title,
    slug: slug,
    salary,
    description,
    image: fileData,
  });

  res.status(201).json({
    success: true,
    data: career,
  });
});

 
/////getting single career by slug
const getCareer = asyncHandler(async (req, res) => {
  const careers = await Career.findOne({ slug: req.params.slug });
  if (!careers) {
    res.status(404);
    throw new Error("Career not found");
  }
  res.status(200).json(careers);
});



////getting the career by id
const getCareerById = asyncHandler(async (req, res) => {
  const career = await Career.findById(req.params.id);
  if (!career) {
    res.status(404);
    throw new Error("Career not found");
  }

  res.status(200).json(career);
});



////deleteing the career
const deleteCareer = asyncHandler(async (req, res) => {
  const career = await Career.findById(req.params.id);

  if (!career) {
    res.status(404);
    throw new Error("Career not found");
  }

  await career.remove();
  res.status(200).json({ message: "Career deleted." });
});


module.exports = {
  createCareer,
  getAllCareers,
  deleteCareer,
  getCareerById,
  getCareer,
};
