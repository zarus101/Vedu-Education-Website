const mongoose = require("mongoose");

const faqSchema = mongoose.Schema(
  {
    question: {
      type: String,
      require: [true, "question is required"],
      trim: true,
    },
    answer: {
      type: String,
      require: [true, "answer is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

const Faq = mongoose.model("Faq", faqSchema);
module.exports = Faq;
