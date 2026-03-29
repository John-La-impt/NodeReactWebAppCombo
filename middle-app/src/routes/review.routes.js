module.exports = (express, app) => {
    const controller = require("../controllers/review.controller.js");
    const router = express.Router();
  
    // Select all reviews.
    router.get("/", controller.all);
  
    // Select a single review with id.
    router.get("/select/:id", controller.one);
  
    // Select one user from the database if username and password are a match.
    // router.get("/login", controller.login);
  
    // Create a new review.
    router.post("/", controller.create);

    // Edit a review
    router.put("/edit", controller.edit);

    // delete a review
    router.delete("/delete", controller.delete);

    // get (3) latest reviews
    router.get("/latest/:id", controller.latest);

    // get all reviews of 1 movie
    router.get("/allOfOne/:id", controller.allOfOne);
  
    // Add routes to server.
    app.use("/api/reviews", router);
};