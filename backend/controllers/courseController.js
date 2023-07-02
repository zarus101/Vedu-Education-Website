const asyncHandler = require("express-async-handler");
const Course = require("../models/courseModel");
const slugify = require("slugify");
const { fileSizeFormatter } = require("../utils/fileUpload");
const cloudinary = require("cloudinary").v2;

///creating new course
const createCourse = asyncHandler(async (req, res) => {
  const { title, description, description1, description2 } = req.body;

  const slug = slugify(req.body.title, {
    lower: true,
    remove: /[*+~.()'"!:@]/,
    strict: true,
  });

  const courseExist = await Course.findOne({ slug: slug });
  if (courseExist) {
    res.status(500);
    throw new Error("Course Already Added");
  }

  if (!title || !description || !description1 || !description2) {
    res.status(400);
    throw new Error("All fields are required");
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

  const course = await Course.create({
    title,
    slug: slug,
    description,
    description1,
    description2,
    image: fileData,
  });

  res.status(201).json({ success: true, data: course });
});

////getting al the course
const getAllCourse = asyncHandler(async (req, res) => {
  const courses = await Course.find().sort("-createdAt");

  if (courses.length <= 0) {
    res.status(200).json({ success: "failed", message: "you do not have any course" });
  }
  res.status(201).json(courses);
});

///getting course by slug
const getCourseBySlug = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug })
  if (!course) {
    res.status(404)
    throw new Error("Career not found")
  }
  res.status(200).json(course)
});

//getting course ny id
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error(`Course not found`);
  }
  res.status(200).json(course);
});

///deleting the course by id
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error(`Course not found`);
  }
  await Course.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "Course Deleted Successfully" });
});

const updateCourse = asyncHandler(async (req, res) => {
  const { title, description, description1, description2 } = req.body;
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) {
    res.status(400);
    throw new Error("course not found");
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

  const updatedCourse = await Course.findByIdAndUpdate(
    { _id: id },
    {
      title,
      description,
      description1,
      description2,
      image: Object.keys(fileData).length < 0 ? course.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json(updatedCourse);
});

module.exports = { createCourse, getAllCourse, getCourseBySlug, getCourseById, deleteCourse, updateCourse };
