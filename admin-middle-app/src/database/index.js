const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");

const db = {
    Op: Sequelize.Op
};

db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.DIALECT,

    define: {
        freezeTableName: true
    }
});

// models
db.user = require("./models/user.js")(db.sequelize, DataTypes);
db.movie = require("./models/movie.js")(db.sequelize, DataTypes);
db.review = require("./models/review.js")(db.sequelize, DataTypes);
db._session = require("./models/session.js")(db.sequelize, DataTypes);
db.ticket = require("./models/ticket.js")(db.sequelize, DataTypes);

// relations
db.user.hasMany(db.review, { as: "reviews" });
db.review.belongsTo(db.user, { foreignKey: "userId", as: "user", allowNull: false });
db.movie.hasMany(db.review, { as: "reviews" });
db.review.belongsTo(db.movie, { foreignKey: "movieId", as: "movie", allowNull: false });

db.user.hasMany(db.ticket);
db.ticket.belongsTo(db.user);
db._session.hasMany(db.ticket);
db.ticket.belongsTo(db._session);
db.user.belongsToMany(db._session, { through: { model: db.ticket, unique: false }, foreignKey: "_sessionId" });
db._session.belongsToMany(db.user, { through: { model: db.ticket, unique: false }, foreignKey: "userId" });


// sync
db.sync = async () => {
    await db.sequelize.sync();

    // await seedData();
};


module.exports = db;
