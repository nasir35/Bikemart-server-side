const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

//middlewares
app.use(express.json());
app.use(
  cors({
    origin: "https://bikemart-client-side.vercel.app", // Allow only your client-side origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow necessary methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow required headers
    credentials: true, // Allow cookies or credentials if required
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.options("*", (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://bikemart-client-side.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

//routes
const usersRoute = require("./routes/users.route");
const productRoutes = require("./routes/products.route");
const reviewRoutes = require("./routes/reviews.route");
const blogRoutes = require("./routes/blogs.route");
const orderRoutes = require("./routes/orders.route");
const newsletterSubscriberRoutes = require("./routes/newsletterSubscriber.route");
const errorHandler = require("./middleware/errorHandler");
app.get("/", (req, res) => {
  res.send("Bikemart server is running.");
});

app.use("/api/v1/users", usersRoute);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/newsletter", newsletterSubscriberRoutes);

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
