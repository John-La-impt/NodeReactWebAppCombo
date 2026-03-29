const db = require("../database");
const argon2 = require("argon2");

// Select all users from the database.
exports.all = async (req, res) => {
    const users = await db.user.findAll();
    res.json(users);
};

// Select one user from the database.
exports.one = async (req, res) => {
    const user = await db.user.findByPk(req.params.id);
    res.json(user);
};

// Select one user from the database if username and password are a match.
exports.login = async (req, res) => {
    const user = await db.user.findOne({ where: { email: req.query.email } });
    if(user === null || await argon2.verify(user.passwordHash, req.query.password) === false) {
        // Login failed.
        res.json(4);
    } else {
        if (!user.deleted) { // if user is NOT flagged deleted
            res.json(user);
        } else { // user is flagged deleted
            res.json(5);
        }
    }
};

// Create a user in the database.
exports.create = async (req, res) => {
    // check if the email exists
    const userExists = await db.user.findOne({ where: { email: req.body.email } });
    if (userExists == null) {
        const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });

        const user = await db.user.create({
            email: req.body.email,
            passwordHash: hash,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });

        res.json(user);
    } else {
        res.json(null);
    }
};

// Edit an existing user in the database
exports.edit = async (req, res) => {
    const user = await db.user.findByPk(req.body.id);
    // check if the user wants to change their password
    if (req.body.passChange == 0) { // not changing password
        await user.update({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        })
        .then(function (result) {
            console.log(result);
            res.json(result);
        }).catch(function (error){
            res.json(null)
        });
    } else { // changing password
        const hash = await argon2.hash(req.body.password, { type: argon2.argon2id });
        await user.update({
            email: req.body.email,
            passwordHash: hash,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        })
        .then(function (result) {
            res.json(result);
        })
        .catch(function (error){
            res.json(null)
        });
    }
};

// (Soft) Delete a user from the database
exports.delete = async (req, res) => {
    const user = await db.user.findByPk(req.body.id);
    
    if (user != null) {
        // delete reviews - change review made by user to deleted comment
        const reviews = await db.review.findAll({
            where: {
                userId: req.body.id
            }
        })
        for (var i = 0; i < reviews.length; i++) {
            await reviews[i].update({
                // userId: 1,
                content: "***This review was deleted***",
                blocked: true
            })
        }

        // delete tickets - keep tickets reserved

        // await user.destroy();

        // make the firstname, lastname, email null
        await user.update({
            // email: "null@mail.com",
            firstName: "null last",
            lastName: "null last",
            deleted: true
        })

        res.json(true);
    } else {
        res.json(false);
    }
    
};

// Get all the tickets belonging to the user - return the tickets and the info of the session
exports.getReservations = async (req, res) => {
    // console.log("hey hey");
    // console.log(req.params);
    // console.log(req.params.id);
    // const userTickets = await db.ticket.findAll();
    const userTickets = await db.ticket.findAll({
        where: {
            userId: req.params.id
        }
    });
    // console.log(userTickets);

    // got all the tickets of the user - now get all the sessions belonging to them
    var sessions = [];
    for (var i = 0; i < userTickets.length; i++) {
        var found = false;
        for (var ii = 0; ii < sessions.length && !found; ii++) {
            if (sessions[ii]._sessionId == userTickets[i]._sessionId) {
                found = true;
                // add this new ticket to the object
                (sessions[ii].ticketObjs).push(userTickets[i]);
            }
        }
        if (!found) {
            // sessionIds.push(userTickets[i].sessionIds);
            var tickets = [];
            tickets.push(userTickets[i]);
            var toPush = { _sessionId: userTickets[i]._sessionId, ticketObjs: tickets }; // a new object for sessions
            sessions.push(toPush);
        }
    }
    // now sessionIds has all the (unique) sessionIds -- and grouped all the ticket with the sessions

    // console.log(sessions);
    // now for each of those entries in sessions, add the session movie, and date
    for (var i = 0; i < sessions.length; i++) {
        // const getSession = await sessions[i].sessionId;
        const getSession = await db._session.findByPk(sessions[i]._sessionId);
        // const getMovie = await getSession.movieId
        // console.log(getSession);
        const getMovie = await db.movie.findByPk(getSession.movieId);
        // console.log("hey hey hey hey hey");
        // console.log(getMovie);
        sessions[i].date = getSession.sessionDate;
        sessions[i].time = getSession.sessionTime;
        sessions[i].movieName = getMovie.name;
        
    }
    // console.log(sessions);
    console.log("hey hey hye hye hey");
    console.log(sessions);
    res.json(sessions);
}

// exports.getAllCount = async (req, res) => {
//     const users = await db.user.findAll();
//     console.log(users.length);
// }

// Get the latest review
exports.getLatest = async (req, res) => {
    const users = await db.user.findAll();
    var user = users[users.length-1];
    res.json(user);
}

// Get all reviews belonging to a user
exports.getUserNReviews = async (req, res) => {
    const user = await db.user.findByPk(req.params.id, {
        include: {
            model: db.review,
            as: "reviews"
        }
    });
    res.json(user);
}

// email, password, firstName, lastName, reserves