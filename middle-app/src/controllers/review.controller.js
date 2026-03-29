const db = require("../database");
const argon2 = require("argon2");

// Select all reviews from the database.
exports.all = async (req, res) => {
    const reviews = await db.review.findAll();
    res.json(reviews);
};

// Select one review from the database.
exports.one = async (req, res) => {
    const review = await db.review.findByPk(req.params.id);
    res.json(review);
};

// Create a review in the database.
exports.create = async (req, res) => {
    const review = await db.review.create({
        rating: req.body.rating,
        content: req.body.content,
        userId: req.body.userId,
        movieId: req.body.movieId
    });

    res.json(review);
};

// Edit a review
exports.edit = async (req, res) => {
    const review = await db.review.findByPk(req.body.id);

    await user.update({
        rating: req.body.rating,
        content: req.body.content
    });
};

// Delete a review
exports.delete = async (req, res) => {
    const review = await db.review.findByPk(req.body.id);

    await review.destroy();
}

// Get the 3 latest reviews of a movie
exports.latest = async (req, res) => {
    const reviews = await db.review.findAll({
        where: {
            movieId: req.params.id
        }
    });

    var toReturn = [];
    var count = 0;
    for (var i = (reviews.length-1); i >=0 && count < 3; i--) {
        if (!reviews[i].blocked) {
            toReturn.push(reviews[i]);
            count++;
        }
    };

    res.json(toReturn);
}

// Get all reviews of a movie
exports.allOfOne = async (req, res) => {
    const reviews = await db.review.findAll({
        where: {
            movieId: req.params.id
        }
    });

    res.json(reviews);
}

// rating, content, userId (fk), movieId (fk)