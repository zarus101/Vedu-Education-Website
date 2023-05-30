const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

const createContact = asyncHandler(async (req, res) => {
  const { name, email, subject, phone, message } = req.body;

  if (!name || !email || !phone || !message || !subject) {
    res.status(400);
    throw new Error("All fields are required");
  }
  const contact = await Contact.create({
    name,
    email,
    subject,
    phone,
    message,
  });

  res.status(200).json(faq);
});

const getAllContact = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort("createdAt");
  if (contacts.length <= 0) {
    res.status(200).json({ message: "you have no message received!" });
  }
  res.status(201).json(contacts);
});

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(400);
    throw new Error("no contact found");
  }
  await Contact.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "successfully deleted" });
});
module.exports = { createContact, getAllContact, deleteContact };
