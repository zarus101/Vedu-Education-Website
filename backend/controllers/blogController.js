const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { fileSizeFormatter } = require("../utils/fileUpload");
const Blog = require("../models/blogModel");
const cloudinary = require("cloudinary").v2;

///creating new course
const createBlog = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const userId = req.user.id
  const slug = slugify(req.body.title, {
    lower: true,
    remove: /[*+~.()'"!:@]/,
    strict: true,
  });

  if (!title || !description ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  let fileData = [];
  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Vedu-Education/blog",
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

  const blog = await Blog.create({
    title,
    user: userId,
    slug: slug,
    description,
    image: fileData,
  });

  res.status(201).json({ success: true, data: blog });
});

////getting al the course
const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().sort("createdAt");
  if (blogs.length <= 0) {
    res.status(200).json({ success: "failed", message: "you do not have any blogs, add one!!!" });
  }
  res.status(201).json(blogs);
});

///getting course by slug
const getBlogBySlug = asyncHandler(async (req, res) => {
  const blog = await Blog.findById({ slug: req.params.slug });
  res.status(201).json({ success: true, data: blog });
});

//getting course ny id
const getBlogById = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error(`blog not found`);
  }
  res.status(200).json(blog);
});

///deleting the course by id
const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    res.status(404);
    throw new Error(`blog not found`);
  }
  await Blog.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "blog Deleted Successfully" });
});


const updateBlog = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    res.status(400);
    throw new Error("blog not found");
  }
  if(blog.user.toString() !== req.user.id){
    res.status(401)
    throw new Error("user not authorized")
  }
  let fileData = [];
  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Vedu-Education/blog",
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

  const updatedBlog = await Blog.findByIdAndUpdate(
    { _id: id },
    {
      title,
      description,
      image: Object.keys(fileData).length < 0 ? blog.image : fileData
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json(updatedBlog);
});

module.exports = { createBlog, getAllBlogs, getBlogBySlug, getBlogById, deleteBlog, updateBlog };
