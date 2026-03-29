import React from "react";
import { useState } from "react";
import { signinRepo } from "../repository/Repository.js"

function checkEmail(email) {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/.test(email);
}

function checkPassword(password) {
    // return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&])(?=.*[a-zA-Z\d@$!%*#?&]).{8,}/.test(password);
    return true;
}

export async function workSubmit(email, password) {
    var toReturn = null;
    var userAccount = { email, password};
    if (email == "" || password == "") {
        console.log("Fill all fields");
        toReturn = 3;
    } else {
        var check1 = checkEmail(email);
        var check2 = checkPassword(password);
        if (check1 && check2) {
            // console.log(userAccount);
            var signedIn = await signinRepo(email, password);
            // console.log(signedIn);
            toReturn = signedIn;
        } else if (!check1) {
            // console.log("Invalid email");
            toReturn = 1;
        } else if (!check2) {
            console.log("Password must be at least 8 characters long, must contain lowercase, uppercase and special character");
            toReturn = 2;
        }
    }
    return toReturn;
}

function Signin({ closeCard, loggedIn}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showSuccess, setShowSuccess] = useState(false);

    const [loggedInUser, setLoggedInUser] = useState({});
    
    const [error, setError] = useState(0);

    async function handleSubmit() {
        var data = await workSubmit(email, password);
        if (data != null && data != 1 && data != 2 && data != 3 && data != 4 && data != 5) {
            localStorage.setItem("loggedIn", true);
            setLoggedInUser(data);
            localStorage.setItem("loggedInId", data.id);
            loggedIn();
            setShowSuccess(true);
            setError(0);
        } else {
            if (data != null) setError(data);
            else setError(6);
        }
    }

    function getSuccessName() {
        if (localStorage.getItem("loggedIn") != null) {
            return (loggedInUser.firstName + ' ' + loggedInUser.lastName);
        } else {
            return null;
        }
    }

    return (
        <div className="signinCard">
            <h3>Signin:</h3>
            {   error == 1
                ? <p>Invalid email</p>
                : error == 2
                ? <p>Password must be at least 8 characters long, must contain lowercase, uppercase and special character</p>
                : error == 3
                ? <p>Fill all fields</p>
                : error == 4
                ? <p>User does not exists or wrong password</p>
                : error == 5
                ? <p>This profile is deleted, contact admin</p>
                : error == 6
                ? <p>User does not exists or wrong password</p>
                : <></>
            }
            { !showSuccess 
                ? 
                <div>
                    <h2 onClick={closeCard}>X</h2>
                    <form>
                        <br/><br/>
                        <input 
                            type="text" 
                            placeholder="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            role="emailField"
                        /> <br/><br/>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            role="passwordField"
                        /> <br/><br/>

                        <div className="submitDiv" onClick={handleSubmit} role="submitButton">
                            <p>Sign in</p>
                        </div>
                    </form>
                </div>
                :
                <div role="message">
                    <h2 onClick={closeCard}>X</h2>
                    <p>Welcome, {getSuccessName()}</p>
                </div>
            }
        </div>
    );
}

export default Signin