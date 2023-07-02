const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { fileSizeFormatter } = require("../utils/fileUpload");
const Country = require("../models/countrymodel");
const cloudinary = require("cloudinary").v2;

///creating new course
const createCountry = asyncHandler(async (req, res) => {
  const { name, description, description1, description2 } = req.body;

  const slug = slugify(req.body.name, {
    lower: true,
    remove: /[*+~.()'"!:@]/,
    strict: true,
  })
  const countryExist = await Country.findOne({ slug: slug });
  if (countryExist) {
    res.status(500);
    throw new Error("Country Already Added");
  }

  if (!name || !description || !description1 || !description2) {
    res.status(400);
    throw new Error("All fields are required");
  }

  let fileData = [];
  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Vedu-Education/country/",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }
    //step 1 :
    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  const country = await Country.create({
    name,
    slug: slug,
    description,
    description1,
    description2,
    image: fileData,
  });

  res.status(201).json({ success: true, data: country });
});

////getting al the course
const getAllCountry = asyncHandler(async (req, res) => {
  const countries = await Country.find().sort("createdAt");
  if (countries.length <= 0) {
    res.status(200).json({ success: "failed", message: "you do not have any country entries" });
  }
  res.status(201).json( countries );
});

///getting course by slug
const getCountryBySlug = asyncHandler(async (req, res) => {
  const country = await Country.findOne({ slug: req.params.slug })
  if (!country) {
    res.status(404)
    throw new Error("Country not found")
  }
  res.status(200).json(country)
});

//getting course ny id
const getCountryById = asyncHandler(async (req, res) => {
  const country = await Country.findById(req.params.id);
  if (!country) {
    res.status(404);
    throw new Error(`Country not found`);
  }
  res.status(200).json(country);
});

///deleting the course by id
const deleteCountry = asyncHandler(async (req, res) => {
  const country = await Country.findById(req.params.id);
  if (!country) {
    res.status(404);
    throw new Error(`Country not found`);
  }
  await Country.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "country Deleted Successfully" });
});


const updatecountry = asyncHandler(async (req, res) => {
  const { name, description, description1, description2 } = req.body;
  const { id } = req.params;
  const country = await Country.findById(id);
  if (!country) {
    res.status(400);
    throw new Error("country not found");
  }
  let fileData = [];
  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Vedu-Education/course",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }
    //step 1 :
    fileData = {
      fileName: req.file.originalname,
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }

  const updatedcountry = await Country.findByIdAndUpdate(
    { _id: id },
    {
      name,
      description,
      description1,
      description2,
      image: Object.keys(fileData).length < 0 ? country.image : fileData
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json(updatedcountry);
});

module.exports = { createCountry, getAllCountry, getCountryBySlug, getCountryById, deleteCountry, updatecountry };
