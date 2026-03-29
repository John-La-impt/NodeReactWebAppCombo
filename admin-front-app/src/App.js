import logo from './logo.svg';
import './App.css';

import React, { useReducer } from 'react';

import MovieEdit from './comps/MovieEdit';
import UserEdit from './comps/UserEdit';
import ReviewEdit from './comps/ReviewEdit';
import Analytics from './comps/Analytics';

export const ReloadContext = React.createContext();

function reducer(state, action) {
  if (action.type == 1) { // show analytics
    return { mode: 1 };
  } else if (action.type == 2) { // edit movies
    return { mode: 2 };
  } else if (action.type == 3) {
    return { mode: 3 };
  }
}

function reducer2(state2, action) {
  console.log("change to: " + !state2.reload);
  return { reload: !state2.reload };
}

function reducer3(tipState, action) {
  return { type: action.type};
}

function App() {
  // state to control what component to display
  const [state, dispatch] = useReducer(reducer, { mode: 0 });
  // state to change reload, to force re-render
  const [state2, dispatch2] = useReducer(reducer2, { reload: true });
  // state to show important infos on the left pane
  const [state3, dispatch3] = useReducer(reducer3, { type: 0 });

  return (
    <ReloadContext.Provider value={state2.reload}>
      <div className="App">
        <div className="leftColumn">
          <h2>Loop Cinema</h2>
          <h2>Admin Portal</h2>
          <p>This portal is for authorized users only.</p>
          { state3.type == 1
            ? 
            <>
              <p>Chart 1: Reviews per movie and average reviews per movie</p>
              <p>Chart 2: Views per movie</p>
              <p>Chart 3: Tickets reserved per day</p>
            </>
            : state3.type == 2
            ? 
            <>
              <p>*** Important ***</p>
              <p>Click Reload button to see results after making changes.</p>
            </>
            : state3.type == 3
            ?
            <>
              <p>*** Important ***</p>
              <p>Click Reload button to see results after making changes, e.g., after clicking Block.</p>
            </>
            : <></>
          }
        </div>

        <div className="topBtns">
          <button onClick={() => {
            dispatch2();
          }}>Reload</button>
          <button onClick={() => {
            dispatch({
              type: 1,
              mode: 1
            });
            dispatch3({
              type: 1
            });
          }}>Show Analytics</button>
          <button onClick={() => {
            dispatch({
              type: 2,
              mode: 2
            });
            dispatch3({
              type: 2
            });
          }}>Edit movies</button>
          <button onClick={() => {
            dispatch({
              type: 3,
              mode: 3
            });
            dispatch3({
              type: 3
            })
          }}>Edit users</button>
          {   state.mode == 1
            ? <div>
                {/* child level 1: analytics */}
                <Analytics /> 
              </div>
            : state.mode == 2
            ? <div>
                {/* child level 1: edit movies */}
                <MovieEdit />
              </div>
            : state.mode == 3
            ? <div>
                {/* child level 1: edit movies */}
                <UserEdit />
              </div>
            : <></>
          }
        </div>
      </div>
    </ReloadContext.Provider>
  );
}

export default App;
