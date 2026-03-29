const db = require("../database");
const argon2 = require("argon2");

// Select all sessions from the database.
exports.all = async (req, res) => {
    const sessions = await db._session.findAll();
    res.json(sessions);
};

// Select one session from the database.
exports.one = async (req, res) => {
    const sessionTickets = await db.ticket.findAll({
        where: {
            _sessionId: req.params.id
        }
    });

    const sessionInfo = await  db._session.findByPk(req.params.id);

    const sessionReponse = { sessionInfo, sessionTickets };

    res.json(sessionReponse);
};

// Create a session in the database.
exports.create = async (req, res) => {
    const session = await db._session.create({
        sessionDate: req.body.date,
        sessionTime: req.body.time,
        movieId: req.body.movieId
    });

    // create 10 tickets with this sessionId
    for (var i = 0; i < 10; i++) {
        await db.ticket.create({
            name: "s" + (i+1).toString(),
            userId: 1,
            sessionId: session.id
        });
    }

    res.json(session);
};

// Show all the sessions of a movie
exports.movieSessions = async (req, res) => {
    const session = await db._session.findAll({ where: { movieId: req.params.id } });

    res.json(session); 
}

// show all free seats
exports.showReserve = async (req, res) => {
    const sessionTickets = await db.ticket.findAll({
        where: {
            _sessionId: req.params.id
        }
    });

    const sessionInfo = await  db._session.findByPk(req.params.id);

    // loop the tickets and check the userId == 1
    var freeTickets = [];
    sessionTickets.map(sessionTicket => {
        if (sessionTicket.userId == 1) { // user id 1 is a dummy user (that would've been seeded into the db)
            freeTickets.push(sessionTicket);
        }
    });

    const sessionReponse = { sessionInfo, freeTickets };

    res.json(sessionReponse);
}

// Put/change a session ticket
exports.reserveTicket = async (req, res) => {
    const ticket = await db.ticket.findByPk(req.body.id);

    console.log(ticket);
    console.log(req.body.userId);
    console.log(req.body.dateReserved);
    
    // await ticket.update({
    //     userId: req.body.userId,
    //     dateReserved: req.body.dateReserved
    // });
    ticket.userId = req.body.userId;
    ticket.dateReserved = req.body.dateReserved;
    await ticket.save();
}
