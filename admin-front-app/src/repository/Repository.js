import { request, gql } from "graphql-request";

const GQL_HOST = "http://localhost:5000/graphql";

async function getAllUsers() {
    const query = gql`{
        allUsers {
            id,
            email,
            firstName,
            lastName,
            blocked
        }
    }`
    const response = await request(GQL_HOST, query);
    // console.log(response);
    return response;
}

async function getAllUsersNReviews() {
    const query = gql`{
        allUsers {
            id,
            email,
            firstName,
            lastName,
            passwordHash,
            blocked,
            reviews {
                id,
                rating,
                content,
                blocked
            }
        }
    }`
    const response = await request(GQL_HOST, query);
    return response.allUsers;
}

async function getUserNReviews(id) {
    const query = gql`
    query ($id: Int) {
        user(id: $id) {
            id,
            email,
            firstName,
            lastName,
            passwordHash,
            blocked,
            reviews {
                id,
                rating,
                content,
                blocked
            }
        }
    }`
    const variables = { id };
    const response = await request(GQL_HOST, query, variables);
    // console.log("response: ");
    // console.log(response);
    return response
}

async function blockUnblockUser(doWhat, id) {
    if (doWhat == 0) {
        const query = gql`
        mutation ($id: Int) {
            blockUser(id: $id)
        }`
        const variables = { id };
        const response = await request(GQL_HOST, query, variables);
        return response;
        // console.log(response);
    } else {
        const query = gql`
        mutation ($id: Int) {
            unblockUser(id: $id)
        }`
        const variables = { id };
        const response = await request(GQL_HOST, query, variables);
        return response;
    }
    
}

async function deleteReview(id) {
    const query = gql`
    mutation ($id: Int) {
        deleteReview(id: $id)
    }`
    const variables = { id };
    const response = await request(GQL_HOST, query, variables);
    return response;
    // console.log(response);
    
}

async function getAllMoviesBasic() {
    const query = gql`{
        allMovies {
            id,
            name,
            synopsis,
            imgUrl,
            rating,
            runtime
        }
    }`

    const response = await request(GQL_HOST, query);
    console.log(response);
    return response;
}

async function editMovie(movie) {
    const query = gql`
    mutation ($id: Int, $name: String, $synopsis: String, $imgUrl: String, $rating: String, $runtime: String) {
        editMovie(input: {
            id: $id,
            name: $name,
            synopsis: $synopsis,
            imgUrl: $imgUrl,
            rating: $rating,
            runtime: $runtime
        }) {
            id,
            name,
            synopsis,
            imgUrl,
            rating,
            runtime
        }
    }`

    const variables = movie;
    // console.log(variables);
    const data = await request(GQL_HOST, query, variables);
    return data;
}

async function getReviewsPerMovie() {
    const query = gql`{
        reviewsPerMovie {
            id,
            name,
            reviewCount
        }
    }`
    const response = await request(GQL_HOST, query);
    return response;
}

async function getViewsPerMovie() {
    const query = gql`{
        allMovies {
            id,
            name,
            view
        }
    }`
    const response = await request(GQL_HOST, query);
    return response;
}

async function getTicketPerDay() {
    const query = gql`{
        ticketsReservedPerDay {
            dateReserved,
            reserveCount
        }
    }`
    const response = await request(GQL_HOST, query);
    return response;
}

async function createMovie(movie) {
    const query = gql`
      mutation ($id: Int, $name: String, $synopsis: String, $imgUrl: String, $rating: String, $runtime: String) {
        createMovie(input: {
            id: $id,
            name: $name,
            synopsis: $synopsis,
            imgUrl: $imgUrl,
            rating: $rating,
            runtime: $runtime
        }) {
            id,
            name,
            synopsis,
            imgUrl,
            rating,
            runtime
        }
    }`
  
    const variables = movie;
    // console.log("var: ");
    // console.log(movie);
    const data = await request(GQL_HOST, query, variables);
    return data;
}

async function createSession(session) {
    // console.log(session)

    const query = gql`
      mutation ($id: Int, $sessionDate: String, $sessionTime: String, $movieId: Int) {
        createSession(input: {
            id: $id,
            sessionDate: $sessionDate,
            sessionTime: $sessionTime,
            movieId: $movieId
        }) {
            id,
            sessionDate,
            sessionTime,
            movieId
        }
    }`
  
    const variables = session;
    // // console.log("var: ");
    // // console.log(movie);
    const data = await request(GQL_HOST, query, variables);
    return data;
}
export { getAllUsers, getAllUsersNReviews,  deleteReview, getUserNReviews, blockUnblockUser, 
    getReviewsPerMovie, getAllMoviesBasic, editMovie, createMovie, getViewsPerMovie, getTicketPerDay, createSession }