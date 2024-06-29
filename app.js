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
const orderRoutes = require("./routes/orders.route");
const errorHandler = require("./middleware/errorHandler");
app.get("/", (req, res) => {
  res.send("Bikemart server is running.");
});

app.use("/api/v1/users", usersRoute);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/orders", orderRoutes);

app.all("*", (req, res) => {
  res.status(400).send("No route found.");
});

app.use(errorHandler);

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection", error.name, error.message);
  app.close(() => {
    process.exit(1);
  });
});

module.exports = app;
