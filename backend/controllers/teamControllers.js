const asyncHandler = require("express-async-handler");
const { fileSizeFormatter } = require("../utils/fileUpload");
const Team = require("../models/teamModel");
const cloudinary = require("cloudinary").v2;

///creating new course
const createTeam = asyncHandler(async (req, res) => {
  const { name, email, position } = req.body;

  if (!name || !email  || !position) {
    res.status(400);
    throw new Error("All fields are required");
  }

  let fileData = [];
  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Vedu-Education/team",
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

  const team = await Team.create({
    name,
    email,
    position,
    image: fileData,
  });

  res.status(201).json({ success: true, data: team });
});

////getting al the course
const getAllTeams = asyncHandler(async (req, res) => {
  const teams = await Team.find().sort("createdAt");
  if (teams.length <= 0) {
    res.status(200).json({ success: "failed", message: "you do not have any team members, add one!!!" });
  }
  res.status(201).json( teams );
});

;

//getting course ny id
const getTeamById = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) {
    res.status(404);
    throw new Error(`team not found`);
  }
  res.status(200).json(team);
});

///deleting the course by id
const deleteTeam = asyncHandler(async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) {
    res.status(404);
    throw new Error(`team not found`);
  }
  await Team.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "team Deleted Successfully" });
});


const updateTeam = asyncHandler(async (req, res) => {
  const { name, email, position } = req.body;
  const { id } = req.params;
  const team = await Team.findById(id);
  if (!team) {
    res.status(400);
    throw new Error("team not found");
  }

  let fileData = [];
  if (req.file) {
    let uploadedFile;
    try {
      uploadedFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Vedu-Education/team",
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

  const updatedTeam = await Team.findByIdAndUpdate(
    { _id: id },
    {
      name,
      email,
      position,
      image: Object.keys(fileData).length ===  0 ? team.image : fileData
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json(updatedTeam);
});

module.exports = { createTeam, getAllTeams, getTeamById, deleteTeam, updateTeam };
