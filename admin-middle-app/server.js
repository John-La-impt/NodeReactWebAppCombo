const express = require("express");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");
const db = require("./src/database");
const graphql = require("./src/graphql");

// db.sync;

const app = express(); // create express app

app.use(express.json()); // will only parses json

app.use(cors()); // will use cors

app.use(
    "/graphql",
    graphqlHTTP({
        schema: graphql.schema,
        rootValue: graphql.root,
        graphiql: true
    })
);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});