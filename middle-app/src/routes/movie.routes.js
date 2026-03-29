module.exports = (express, app) => {
    const controller = require("../controllers/movie.controller.js");
    const router = express.Router();
  
    // Select all movies.
    router.get("/", controller.all);
  
    // Select a single movie with id.
    router.get("/select/:id", controller.one);
  
    // Select one user from the database if username and password are a match.
    // router.get("/login", controller.login);
  
    // Create a new movie.
    router.post("/", controller.create);
  
    // Increment the view count of a movie
    router.put("/incrementView/:id", controller.incrementView);

    // Add routes to server.
    app.use("/api/movies", router);
};