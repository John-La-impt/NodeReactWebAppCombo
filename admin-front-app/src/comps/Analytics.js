import React, { useContext } from "react";
import { useEffect, useReducer, useState } from 'react';

import { getReviewsPerMovie, getViewsPerMovie, getTicketPerDay } from "../repository/Repository";

import BarChart from '../chart/BarChart';

import { ReloadContext } from "../App";

function reducer(state, action) {
    if (action.type == 1) {
      return { barData: action.passInData };
    } else if (action.type == 0) {
      return state;
    }
}

function reducer2(state2, action) {
    if (action.type == 1) {
        return { barData: action.passInData };
    } else if (action.type == 0) {
        return state2;
    }
}

function reducer3(state3, action) {
    if (action.type == 1) {
        return { barData: action.passInData };
    } else if (action.type == 0) {
        return state3;
    }
}

function Analytics() {
    const reloadContext = useContext(ReloadContext);
    console.log("analytics just rerender: " + reloadContext);

    // state to keep data of reviews per movie
    const [state, dispatch] = useReducer(reducer, { barData: { labels: [], datasets: [{}] } });
    // state to keep views per movie
    const [state2, dispatch2] = useReducer(reducer2, { barData: { labels: [], datasets: [{}] } });
    // state to keep tickets reserved/day
    const [state3, dispatch3] = useReducer(reducer3, { barData: { labels: [], datasets: [{}] } }); 

    useEffect(() => {
        /* 
          this function prepares data for reviews per movie and avg reviews per movie.
          reviews per movie (especially average reviews per movie) data allows the admins to see
          whether the users is being engaged with the website and/or willing to spend time leaving reviews.
          also what kind of movie is most popular, since most users won't be leaving reviews, a movie with review means it
          most likely had the most amount of viewers.
        */
        async function prepData() {
          const data = await getReviewsPerMovie();
          var labels = [];
          var datasets = [];
          var datasingle = [];
          data.reviewsPerMovie.map(movie => {
            labels.push(movie.name);
            datasingle.push(movie.reviewCount);
          });
    
          var label = "Reviews per movie"
          datasets.push({ label: label, data: datasingle });
          var toPass = {
            labels: labels,
            datasets: datasets
          }
          dispatch({
            type: 1,
            passInData: toPass 
          });
        };

        /* 
          this function prepares data for views per movie page.
          this data allows the admins to see what type of movie poster engages the user to click on it
          whether it is an official poster or an alternate posters
        */
        async function prepData2() {
            const data = await getViewsPerMovie();
            var labels = [];
            var datasets = [];
            var datasingle = [];
            data.allMovies.map(movie => {
              labels.push(movie.name);
              datasingle.push(movie.view);
            });
      
            var label = "Views per movie"
            datasets.push({ label: label, data: datasingle });
            var toPass = {
              labels: labels,
              datasets: datasets
            }
            dispatch2({
              type: 1,
              passInData: toPass 
            });
        };

        /* 
          this function prepares data for tickets per day
          this data allows the admin to see on what dates the user are more likely to reserves ticket
          allowing the admin to push for marketing or ads on certain dates, or creating promotions for dates 
          where the users are more likely to engages with
        */
        async function prepData3() {
            const data = await getTicketPerDay();
            var labels = [];
            var datasets = [];
            var datasingle = [];
            data.ticketsReservedPerDay.map(ticket => {
              labels.push(ticket.dateReserved);
              datasingle.push(ticket.reserveCount);
            });
      
            var label = "Tickets reserved per day"
            datasets.push({ label: label, data: datasingle });
            var toPass = {
              labels: labels,
              datasets: datasets
            }
            dispatch3({
              type: 1,
              passInData: toPass 
            });
        };
    
        prepData();
        prepData2();
        prepData3();
      }, [reloadContext]);

    return (
        <div className="analytics">
            {/* child level 2 */}
            <BarChart chartData={state.barData}/>
            <BarChart chartData={state2.barData}/>
            <BarChart chartData={state3.barData}/>
        </div>
    );
}

export default Analytics;