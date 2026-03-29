import axios from "axios";

const API_HOST = "http://localhost:4000";

// main - get all movies from database
async function getAllMoviesRepo() {
    const response = await axios.get(API_HOST + "/api/movies");
    const data = response.data;

    return data;
}

// axios function to call sign in from middle app
async function signinRepo(email, password) {
    // get the user from the db
    const response = await axios.get(API_HOST + "/api/users/login", { params: { email, password } })
    const data = response.data;

    return data;
}

// axios function to call sign up from middle app
async function signupRepo(user) {
    // var toReturn = null;
    const response = await axios.post(API_HOST + "/api/users", user);
    const data = response.data;

    return data;
}

// axios funcion to call get user from middle app - for profile page
async function getUserRepo(id) {
    const response = await axios.get(API_HOST + `/api/users/view/${id}`);
    const data = response.data;

    if (data != null) {
        return data;
    } else {
        return null;
    }
}

// axios function to call delete user from middle app
async function deleteUserRepo(id) {
    const toSend = { data: { id: id }};
    const response = await axios.delete(API_HOST + "/api/users/delete", toSend);

    return response.data;
}

// axios function to call get movie from middle app - for movie page
async function getMovieRepo(id) {
    const response = await axios.get(API_HOST + `/api/movies/select/${id}`);
    const data = response.data;
    
    if (data != null) {
        return data;
    } else {
        return null;
    }
}

// axios function to call get review from middle app - for movie page
async function getLatestReviewsRepo(id) {
    const response = await axios.get(API_HOST + `/api/reviews/latest/${id}`);
    const data = response.data;

    return data;
}

// axios function to call get all reviews from middle app - for movie page
async function getAllReviewsRepo(id) {
    const response = await axios.get(API_HOST + `/api/reviews/allOfOne/${id}`);
    const data = response.data;
    return data;
}

// axios function to call get sessions from middle app - for movie page
async function getSessionWithMovieRepo(id) {
    const response = await axios.get(API_HOST + `/api/sessions/movie/${id}`);
    const data = response.data;
    
    if (data != null) {
        return data;
    } else {
        return null;
    }
}

// axios function to call post review from middle app - for movie page
async function postReviewRepo(review) {
    const response = await axios.post(API_HOST + "/api/reviews", review)
    const data = response.data;

    return data;
}

// axios function to call get reservations from middle app - for profile page
async function getReservationsRepo(id) {
    const response = await axios.get(API_HOST + `/api/users/getReserves/${id}`);
    const data = response.data;
    return data;
}

// axios function to call edit user from middle app - for profile page
async function editUserRepo(toSend) {
    const response = await axios.put(API_HOST + "/api/users/edit", toSend);
    return response.data;
}

// axios function to call get avail tickets from middle app - for movie page
async function getAvailTicketsRepo(id) {
    const response = await axios.get(API_HOST + `/api/sessions/sreserve/${id}`);
    console.log(response.data);
    return response.data;
}

// axios function to call add reservation from middle app - for movie page
async function addReservationRepo(freeTicket) {
    // replace/put the userId
    var toSend = freeTicket;
    var userId = localStorage.getItem("loggedInId");
    
    // get today date
    var fullDate = new Date();
    var date = fullDate.getDate();
    var month = fullDate.getMonth() + 1;
    var year = fullDate.getFullYear();
    var sendDate = year + '-' + month + '-' + date;

    toSend.userId = userId;
    toSend.dateReserved = sendDate;

    const response = await axios.put(API_HOST + "/api/sessions/areserve", toSend);
    return response.data;
}

// axios function to increment movie view from middle app - for main page - clicking on a movie
async function incrementMovieView(movieId) {
    const response = await axios.put(API_HOST + `/api/movies/incrementView/${movieId}`);
    return response.data;
} 

// tests only - i think
async function getAllUserRepo() {
    const response = await axios.get(API_HOST + "/api/users");
    const data = response.data;
    if (data != null) {
        return response.data;
    }
}

export { getAllMoviesRepo, signinRepo, signupRepo, getUserRepo, getMovieRepo, deleteUserRepo,
    getLatestReviewsRepo, getSessionWithMovieRepo, postReviewRepo, addReservationRepo, getReservationsRepo, editUserRepo, getAvailTicketsRepo,
    getAllUserRepo, incrementMovieView, getAllReviewsRepo
}

// import {  } from "../repository/Repository.js"