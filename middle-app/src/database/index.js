const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config.js");

const db = {
    Op: Sequelize.Op
};

db.sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.DIALECT,
    port: config.PORT,
    
    define: {
        freezeTableName: true
    }
});

// models
db.user = require("./models/user.js")(db.sequelize, DataTypes);
db.movie = require("./models/movie.js")(db.sequelize, DataTypes);
db._session = require("./models/session.js")(db.sequelize, DataTypes);
db.review = require("./models/review.js")(db.sequelize, DataTypes);
db.ticket = require("./models/ticket.js")(db.sequelize, DataTypes);

// relate the tables
db._session.belongsTo(db.movie, { foreignKey: { name: "movieId", allowNull: false } });
db.review.belongsTo(db.movie, { foreignKey: { name: "movieId", allowNull: false } });
db.user.hasMany(db.review, { as: "reviews" });
db.review.belongsTo(db.user, { foreignKey: "userId", as: "user", allowNull: false });

db.ticket.belongsTo(db.user);
db.ticket.belongsTo(db._session);
// db.user.belongsToMany(db._session, { through: { model: db.ticket, unique: false }, foreignKey: "userId" });
// db._session.belongsToMany(db.user, { through: { model: db.ticket, unique: false }, foreignKey: "sessionId" });
db.user.belongsToMany(db._session, { through: { model: db.ticket, unique: false }, foreignKey: "userId" });
db._session.belongsToMany(db.user, { through: { model: db.ticket, unique: false }, foreignKey: "_sessionId" });

// db.user.hasMany(db.ticket);
// db._session.hasMany(db.ticket);
// db.ticket.hasOne(db.user);
// db.ticket.hasOne(db._session);

// sync func
db.sync = async () => {
    // Sync schema.
    await db.sequelize.sync();
  
    // Can sync with force if the schema has become out of date - note that syncing with force is a destructive operation.
    // await db.sequelize.sync({ force: true });
    
    await seedData();
};

async function seedData() {
    const userCount = await db.user.count();
    const movieCount = await db.movie.count();
    const sessionCount = await db._session.count();
    const reviewCount = await db.review.count();
    const ticketCount = await db.ticket.count();
  
    // Only seed data if necessary.
    // if(userCount > 0)
    //   return;
  
    // user
    if (userCount <= 0) {
        const argon2 = require("argon2");
  
        // email, passwordHash, firstName, lastName
        let hash = await argon2.hash("abc123", { type: argon2.argon2id });
        await db.user.create({ email: "mboo@mail.com", passwordHash: hash, firstName: "matt", lastName : "boo" });
    
        hash = await argon2.hash("def456", { type: argon2.argon2id });
        await db.user.create({ email: "tim@mail", passwordHash: hash, firstName: "tim", lastName : "boo" });
    }

    // movie
    if (movieCount <= 0) {
        await db.movie.create({ name: "Embercleave", synopsis: "red", imgUrl: "https://cards.scryfall.io/large/front/a/a/aaae15dd-11b6-4421-99e9-365c7fe4a5d6.jpg?1572490333", rating: "PG", runtime : "1h30m" });
        await db.movie.create({ name: "Skysovereign", synopsis: "generic", imgUrl: "https://cards.scryfall.io/large/front/4/f/4f8075be-8932-49b3-990b-4b365fa27e94.jpg?1651656364", rating: "PG", runtime : "2h30m" });
    }

    // session
    // if (sessionCount <= 0) {
    //     // let date = new Date(dateStr[0], dateStr[1] - 1, dateStr[2]);
    //     // console.log("my date is: " + date);
    //     await db._session.create({ sessionDate: "2023-11-25", sessionTime: "13:00", movieId: 1 });
    //     await db._session.create({ sessionDate: "2023-11-25", sessionTime: "17:00", movieId: 1 });
    // }

    // review
    if (reviewCount <= 0) {
        await db.review.create({ rating: 4, content: "pretty good", userId: 1, movieId: 2 });
        await db.review.create({ rating: 2, content: null, userId: 2, movieId: 2 });
    }
    
    // ticket
    // if (ticketCount <= 0) {

    // }
}

module.exports = db;