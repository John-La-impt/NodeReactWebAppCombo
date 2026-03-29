import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Header from './bigComps/Header'
import Navbar from './bigComps/Navbar';
import Main from './bigComps/Main';
import Footer from './bigComps/Footer';
import Signup from './smallComps/Signup';
import Signin from './smallComps/Signin';
import Profile from './bigComps/Profile';
import Movie from './bigComps/Movie';

function App() {
  const [showAddReview, setShowAddReview] = useState(false);
  const [showDisplayReview, setShowDisplayReview] = useState(false);

  // for routing - this should be inside a BrowserRouter tag - which is set in index.js
  const navigate = useNavigate();

  // states for signup and signin
  const [showSignupin, setShowSignupin] = useState(0); // state to determine what card (signin or signup or none) to show
  const [loggedIn, setLoggedIn] = useState(false); // state to set if a user is logged in
  const [loggedInId, setLoggedInId] = useState(-1); // state to set a user id

  // states to show which movie to show (on the movie page)
  const [currMovieId, setCurrMovieId] = useState();

  useEffect(() => {
    var getUser = localStorage.getItem("loggedIn"); // get the email (the key of the user in localStorage)
    if (getUser == "null" || getUser == "" || getUser == null) { // getUser == null - there is NO loggin user in localStorage
      setLoggedIn(false);
    } else { 
      setLoggedIn(true);
    }

  }, []);

  /*
    function to handle the page routing
    routeTo: which url/component to display
    movieId: if going to a movie page, pass the movieId here
  */
  function routing(routeTo, movieId) {
    console.log(movieId);
    if (routeTo === "toMovie") {
      setCurrMovieId(movieId);
      navigate("/movie");
    } else if (routeTo === "toMain") {
      navigate("/");
    } else if (routeTo === "toProfile") {
      navigate("/profile")
    }
  }

  return (
    <div className="app">
      {showSignupin != 0 || showAddReview || showDisplayReview
        ? <div className='obscure' onClick={() => {
          setShowSignupin(0)
          setShowAddReview(false);
          setShowDisplayReview(false);
        }}/>
        : <></>
      }

      <Header mainRouteCallback={routing} />
      <Navbar openUp={() => setShowSignupin(1)} openIn={() => setShowSignupin(2)} loggedIn={loggedIn} setLogin={() => setLoggedIn(false)} profileRouteCallback={routing}/>

        {   showSignupin == 1
              ? <Signup closeCard={() => setShowSignupin(0)} loggedIn={() => { 
                setLoggedIn(true);
                setLoggedInId(localStorage.getItem("loggedInId"));
              }} />
          : showSignupin == 2
              ? <Signin closeCard={() => setShowSignupin(0)} loggedIn={() => {
                setLoggedIn(true)
                setLoggedInId(localStorage.getItem("loggedInId"));
              }} />
          : <></>
        }
        
        <div className="row">
          <Routes>
              <Route path="/" element={<Main movieRouteCallback={routing} />} />
              <Route path="/movie" element={<Movie loggedIn={loggedIn}/>} />
              <Route path="/profile" element={<Profile profileRouteCallback={routing} setLogout={() => setLoggedIn(false)}/>} />
          </Routes>
        </div>

      <Footer />
    </div>
  );
}

export default App;
