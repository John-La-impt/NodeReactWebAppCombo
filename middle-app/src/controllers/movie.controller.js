const db = require("../database");
const argon2 = require("argon2");

// Select all movies from the database.
exports.all = async (req, res) => {
    const movies = await db.movie.findAll();

    res.json(movies);
};

// Select one movie from the database.
exports.one = async (req, res) => {
    const movie = await db.movie.findByPk(req.params.id);
    res.json(movie);
};

// Create a movie in the database.
exports.create = async (req, res) => {
    const movie = await db.movie.create({
        name: req.body.name,
        imgUrl: req.body.imgUrl,
        rating: req.body.rating,
        runtime: req.body.runtime
    });

    res.json(movie);
};

// Increment viewcount
exports.incrementView = async (req, res) => {
    const movie = await db.movie.findByPk(req.params.id);
    const incrementView = await movie.increment('view');

    res.json(incrementView);
}