// const dotenv = require("dotenv");
// dotenv.config();

// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(bodyParser.json());
// app.use(cors());

// mongoose
//   .connect(
//     "mongodb+srv://auth-user:12345@cluster0.9x3glry.mongodb.net/?retryWrites=true&w=majority",
//     { useNewUrlParser: true }
//   )
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log(err));

// const authRoutes = require("./routes/auth");
// app.use("/auth", authRoutes);

// app.listen(PORT, () => {
//   console.log(`Server is listening on port ${PORT}`);
// });

const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
const indexRoute = require("./routes/auth");

app.use(bodyParser.json());
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://auth-user:12345@cluster0.9x3glry.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use("/api", indexRoute);
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
