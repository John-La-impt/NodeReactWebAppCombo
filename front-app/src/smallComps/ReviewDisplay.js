import React, { useEffect, useState } from "react";

import { getAllReviewsRepo } from "../repository/Repository";

function ReviewDisplay({ movieId }) {
    // state to keep track of the reviews jsx to display
    const [reviewsJsx, setReviewsJsx] = useState();

    useEffect(() => {
        async function getAllReviews() {
            const data = await getAllReviewsRepo(movieId);
            if (data != null) {
                prepReviewsJsx(data);
            }
        }
        
        getAllReviews();
    },[])

    function prepReviewsJsx(data) {
        const listItems = data.map(review => 
            <li>{review.rating}/5: {review.content}</li>    
        )
        setReviewsJsx(<ul>{listItems}</ul>);
    }

    return (
        <div className="reviewDisplayCard">
            <h1>All Reviews:</h1>
            {reviewsJsx}
        </div>
    );
}

export default ReviewDisplay