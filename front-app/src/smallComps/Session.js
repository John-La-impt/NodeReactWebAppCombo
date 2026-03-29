import React, { useEffect, useState } from "react";
import { addReservationRepo, getAvailTicketsRepo } from "../repository/Repository";

function Session({ closeSession }) {
    // state to keep track of the session jsx to display
    const [sessionJsx, setSessionJsx] = useState();

    // get the seats available to be reserved
    useEffect(() => {
        var idInt = parseInt(localStorage.getItem("storeSession"));
        async function getAvailTickets() {
            const data = await getAvailTicketsRepo(idInt);
            showAvailTickets(data);
        }

        getAvailTickets();
    }, []);

    function showAvailTickets(data) {
        var listItems = data.freeTickets.map(ticket => 
            <li>Seat: <button onClick={() => {
                addReservationRepo(ticket);
                closeSession();
            }}>{ticket.name}</button></li>
        )
        setSessionJsx( <ul>{listItems}</ul> );
    }

    return (
        <div className="sessionCard">
            {sessionJsx}
            <button onClick={closeSession}>close</button>
        </div>
    );
}

export default Session;