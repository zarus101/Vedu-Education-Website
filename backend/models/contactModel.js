const mongoose = require("mongoose");

const contactSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "question is required"],
      trim: true,
    },
    email:{
        type: String,
        require: [true, "email is required"],

    },
    subject:{
        type: String,
        require: [true, "subject is required"]

    },
    phone: {
        type: Number,
        require: [true, "phone no is required"],

    },
    message:{
        type: String,
        required:[true, "Message is required"]
        
    },
    answer: {
      type: String,
      require: [true, "answer is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
