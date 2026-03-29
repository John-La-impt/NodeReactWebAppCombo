import React, { useContext, useEffect, useReducer } from "react";

import { getAllMoviesBasic } from '../repository/Repository';

import { editMovie, createMovie, createSession } from "../repository/Repository";

import { ReloadContext } from "../App";

function reducer(state, action) {
    if (action.type == 1) { // get the movie list and display - initital
        return { mode: 0, movieList: <ul>{action.passInMovieList}</ul>, currEditing: {} };
    } else if (action.type == 2) { // switch to edit a movie mode
        return { mode: 1, movieList: state.movieList, currEditing: action.currEditing }; // mode 0 = list | mode 1 = edit | mode 2 = add new movie
    } else if (action.type == 3) { // switch back to default but already with a movieList to display
        return { mode: 0, movieList: state.movieList, currEditing: {} };
    } else if (action.type == 4) { // switch to create a movie
        return { mode: 2, movieList: state.movieList, currEditing: {} };
    } else if (action.type == 5) { // switch to create a session
        return { mode: 3, movieList: state.movieList, currEditing: state.currEditing };
    }
}

function reducer2(state2, action) { // fields for editing/creating movie
    if (action.type == 0) {
        return { name: action.name, synopsis: state2.synopsis, imgUrl: state2.imgUrl, rating: state2.rating, runtime: state2.runtime };
    } else if (action.type == 1) {
        return { name: state2.name, synopsis: action.synopsis, imgUrl: state2.imgUrl, rating: state2.rating, runtime: state2.runtime };
    } else if (action.type == 2) {
        return { name: state2.name, synopsis: state2.synopsis, imgUrl: action.imgUrl, rating: state2.rating, runtime: state2.runtime };
    } else if (action.type == 3) {
        return { name: state2.name, synopsis: state2.synopsis, imgUrl: state2.imgUrl, rating: action.rating, runtime: state2.runtime };
    } else if (action.type == 4) {
        return { name: state2.name, synopsis: state2.synopsis, imgUrl: state2.imgUrl, rating: state2.rating, runtime: action.runtime };
    }
}

function reducer3(state3, action) {  // fields for creating session
    if (action.type == 0) {
        return { sessionDate: action.sessionDate, sessionTime: state3.sessionTime, movieId: state3.movieId };
    } else if (action.type == 1) {
        return { sessionDate: state3.sessionDate, sessionTime: action.sessionTime, movieId: state3.movieId };
    } else if (action.type == 2) {
        return { sessionDate: state3.sessionDate, sessionTime: state3.sessionTime, movieId: action.movieId };
    } else if (action.type == 3) {
        return { sessionDate: "", sessionTime: "", movieId: "" };
    }
}

