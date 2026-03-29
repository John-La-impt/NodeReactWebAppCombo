module.exports = (express, app) => {
    const controller = require("../controllers/user.controller.js");
    const router = express.Router();
  
    // Select all users.
    router.get("/", controller.all);
  
    // Select a single user with id. -- view profile
    router.get("/view/:id", controller.one); // if go to url - run the function on the right (param)
  
    // Select one user from the database if username and password are a match. -- login
    router.get("/login", controller.login);
  
    // Create a new user. -- register
    router.post("/", controller.create);

    // Edit a user. -- edit profile
    router.put("/edit", controller.edit); // no :id since using req.body

    // Delete a user. -- delete profile
    router.delete("/delete", controller.delete);

    // Get latest user
    router.get("/lastAdded", controller.getLatest);

    // Add reservation id to reserves column
    // router.put("/reserves", controller.reserves);

    // Get reservations of 1 user
    router.get("/getReserves/:id", controller.getReservations);

    // Get user and reviews associated
    router.get("/selectReviews/:id", controller.getUserNReviews);
  
    // Add routes to server.
    app.use("/api/users", router);
};