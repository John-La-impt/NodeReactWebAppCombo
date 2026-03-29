import React, { useContext, useEffect, useReducer } from "react";

import { getUserNReviews, deleteReview } from "../repository/Repository";

import { ReloadContext } from "../App";

async function _deleteReview(id) {
    const response = await deleteReview(id);
}

function reducer(state, action) {
    const listItems = (action.currUser.reviews).map(review => 
        <li>
            {review.id} = {review.rating}: {review.content} - {review.blocked}
            { review.blocked 
                ?   <button>Already Deleted</button>
                :   <button onClick={() => _deleteReview(review.id)}>Delete</button>
            }
            
        </li>
    )
    return { currUser: action.currUser, currReviews: <ul>{listItems}</ul> };
}

function ReviewEdit({ userId }) {
    const reloadContext = useContext(ReloadContext);

    // state to keep track of component
    const [state, dispatch] = useReducer(reducer, { currUser: {}, currReviews: <ul></ul> });

    useEffect(() => {
        async function getUserNNReviews() {
            const data = await getUserNReviews(userId);
            dispatch({
                currUser: data.user
            });
        }

        getUserNNReviews();
    }, [reloadContext]);
    // getUserNReviews(userId);

    return (
        <div className="reviewEdit">
            {/* child level 3 */}
            <p>Id: {state.currUser.id}</p>
            <p>Email: {state.currUser.email}</p>
            <p>Name: {state.currUser.firstName} {state.currUser.lastName}</p>
            <p>Reviews:</p>
            {state.currReviews}
        </div>
    );
}

export default ReviewEdit;