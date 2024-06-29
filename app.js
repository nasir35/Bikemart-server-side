const express = require("express");
const app = express();
const cors = require("cors");

//middlewares
app.use(express.json());
app.use(cors());

//routes
const usersRoute = require("./routes/users.route");
const productRoutes = require("./routes/products.route");
const reviewRoutes = require("./routes/reviews.route");
const blogRoutes = require("./routes/blogs.route");
app.get("/", (req, res) => {
  res.send("Bikemart server is running.");
});

app.use("/api/v1/users", usersRoute);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/blogs", blogRoutes);

app.get("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "No route exist for this api end.",
  });
});

module.exports = app;
