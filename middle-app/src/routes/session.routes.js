module.exports = (express, app) => {
    const controller = require("../controllers/session.controller.js");
    const router = express.Router();
  
    // Select all sessions.
    router.get("/", controller.all);
  
    // Select a single session with id.
    router.get("/select/:id", controller.one);
  
    // Select one user from the database if username and password are a match.
    // router.get("/login", controller.login);
  
    // Create a new session - prop admin only
    router.post("/", controller.create);

    // Show sessions of a movie
    router.get("/movie/:id", controller.movieSessions);

    // Show available seat
    router.get("/sreserve/:id", controller.showReserve);
    
    // Reserve a ticket
    // router.put("/areserve", controller.addReserve);
    router.put("/areserve", controller.reserveTicket);

    // remove reservation
    // router.put("/rreserve", controller.removeReserve);
  
    // Add routes to server.
    app.use("/api/sessions", router);
};