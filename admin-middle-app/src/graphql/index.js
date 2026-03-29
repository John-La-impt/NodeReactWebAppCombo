const { buildSchema } = require("graphql");
const db = require("../database");

const graphql = {};

// this schema object is written/specified in graphql schema language
graphql.schema = buildSchema(`
  # define the things that we can get/put from/to the db
  type User {
    id: Int,
    email: String,
    firstName: String,
    lastName: String,
    passwordHash: String,
    blocked: Boolean,
    reviews: [Review]
  }

  type Movie {
    id: Int,
    name: String,
    synopsis: String,
    imgUrl: String,
    rating: String,
    runtime: String,
    view: Int,
    reviews: [Review]
  }

  type Review {
    id: Int,
    rating: Int,
    content: String,
    blocked: Boolean
  }

  type _session {
    id: Int,
    sessionDate: String,
    sessionTime: String,
    movieId: Int
  }

  type Ticket {
    id: Int,
    name: String,
    userId: Int,
    _sessionId: Int,
    dateReserved: String
  }

  type TicketPerDay {
    dateReserved: String,
    reserveCount: Int
  }

  type ReviewsPerMovie {
    id: Int,
    name: String,
    reviewCount: Float
  }

  # Queries == get | theQuery: returnType
  type Query {
    allUsers: [User]
    user(id: Int): User

    allMovies: [Movie]

    allReviews: [Review]
    reviewsPerMovie: [ReviewsPerMovie]

    allTickets: [Ticket]
    ticketsReservedPerDay: [TicketPerDay]
  }

  # inputs here are types that makes it easier to define parameters for mutations, 
  # e.g., an input type User{ email, fname } put into param of createUser would require an email and fname for that 
  input MovieInput {
    id: Int,
    name: String,
    synopsis: String,
    imgUrl: String,
    rating: String,
    runtime: String
  }

  input SessionInput {
    id: Int,
    sessionDate: String,
    sessionTime: String,
    movieId: Int
  }

  # Mutations == put | name(param: paramType): returnType
  type Mutation {
    deleteReview(id: Int): Boolean,
    blockUser(id: Int): Boolean,
    unblockUser(id: Int): Boolean,

    createMovie(input: MovieInput): Movie,
    editMovie(id: Int, input: MovieInput): Movie,
    createSession(input: SessionInput): _session,
    editSession(id: Int, input: SessionInput): Movie
  }
`);

