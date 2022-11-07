const express = require("express");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const config = require("./config/config");
const cors = require("cors");
const app = express();

//user routes
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const postRoute = require("./routes/postRoute");
//const regRoute = require("./routes/registration")

//middleware

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("common"));

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

//connexion to DB
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, (err) => {
  if (!err) {
    console.log("MongoDB connection succeded");
  } else {
    console.log(
      "Error in MongoDB connection : " + JSON.stringufy(err, undefined, 2)
    );
  }
});

app.listen(process.env.PORT, () =>
  console.log(`Server started at port : ${process.env.PORT}`)
);
