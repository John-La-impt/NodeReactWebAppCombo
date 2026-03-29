import React, { useEffect, useState } from "react";
import { getUserRepo, getReservationsRepo, editUserRepo, deleteUserRepo } from "../repository/Repository.js"

function checkPassword(password) {
    return /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&])(?=.*[a-zA-Z\d@$!%*#?&]).{8,}/.test(password);
}

function Profile({ profileRouteCallback, setLogout }) {
    // state to switch the mode of the page, 0 == no | 1 == editing | 2 == delete confirmation
    const [editing, setEditing] = useState(1); 
    // state to keep the logged in user object
    const [loggedUser, setLoggedUser] = useState({});
    // states to keep track of fields
    const [email, setEmail] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    // state to keep track of the jsx for sessions
    const [sessionJsx, setSessionJsx] = useState();

    useEffect(() => {
        // get the user from the db
        var idInt = parseInt(localStorage.getItem("loggedInId"));
        async function getOneUser() {
            var data = await getUserRepo(idInt);
            if (data != null) {
                setLoggedUser(data);
                setEmail(data.email);
                setFname(data.firstName);
                setLname(data.lastName);
            }
        }

        async function getReservations() {
            const data = await getReservationsRepo(idInt);
            
            if (data != null) {
                makeSession(data);
            }
        }

        getOneUser();
        getReservations();
    }, []);

    function makeSession(sessions) {
        var listItems = sessions.map(session => {
            var seatStr = "";
            session.ticketObjs.map(ticket => {
                seatStr = seatStr + (ticket.name + ", ");
            });
            return(<li>{session.movieName}: {session.date} at {session.time}. Seats: {seatStr}</li>);
        })
        setSessionJsx(<ul>{listItems}</ul>);
    }

    async function editMode() {
        // check if trying to change password
        if (password == "" ) { // not changing password
            // fill the missing fields
            if (email == "") setEmail(loggedUser.email);
            if (fname == "") setFname(loggedUser.firstName);
            if (lname == "") setLname(loggedUser.lastName);
            // get the value in and put into an object to be sent 
            var toSend = { id: loggedUser.id, email: email, firstName: fname, lastName: lname, passChange: 0 };
            const data = await editUserRepo(toSend)
            if (data != null) {
                console.log("changed not password");
                setEditing(1);
            }
        } else { // changing password
            if (password == confirmPassword) {
                if (checkPassword(password)) {
                    if (email == "") setEmail(loggedUser.email);
                    if (fname == "") setFname(loggedUser.firstName);
                    if (lname == "") setLname(loggedUser.lastName);
                    toSend = { id: loggedUser.id, email: email, firstName: fname, lastName: lname, passChange: 1, password: password };
                    const data = await editUserRepo(toSend);
                    if (data != null) {
                        console.log("changed password");
                        setEditing(1);
                    }
                } else {
                    console.log("Password must be at least 8 characters long, must contain lowercase, uppercase and special character");
                    setPassword("");
                    setConfirmPassword("");
                    setEditing(2);
                }
            } else {
                console.log("Passwords must match");
                setPassword("");
                setConfirmPassword("");
                setEditing(2);
            }
        }
    }

    async function handleDelete(id) {
        const data = await deleteUserRepo(id);
        if (data) { // true
            localStorage.removeItem("loggedIn");
            localStorage.removeItem("loggedInId");
            setLogout();
            profileRouteCallback("toMain");
        } else {
            console.log("something went wrong");
        }
    }

    return (
        <div className="profile">
            <h2>Profile:</h2>
            { editing == 1 
                    // display info
                ? (
                    <div>
                        <p>Email: {email}</p>
                        <p>First name: {fname}</p>
                        <p>Last name: {lname}</p>
                        <p>Current reservations:</p>
                        {sessionJsx}
                    </div>
                )
            : editing == 2
                    // editing
                ? ( 
                    <div> 
                        <input 
                            type="text" 
                            placeholder="Email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        /><br/><br/>
                        <input
                            type="text"
                            placeholder="First name"
                            value={fname}
                            onChange={(e) => setFname(e.target.value)}
                        /><br/><br/>
                        <input
                            type="text"
                            placeholder="Last name"
                            value={lname}
                            onChange={(e) => setLname(e.target.value)}
                        /><br/><br/>
                        <input
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        /><br/><br/>
                        <input
                            type="password" 
                            placeholder="Password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        /><br/><br/>
                    </div>
                )
            : editing == 3
                    // delete confirmation
                ? (
                    <div>
                        <h3>Deleting your profile. You won't be able to login and your reviews will be deleted. Your reservations will be kept.</h3> 
                        <h3>Are you sure?</h3>
                        <button onClick={() => handleDelete(parseInt(localStorage.getItem("loggedInId")))}>Yes</button>&nbsp;&nbsp;&nbsp;
                        <button onClick={() => setEditing(1)}>No</button>
                    </div>
                )
                :<></>
            }
            
            { editing == 2
                // buttons to display if the user is editing
                ? (
                    <div>
                        <button onClick={() => setEditing(1)}>Cancel</button>&nbsp;&nbsp;&nbsp;
                        <button onClick={editMode}>Confirm</button>&nbsp;&nbsp;&nbsp;
                        <button onClick={() => setEditing(3)}>Delete</button>&nbsp;&nbsp;&nbsp;
                    </div>
                )
                : editing == 1
                // buttons to display if the user is currently viewing the info
                ? (
                    <button onClick={() => setEditing(2)}>Edit</button>
                )
                : <></>
            }
        </div>
    );
}

export default Profile;