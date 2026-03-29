import React, { useState } from "react";
import { useEffect } from "react";

import { getMovieRepo, getLatestReviewsRepo, getSessionWithMovieRepo, getUserRepo } from "../repository/Repository.js"

import Review from "../smallComps/Review";
import Session from "../smallComps/Session";
import ReviewDisplay from "../smallComps/ReviewDisplay.js";

function Movie({ loggedIn }) {
    // state to keep the single movie object gotten from database
    const [loggedMovie, setLoggedMovie] = useState({});
    // state to keep the jsx of the movie to display
    const [movieJsx, setMovieJsx] = useState();
    // state to keep all jsx of the sessions belonging to the movie
    const [sessionJsx, setSessionJsx] = useState();
    // state to keep all jsx of the reviews belonging to the movie
    const [reviewJsx, setReviewJsx] = useState();
    // state to determine which card to show: review | session | all reviews
    const [showCard, setShowCard] = useState(0);
    // state to keep the single user object gotten from database
    const [loggedUser, setLoggedUser] = useState({});

    useEffect(() => {
        // get the movie from db using id
        var idInt = parseInt(localStorage.getItem("storeMovie"))
        async function getOneMovie() {
            var data = await getMovieRepo(idInt);
            setLoggedMovie(data);
            if (data != null) {
                setMovieStuffs(data);
            }
            
            // now get the sessions
            var data2 = await getSessionWithMovieRepo(idInt);
            setSessionStuffs(data2);
        }

        async function getLatestReviews() {
            const data = await getLatestReviewsRepo(idInt);
            await setLatestReviews(data);
        }

        async function getLoggedUser(id) {
            const data = await getUserRepo(id);
            if (data != null) {
                setLoggedUser(data)
            }
        }

        getOneMovie();
        getLatestReviews();
        var userId = localStorage.getItem("loggedInId");
        if (userId != null && userId != "null") {
            getLoggedUser(parseInt(userId));
        }
    }, [])

    function setMovieStuffs(data) {
        setMovieJsx(
            <div className="info">
                <img src={data.imgUrl} />
                <h2>{data.name}</h2>
                <p>Rated: {data.rating}</p>
                <p>Synopsis: {data.synopsis}</p>
                <p>Runtime: {data.runtime}</p>
            </div>
        );
    }

    function displaySession(id) {
        localStorage.setItem("storeSession", id);
        setShowCard(2);
    }

    function setSessionStuffs(data) {
        const listSessions = data.map(session => 
            <li><button onClick={() => displaySession(parseInt(session.id))}>{session.sessionDate}: {session.sessionTime}</button>&nbsp;&nbsp;&nbsp;</li>
        )
        setSessionJsx(<ul>{listSessions}</ul>);
    }

    async function setLatestReviews(data) {
        const listReviews = data.map(review =>
            <li><p>{review.rating}/5: {review.content}&nbsp;&nbsp;&nbsp;</p></li>
        )
        setReviewJsx(listReviews);
    }

    return (
        <div className="movie">
            {   showCard == 1 // review
                ?   <div>
                        <div className='obscure' onClick={() => {
                            setShowCard(0);
                        }}/>
                        <Review closeReview={() => setShowCard(0)}/>
                    </div>
            :   showCard == 2 // session
                ?   <div>
                        <div className='obscure' onClick={() => {
                            setShowCard(0);
                        }}/>
                        <Session closeSession={() => setShowCard(0)}/>
                    </div>
            :   showCard == 3 // display all reviews
                ?   <div>
                        <div className='obscure' onClick={() => {
                            setShowCard(0);
                        }}/>
                        <ReviewDisplay movieId={loggedMovie.id} />
                    </div>
            :   <></> 
            }

            {movieJsx}
            
            <div className="sessionInfo">
                <h2>Upcoming Sessions:</h2>
                {sessionJsx}
            </div>
            <div className="latestReviews">
                <h2>Latest Reviews:&nbsp;&nbsp;&nbsp;</h2>
                {reviewJsx}
            </div>
            { loggedIn 
                ? 
                    <div className="addReview">
                        {   !(loggedUser.blocked) 
                            ? <button className="addReview" onClick={() => setShowCard(1)}>Add Review</button>
                            : <p>You are blocked from reviewing</p>
                        }
                    </div>
                : <></>
            }
            <br/>
            <button onClick={() => setShowCard(3)}>All Reviews</button>
        </div>
    );
}

export default Movie;