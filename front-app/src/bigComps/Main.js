import React, { useEffect, useState } from "react";
import { getAllMoviesRepo, incrementMovieView } from "../repository/Repository";

function Main({ movieRouteCallback }) {
  // state to save all the jsx of the movies to display (just their image)
  const [movieDisplay, setMovieDisplay] = useState();

  useEffect(() => {
    // get all movie from database
    async function getAllMovie() {
      const data = await getAllMoviesRepo();
      const _movieDisplay = data.map(movie =>
        <li> <img src={movie.imgUrl} onClick={() => {routeToMovie("toMovie", movie.id)}} /> </li>
      );
      setMovieDisplay(<ul>{_movieDisplay}</ul>)
    }

    getAllMovie();
  }, []);

  async function routeToMovie(routeTo, movieId) {
    // before routing, increment view the movie just clicked on
    await incrementMovieView(movieId);
    // set the local storage to the movie just clicked on
    localStorage.setItem("storeMovie", movieId);
    movieRouteCallback(routeTo, movieId);
  }

    return (
        <div className="main">
          <div className="row1">
            {movieDisplay}
          </div>
        </div>
      );
}

export default Main