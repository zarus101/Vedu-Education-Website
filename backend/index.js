const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(bodyParser.json());

////routes
const userRoutes = require("./routes/userRoutes");
const courseRoutes = require("./routes/courseRoutes");
const faqRoutes = require("./routes/faqRoutes");
const countryRoutes = require("./routes/countryRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const blogRoutes = require("./routes/blogRoutes");
const teamRoutes = require("./routes/teamRoutes");
const { createDefaultAdminUser } = require("./controllers/userController");
const errorHandler = require("./middlewares/errorHandler");

///declaring the port
const PORT = process.env.PORT || 5000;
///connnecting to the mongoose server
mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server connected to ${PORT}`);
      createDefaultAdminUser();
    });
  })
  .catch((error) => {
    console.log(error);
  });

///middlewares routes
app.use("/vedu/", userRoutes);
app.use("/vedu/course", courseRoutes);
app.use("/vedu/faq", faqRoutes);
app.use("/vedu/country", countryRoutes);
app.use("/vedu/service", serviceRoutes);
app.use("/vedu/blog", blogRoutes);
app.use("/vedu/team", teamRoutes);

///error handling
app.use(errorHandler);

///routes
app.get("/", (req, res) => {
  res.send("Welcome to vedu education homepage");
});
