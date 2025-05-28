// require("dotenv").config();
// const express = require("express");
// const path = require("path");
// const cookieParser = require('cookie-parser');
// const methodOverride = require('method-override');

// const { connectToMongoDB } = require("./connect");
// const { restrictToLoggedinUserOnly, checkAuth } = require('./middlewares/auth');
// const URL = require("./models/url");
// const urlRoute = require("./routes/url");
// const staticRoute = require("./routes/staticRouter");
// const userRoute = require('./routes/user');

// const app = express();
// const PORT = process.env.PORT || 8001;
// const mongoDbPath = process.env.mongoDbPath;        

// connectToMongoDB(mongoDbPath).then(() => console.log("Mongodb connected")).catch((e)=>{
//     console.log(e)
// });

// app.set("view engine", "ejs");
// app.set("views", path.resolve("./views"));

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(methodOverride('_method'));

// app.use("/url", restrictToLoggedinUserOnly, urlRoute);
// app.use("/user", userRoute);
// app.use("/", checkAuth, staticRoute);

// app.get('/url/:shortId', async (req, res) => {
//     const shortId = req.params.shortId;
//     const entry = await URL.findOneAndUpdate(
//         {
//             shortId
//         },
//         {
//             $push: {
//                 visitHistory: {
//                     timestamp: Date.now(),
//                 },
//             },
//         }
//     );
//     res.redirect(entry.redirectURL);
// });


// app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));
//--------------------------------------------------------------------------------------

require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const cors = require("cors");

const { connectToMongoDB } = require("./connect");
const { restrictToLoggedinUserOnly, checkAuth } = require("./middlewares/auth");
const URL = require("./models/url");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");
const publicRoute = require("./routes/public");

const app = express();
const PORT = process.env.PORT || 8001;
const mongoDbPath = process.env.mongoDbPath;

// MongoDB connection
connectToMongoDB(mongoDbPath)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((e) => console.error("❌ MongoDB connection failed:", e));

// CORS setup
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride("_method"));

// Root route
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "🎉 Welcome to LinkShrinker Backend API!",
    endpoints: {
      api_base: "/api",
      public_shorten: "/api/url/public",
      protected_shorten: "/api/url (requires login)",
      auth: "/api/auth",
    }
  });
});

// API base route
app.get("/api", (req, res) => {
  return res.status(200).json({
    message: "🛠️ LinkShrinker API is working!",
    docs: "📄 API documentation will be available soon.",
  });
});

// Public shorten route (no login required)
app.use("/api/url/public", publicRoute);

// Protected routes
app.use("/api/url", restrictToLoggedinUserOnly, urlRoute);
app.use("/api/auth", userRoute);
app.use("/api", checkAuth, staticRoute);

// Short ID redirect handler
app.get("/api/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );

  if (!entry) {
    return res.status(404).json({ error: "Short URL not found 🚫" });
  }

  return res.redirect(entry.redirectURL);
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server started at http://localhost:${PORT}`));
