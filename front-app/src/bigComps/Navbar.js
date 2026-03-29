import React from "react";

function Navbar({ openUp, openIn, loggedIn, setLogin, profileRouteCallback }) {
    // callback to logout
    function logout() {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("loggedInId");
        setLogin();
        profileRouteCallback("toMain");
    }

    return (
        <div className="navbar">
            <p>Current Cinema: 1 Real St. Melbourne VIC, 3000</p>
            {   loggedIn
                ? 
                    <div>
                        <a href="#" className="right" onClick={() => logout()}>Sign Out</a>
                        <a href="#" className="right" onClick={() => profileRouteCallback("toProfile")}>Profile</a>
                    </div>
                : 
                    <div>
                        <a href="#" className="right" onClick={openIn}>Sign In</a>
                        <a href="#" className="right" onClick={openUp}>Sign Up</a>
                    </div>
            }
        </div>
    );
}

export default Navbar