// The root provides a resolver function for each API endpoint.
// aka the actual operations that will be done to/onto the db when the
// queries above are used/called
graphql.root = {
    // Queries.
    
    // Get all users
    allUsers: async () => {
      return await db.user.findAll({ include: { model: db.review, as: "reviews" } });
    },
    // get 1 user using id
    user: async (args) => {
      return await db.user.findByPk(args.id, { include: { model: db.review, as: "reviews" } });
    },
    // get all movies
    allMovies: async () => {
      return await db.movie.findAll({ include: { model: db.review, as: "reviews" } });
    },
    // get all reviews
    allReviews: async () => {
        return await db.review.findAll();
    },
    // get reviews per movie + avg reviews per movie
    reviewsPerMovie: async () => {
      const data = await db.movie.findAll({ include: { model: db.review, as: "reviews" } });

      var toReturn = [];
      var reviewsCount = 0;

      data.map(movie => {
        // get the review arrays count
        var innerReviewCount = movie.reviews.length;
        reviewsCount = reviewsCount + innerReviewCount;
        toReturn.push({ id: movie.id, name: movie.name, reviewCount: innerReviewCount });
      });

      // add 1 last object which is avg review per movie
      // all reviews / all movies
      var movieCount = data.length;
      var avgCount = reviewsCount / movieCount;
      toReturn.push({ id: 0, name: "Average Reviews Per Movie", reviewCount: avgCount });

      return toReturn;
    },
    // Get all tickets
    allTickets: async () => {
      return await db.ticket.findAll();
    },
    // Get tickets reserved each day
    ticketsReservedPerDay: async () => {
      const data = await db.ticket.findAll();

      var toReturn = [];
      var dateArray = [];
      var dateCountArray = [];

      /* 
        this function will group create an array of dates and the number of tickets that were reserved on the day
      */
      async function mapToReturn(data) {
        var returnToReturn = [];

        data.map(ticket => {
          // if the ticket is reserved
          if (ticket.dateReserved != null) {
            // loop the date array to check if date is already in dateArray
            var found = false;
            for (var i = 0; i < dateArray.length && !found; i++) {
              if (ticket.dateReserved.localeCompare(dateArray[i]) == 0) { // date does exists, so increment the count of corresponding date
                found = true;
                dateCountArray[i]++;
              }
            }
            if (!found) { // date does not exists in the dateArray yet
              dateArray.push(ticket.dateReserved);
              dateCountArray.push(1);
            }
          }
        });

        // parse the strings into date that can be compare
        var dateAsIntArray = [];
        for (var i = 0; i < dateArray.length; i++) {
          dateAsIntArray.push(Date.parse(dateArray[i]));
        }

        // now sort the dates
        for (var i = 0; i < dateArray.length; i++) {
          for (var ii = i+1; ii < dateArray.length; ii++) {
            var indexofSmallest = i;
            if (dateAsIntArray[ii] < dateAsIntArray[i]) {
              indexofSmallest = ii;
            }
            // swap
            var temp = dateArray[i];
            var temp2 = dateAsIntArray[i];
            var temp3 = dateCountArray[i];
            dateArray[i] = dateArray[indexofSmallest];
            dateAsIntArray[i] = dateAsIntArray[indexofSmallest];
            dateCountArray[i] = dateCountArray[indexofSmallest];
            dateArray[indexofSmallest] = temp;
            dateAsIntArray[indexofSmallest] = temp2;
            dateCountArray[indexofSmallest] = temp3;
          }
        }
    
        // push into a final array to return
        for (var i = 0; i < dateArray.length; i++) {
          returnToReturn.push({ dateReserved: dateArray[i], reserveCount: dateCountArray[i] });
        }
        return returnToReturn
      }

      toReturn = await mapToReturn(data);
      return toReturn;
    },
  
    // Mutations.
      // deleteReview(id: Int): Boolean,
      // blockUser(id: Int): Boolean,
      // unblockUser(id: Int): Boolean,

    // (soft) delete a review using id 
    deleteReview: async (args) => {
      const review = await db.review.findByPk(args.id);
    
      if (review != null) {
        // Update owner fields.
        review.content = "***This review was deleted***";
        review.blocked = true;
        await review.save();
        return true;
      } else {
        return false;
      }
    },

    // block a user (from reviewing)
    blockUser: async (args) => {
      const user = await db.user.findByPk(args.id);
      if (user != null) {
        user.blocked = true;
        await user.save();
        return true;
      } else {
        return false;
      }
    },

    // unblock a user (from reviewing)
    unblockUser: async (args) => {
      const user = await db.user.findByPk(args.id);
      if (user != null) {
        user.blocked = false;
        await user.save();
        return true;
      } else {
        return false;
      }
    },

    // create a movie
    createMovie: async (args) => {
      // console.log(args);
      const toCreate = { name: args.input.name, synopsis: args.input.synopsis, imgUrl: args.input.imgUrl, rating: args.input.rating, runtime: args.input.runtime, view: 0 };
      await db.movie.create(toCreate);
      return args;
    },

    // edit a movie
    editMovie: async (args) => {
      const movie = await db.movie.findByPk(args.input.id);
      // console.log(args);
      // console.log(movie);
      if (movie != null) {
        // movie = args.input;
        movie.name = args.input.name;
        movie.synopsis = args.input.synopsis;
        movie.imgUrl = args.input.imgUrl;
        movie.rating = args.input.rating;
        movie.runtime = args.input.runtime;
        await movie.save();
        return movie;
      } else {
        return null;
      }
    },

    // create a session
    createSession: async (args) => {
      const session = await db._session.create(args.input);
      // get the session just added to get its id
      const latestSession = await db._session.findOne({
        order: [ [ 'id', 'DESC' ]],
      });

      for (var i = 0; i < 10; i++) {
        await db.ticket.create({
            name: "s" + (i+1).toString(),
            userId: 1,
            _sessionId: latestSession.id
        });
      }
      return session;
    },

    // edit a session
    editSession: async (args) => {
      const session = await db.session.findByPk(args.id);
      if (session != null) {
        session = args.input;
        await session.save();
        return session;
      } else {
        return null;
      }
    }
  };

  module.exports = graphql;