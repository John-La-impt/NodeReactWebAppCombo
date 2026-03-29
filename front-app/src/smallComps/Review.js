import React from "react";
import { useState } from "react";
import { postReviewRepo, getUserRepo, getMovieRepo } from "../repository/Repository.js"

/* 
    function to submit the review, splitted to be able to export to test
    userId: the user attempting to post the review
    movieId: the movie the user wants to review
    ratings: the ratings
    comments: the comment
*/
export async function workSubmit(userId, movieId, ratings, comments) {
    var toReturn = false;
    const user = await getUserRepo( userId );
    const movie = await getMovieRepo( movieId );
    if (user != null && movie != null) {
        var review = { rating: ratings, content: comments, userId: user.id, movieId: movie.id };

        const data = await postReviewRepo(review);
        if (data != null) toReturn = true;
    }
    return toReturn;
}


function Review({ closeReview, movieToReview}) {
    // state to keep track of fields
    const [comments, setComments] = useState("");
    const [ratings, setRatings] = useState(1);
    // state to determine what error message to display
    const [error, setError] = useState(0);

    async function handleSubmit() {
        if (comments != "" && ratings != 0) {
            if (comments.length <= 600) {
                if(await workSubmit(parseInt(localStorage.getItem("loggedInId")), parseInt(localStorage.getItem("storeMovie")), ratings, comments)) {
                    setComments("");
                    setError(0);
                    closeReview();
                }
            } else {
                console.log("too many")
                setError(1); // too many characters
            }
        }
    }

    function test() {
        console.log("Inside");
        console.log(movieToReview);
    }

    return (
        <div className="reviewCard">
            <h2 onClick={() => test()}>Add Review:</h2>
            {   error == 1
                ? <p>Too many characters</p>
                : <></>
            }
            <div className="radioBtns">
                <input type="radio" name="rating" onChange={() => setRatings(1)} defaultChecked />1
                <input type="radio" name="rating" onChange={() => setRatings(2)} />2
                <input type="radio" name="rating" onChange={() => setRatings(3)} />3
                <input type="radio" name="rating" onChange={() => setRatings(4)} />4
                <input type="radio" name="rating" onChange={() => setRatings(5)} role="radio5" />5
            </div>
            <textarea rows="10" cols="80"
                value={comments}
                placeholder="Comments"
                onChange={(e) => setComments(e.target.value)}
                role="textArea"
            />
            <button onClick={handleSubmit} role="submitBtn">Post review</button>
        </div>
    );
}

export default Review