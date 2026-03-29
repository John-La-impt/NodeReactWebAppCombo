import React from "react";

function Header({ mainRouteCallback }) {
    function routeToMain() {
        localStorage.setItem("storeMovie", null);
        mainRouteCallback("toMain");
    }

    return (
        <div className="header">
            <h1 onClick={() => routeToMain()}>Loop Cinema</h1>
            <p>Loop Cinema provides the premier cinema going experience. Providing the latest movies as well as community events in many of our beautiful venues.</p>
        </div>
    );
}

export default Header