function MovieEdit() {
    const reloadContext = useContext(ReloadContext);

    // keep track of the state of the component
    const [state, dispatch] = useReducer(reducer, { mode: 0, movieList: [], currEditing: {} });
    // keep track of fields for editing and creating movies
    const [state2, dispatch2] = useReducer(reducer2, { id: 0, name: "", synopsis: "", imgUrl: "", rating: "", runtime: "" }); 
    // keep track of fields for creating session
    const [state3, dispatch3] = useReducer(reducer3, { sessionDate: "", sessionTime: "", movieId: "" });

    useEffect(() => {
        async function getAndSetMovieList() {
            const data = await getAllMoviesBasic();
            var listItems = data.allMovies.map(movie =>
                <li><p onClick={() => {
                    console.log("Hi");
                    dispatch({
                        type: 2,
                        currEditing: movie
                    });
                }}>{movie.id}: {movie.name}</p></li>
            )
            dispatch({
                type: 1,
                passInMovieList: listItems
            });
        }

        getAndSetMovieList();
    }, [reloadContext]);

    console.log(state.mode);

    /* 
        submit function for creating, editing movie
        doWhat takes: 0 = use the field to edit a movie | 1 = use the field to create a movie
    */
    async function handleSubmit(doWhat) { // 0 = edit | 1 = create
        var name = state2.name;
        var synopsis = state2.synopsis;
        var imgUrl = state2.imgUrl;
        var rating = state2.rating;
        var runtime = state2.runtime;
        if (doWhat == 0) {
            if (name == "") name = state.currEditing.name;
            if (synopsis == "") synopsis = state.currEditing.synopsis;
            if (imgUrl == "") imgUrl = state.currEditing.imgUrl;
            if (rating == "") rating = state.currEditing.rating;
            if (runtime == "") runtime = state.currEditing.runtime;
            var movie = { id: state.currEditing.id, name: name, synopsis: synopsis, imgUrl: imgUrl, rating: rating, runtime: runtime };
            const response = await editMovie(movie);
            // console.log(response);
            return response;
        } else {
            if (name != "" && runtime != "") {
                if (synopsis == "") synopsis = "*** Missing ***"
                if (imgUrl == "") imgUrl = "*** Missing ***"
                if (rating == "") rating = "*** Missing ***"
                var movie = { name: name, synopsis: synopsis, imgUrl: imgUrl, rating: rating, runtime: runtime };
                const response = await createMovie(movie);
                // console.log(response);
                return response;
            } else {
                // console.log("Name and runtime are required");
            }
        }
    }

    /* 
        submit function for creating session
    */
    async function handleSessionSubmit() {
        var sessionDate = state3.sessionDate;
        var sessionTime = state3.sessionTime;
        var movieId = state.currEditing.id;
        // console.log(sessionDate + ' ' + sessionTime + ' ' + movieId);
        if (sessionDate == "" || sessionTime == "") {
            // console.log("fill in date and time");
        } else {
            var session = { sessionDate: sessionDate, sessionTime: sessionTime, movieId: movieId };
            const response = await createSession(session);
            // console.log(response);
            dispatch3({ type: 3 });
        }
    }

    return (
        <div className="movieEdit">
            {/* 0 = initial | 1 = editing | 2 = create */}
            {       state.mode == 0 
                // show the list of existing movies
                ?   <div>
                        {state.movieList}<br/><br/>
                        <button onClick={() =>{
                            dispatch({
                                type: 4
                            })
                        }}>Add Movie</button>
                    </div>
                
                :   state.mode == 1
                // show the fields to edit movie
                    ?   <div className="editing">
                            <button onClick={() => {
                                dispatch({
                                    type: 3
                                });
                            }}>Back</button> <br/><br/>
                            <input 
                                type="text" 
                                placeholder={state.currEditing.name}
                                value={state2.name}
                                onChange={(e) => {
                                    dispatch2({
                                        type: 0,
                                        name: e.target.value
                                    });
                                }}
                                // role="emailField"
                            /> <br/><br/>
                            <input 
                                type="text" 
                                // placeholder={state.currEditing.synopsis}
                                placeholder="synosis"
                                value={state2.synopsis}
                                onChange={(e) => {
                                    dispatch2({
                                        type: 1,
                                        synopsis: e.target.value
                                    });
                                }}
                                // role="emailField"
                            /> <br/><br/>
                            <input 
                                type="text" 
                                placeholder={state.currEditing.imgUrl}
                                value={state2.imgUrl}
                                onChange={(e) => {
                                    dispatch2({
                                        type: 2,
                                        imgUrl: e.target.value
                                    });
                                }}
                                // role="emailField"
                            /> <br/><br/>
                            <input 
                                type="text" 
                                placeholder={state.currEditing.rating}
                                value={state2.rating}
                                onChange={(e) => {
                                    dispatch2({
                                        type: 3,
                                        rating: e.target.value
                                    });
                                }}
                                // role="emailField"
                            /> <br/><br/>
                            <input 
                                type="text" 
                                placeholder={state.currEditing.runtime}
                                value={state2.runtime}
                                onChange={(e) => {
                                    dispatch2({
                                        type: 4,
                                        runtime: e.target.value
                                    });
                                }}
                                // role="emailField"
                            /> <br/><br/>
                            <button onClick={() => handleSubmit(0)}>Confirm Edit</button>&nbsp;&nbsp;
                            <button onClick={() => {
                                dispatch({
                                    type: 5
                                })
                            }}>Create Session for this movie</button>
                        </div>
                
                :   state.mode == 2
                // show the fields to create movie
                    ?   <div className="creating">
                        <button onClick={() => {
                            dispatch({
                                type: 3
                            });
                        }}>Back</button> <br/><br/>
                        <input 
                            type="text" 
                            placeholder="Movie Name"
                            value={state2.name}
                            onChange={(e) => {
                                dispatch2({
                                    type: 0,
                                    name: e.target.value
                                });
                            }}
                            // role="emailField"
                        /> <br/><br/>
                        <input 
                            type="text" 
                            // placeholder={state.currEditing.synopsis}
                            placeholder="synosis"
                            value={state2.synopsis}
                            onChange={(e) => {
                                dispatch2({
                                    type: 1,
                                    synopsis: e.target.value
                                });
                            }}
                            // role="emailField"
                        /> <br/><br/>
                        <input 
                            type="text" 
                            placeholder="Url of Image"
                            value={state2.imgUrl}
                            onChange={(e) => {
                                dispatch2({
                                    type: 2,
                                    imgUrl: e.target.value
                                });
                            }}
                            // role="emailField"
                        /> <br/><br/>
                        <input 
                            type="text" 
                            placeholder="Movie Rating"
                            value={state2.rating}
                            onChange={(e) => {
                                dispatch2({
                                    type: 3,
                                    rating: e.target.value
                                });
                            }}
                            // role="emailField"
                        /> <br/><br/>
                        <input 
                            type="text" 
                            placeholder="Movie Runtime"
                            value={state2.runtime}
                            onChange={(e) => {
                                dispatch2({
                                    type: 4,
                                    runtime: e.target.value
                                });
                            }}
                            // role="emailField"
                        /> <br/><br/>
                        <button onClick={() => handleSubmit(1)}>Confirm Create</button>
                    </div>
                :   state.mode == 3
                // show the fields to add a session
                    ? <div className="sessionCreate">
                        <button onClick={() => {
                            dispatch({
                                type: 3
                            });
                        }}>Back</button> <br/><br/>
                        <input 
                            type="text" 
                            placeholder="YYYY-MM-DD"
                            value={state3.sessionDate}
                            onChange={(e) => {
                                dispatch3({
                                    type: 0,
                                    sessionDate: e.target.value
                                });
                            }}
                            // role="emailField"
                        /> <br/><br/>
                        <input 
                            type="text" 
                            placeholder="HH:MM"
                            value={state3.sessionTime}
                            onChange={(e) => {
                                dispatch3({
                                    type: 1,
                                    sessionTime: e.target.value
                                });
                            }}
                            // role="emailField"
                        /> <br/><br/>
                        <button onClick={() => handleSessionSubmit()}>Confirm Session</button>
                    </div>
                :<></>
            }
        </div>
    );
}

export default MovieEdit;