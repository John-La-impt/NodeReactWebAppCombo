import React from "react";
import { useState } from "react";
// import axios from "axios";
import { signupRepo } from "../repository/Repository.js"

// const API_HOST = "http://localhost:4000";

export function checkEmail(email) {
    // test using regular expression
    // return /\S+@(?![@])[\S]+\.\S+/.test(email);
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/.test(email);
}

export function checkPassword(password) {
    return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&])(?=.*[a-zA-Z\d@$!%*#?&]).{8,}/.test(password);
    // ?= look forward, so it will check what comes after
    // e.g., ?=.*\d means to check if the string has 0-9 (at any point)
    // {8,} check the preceding string being at least 8 characters long
}

export async function workSubmit(email, fname, lname, password) {
    var toReturn = null;
    if (email == "" || fname == "" || lname == "" || password == "") {
        console.log("Fill all fields");
        toReturn = 3;
    } else {
        var check1 = checkEmail(email);
        var check2 = checkPassword(password);

        if (check1 && check2) {
            // register
            console.log("Good");
            var user = { email: email, firstName: fname, lastName: lname, password: password };
            const signedUp = await signupRepo(user);
            // if (signedUp) {
            //     closeCard();
            //     loggedIn();
            // }
            // if (signedUp != null) {
            //     console.log("just sign up: " + signedUp);
            //     toReturn = signedUp;
            // }
            toReturn = signedUp;
            console.log(signedUp);
        } else if (!check1) {
            console.log("Invalid email");
            toReturn = 1;
            // clear email field fields
            // setEmail("");
        } else if (!check2) {
            console.log("Password must be at least 8 characters long, must contain lowercase, uppercase and special character");
            toReturn = 2;
            // setPassword("");
        }
    }
    return toReturn;
}

function Signup({ closeCard, loggedIn }) {

    const [email, setEmail] = useState("");
    const [fname, setFName] = useState("");
    const [lname, setLName] = useState("");
    const [password, setPassword] = useState("");

    const [showSuccess, setShowSuccess] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState({});

    const [error, setError] = useState(0);

    // async function handleSubmit() {
    //     // do check for validation here -- missing
    //     if (email == "" || fname == "" || lname == "" || password == "") {
    //         console.log("Fill all fields");
    //     } else {
    //         var check1 = checkEmail(email);
    //         var check2 = checkPassword(password);

    //         if (check1 && check2) {
    //             // register
    //             console.log("Good");
    //             var user = { email: email, firstName: fname, lastName: lname, password: password };
    //             var signedUp = await signupRepo(user);
    //             if (signedUp) {
    //                 closeCard();
    //                 loggedIn();
    //             }
    //         } else if (!check1) {
    //             console.log("Invalid email");
    //             // clear email field fields
    //             setEmail("");
    //         } else if (!check2) {
    //             console.log("Password must be at least 8 characters long, must contain lowercase, uppercase and special character");
    //             setPassword("");
    //         }
    //     }
    //     // put userAccount into localStorage
    // }

    async function handleSubmit() {
        var success = await workSubmit(email, fname, lname, password);
        if (success != null && success != 1 && success != 2 && success != 3) {
            console.log("Good");
            // var toSave = success.id + "=1=" + success.email + "=2=" + success.firstName + "=3=" + success.lastName;
            localStorage.setItem("loggedIn", true);
            setLoggedInUser(success);
            localStorage.setItem("loggedInId", success.id);
            console.log(success);
            // closeCard();
            loggedIn();
            setShowSuccess(true);
            setError(0);
        } else {
            setEmail("");
            setPassword("");
            if (success == 1) setError(1); // wrong email
            else if (success == 2) setError(2); // wrong password
            else if (success == 3) setError(3); // missing field(s)
            else if (success == null) setError(4); // email exists
        }
    }

    function getSuccessName() {
        if (localStorage.getItem("loggedIn") != null) {
            // var n2 = localStorage.getItem("loggedIn").indexOf("=2="); // firstname
            // var n3 = localStorage.getItem("loggedIn").indexOf("=3="); // lastname
            // return (localStorage.getItem("loggedIn").substring(n2+3, n3) + ' ' + localStorage.getItem("loggedIn").substring(n3+3));
            return (loggedInUser.firstName + ' ' + loggedInUser.lastName);
        } else {
            return null;
        }
    }

    return (
        <div className="signupCard">
            { !showSuccess 
            ?   <>
                <h3>Signup:</h3>
                {   error == 1
                    ?   <p className="errorMsg">Invalid email</p>
                    : error == 2
                    ?   <p className="errorMsg">Password must be at least 8 characters long, must contain lowercase, uppercase and special character</p>
                    : error == 3
                    ?   <p className="errorMsg">Fill all fields</p>
                    : error == 4
                    ?   <p className="errorMsg">Email already exists</p>
                    : <></>
                }
                <h2 onClick={closeCard}>X</h2>
                <form>
                    <input 
                        type="text" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        role="emailField"
                    /> <br/><br/>
                    <input 
                        type="text" 
                        placeholder="First name" 
                        value={fname}
                        onChange={(e) => setFName(e.target.value)} // e is event from onChange - we gave it the variable e to be able to refer to it. target is the html tag, in this case input value will be the the variable we be changing
                        role="fnameField"
                    /> <br/><br/>
                    <input 
                        type="text" 
                        placeholder="Last name" 
                        value={lname}
                        onChange={(e) => setLName(e.target.value)} // e is event from onChange - we gave it the variable e to be able to refer to it. target is the html tag, in this case input value will be the the variable we be changing
                        role="lnameField"
                    /> <br/><br/>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        role="passwordField"
                    /> <br/><br/>

                    <div className="submitDiv" onClick={handleSubmit} role="submitButton"> 
                    {/* onClick is not arrowed function because arrow function with onclick means call the function as event handler - the event being the button onclick*/}
                    {/* handleSubmit does not have that because the values that matters are kept on other event changes - in this case the setName - setEmail and setPassword */}
                        <p>Sign up</p>
                    </div>
                </form>
                </>
            :
            <div role="message">
                <h2 onClick={closeCard}>X</h2>
                <p>Welcome, {getSuccessName()}</p>
            </div>
            }
        </div>
    );
}

export default Signup