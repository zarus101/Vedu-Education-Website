const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { fileSizeFormatter } = require("../utils/fileUpload");
const Service = require("../models/serviceModel");
const cloudinary = require("cloudinary").v2;

///creating new course
const createService = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const slug = slugify(req.body.title, {
    lower: true,
    remove: /[*+~.()'"!:@]/,
    strict: true,
  });

  if (!title || !description) {
    res.status(400);
    throw new Error("All fields are required");
  }

  let fileData = [];
  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Vedu-Education/service",
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

  const service = await Service.create({
    title,
    slug: slug,
    description,

    image: fileData,
  });

  res.status(201).json({ success: true, data: service });
});

////getting al the course
const getAllService = asyncHandler(async (req, res) => {
  const services = await Service.find().sort("createdAt");
  if (services.length <= 0) {
    res.status(200).json({ success: "failed", message: "you do not have any country entries" });
  }
  res.status(201).json( services );
});

///getting course by slug
const getServiceBySlug = asyncHandler(async (req, res) => {
  const service = await Service.findById({ slug: req.params.slug });
  res.status(201).json({ success: true, data: service });
});

//getting course ny id
const getServiceById = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error(`Service not found`);
  }
  res.status(200).json(service);
});

///deleting the course by id
const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    res.status(404);
    throw new Error(`Service not found`);
  }
  await Service.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Service Deleted Successfully" });
});

const updateService = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;
  const service = await Service.findById(id);
  if (!service) {
    res.status(400);
    throw new Error("service not found");
  }
  let fileData = [];
  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Vedu-Education/service",
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

  const updatedService = await Service.findByIdAndUpdate(
    { _id: id },
    {
      title,
      description,
      image: Object.keys(fileData).length < 0 ? service.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json(updatedService);
});

module.exports = { createService, getAllService, getServiceBySlug, getServiceById, deleteService, updateService };
