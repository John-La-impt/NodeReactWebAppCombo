import React, { useEffect, useReducer, useContext, useRef } from "react";

// list of user
// click on user => show info + reviews
// can edit user info + edit reviews

import { getAllUsers, blockUnblockUser } from "../repository/Repository";
import ReviewEdit from "./ReviewEdit";

import { ReloadContext } from "../App";

async function handleBlockUnblock(whatDo, id) {
    // console.log(whatDo + " " + id);
    await blockUnblockUser(whatDo, id);
}

function reducer(state, action) {
    if (action.type == 1) {
        return { mode: 0, userList: <ul>{action.passInUserList}</ul>, currEditing: {} };
    } else if (action.type == 2) {
        return { mode: 1, userList: state.userList, currEditing: action.currEditing};
    } else if (action.type == 3) {
        return { mode: 0, userList: state.userList, currEditing: {} };
    } else if (action.type == 4) {
        // console.log("hello " + action.id);
        handleBlockUnblock(action.whatDo, action.id);
        return { mode: 0, userList: state.userList, currEditing: {} };
    }
}

function reducer2(state2, action) {
    return { mode: action.mode, currEditing: action.userId };
}

function reducerReload(stateReload, action) {
    console.log("reload called");
    return { reload: !(stateReload.reload) };
}

function UserEdit() {

    const reloadContext = useContext(ReloadContext);
    // console.log("user edits just rerender: " + reloadContext);

    const [state, dispatch] = useReducer(reducer, { mode: 0, userList: [], currEditing: {} });
    const [state2, dispatch2] = useReducer(reducer2, { mode: 0, currEditing: 0 });

    useEffect(() => {
        // console.log("user edit called useEffect")
        async function getAndSetUserList() {
            const data = await getAllUsers();
            var listItems = data.allUsers.map(user => 
                <li>
                    <p 
                    // onClick={() => {
                    //     console.log("Hello");
                    //     dispatch({
                    //         type: 2,
                    //         currEditing: user
                    //     })
                    // }}
                    >{user.id}: {user.firstName} {user.lastName}</p>
                    { user.blocked
                        ?   <button onClick={() => dispatch({
                                type: 4,
                                whatDo: 1,
                                id: user.id
                            })}>Unblock</button> 
                        :   <button onClick={() => dispatch({
                                type: 4,
                                whatDo: 0,
                                id: user.id
                            })}>Block</button>
                    }
                    <button onClick={() => {
                        dispatch2({
                            mode: 1,
                            userId: user.id
                        })
                    }}>User's Reviews</button>
                    &nbsp;&nbsp;&nbsp;
                </li>);

            dispatch({
                type: 1,
                passInUserList: listItems
            });
        }

        getAndSetUserList();
    }, [reloadContext]); // state

    

    return (
        <div className="userEdit">
            {/* child level 2 */}
            { state2.mode == 0
                ? 
                <div className="userInfo">
                    {   state.mode == 0
                            ?   <div>
                                    {state.userList}
                                </div>

                        : state.mode == 1
                            ?   <div>
                                    <button onClick={() => {
                                        dispatch({
                                            type: 3
                                        });
                                    }}>Back</button> <br/><br/>
                                    { state.currEditing.blocked 
                                        ?   <button onClick={() => handleBlockUnblock(1)}>Unblock</button> 
                                        :   <button onClick={() => handleBlockUnblock(0)}>Block</button>
                                    }
                                </div>
                        : <></>
                    }
                </div>
                : 
                <div className="reviewInfo">
                    <button onClick={() => {
                        dispatch2({
                            mode: 0,
                            id: 0
                        })
                    }}>Back to users list</button>
                    <ReviewEdit userId={state2.currEditing}/>
                </div>
            }

        {/* <button onClick={() => dispatchReload()}>drmusics</button> */}
        </div>
    );
}

export default UserEdit;