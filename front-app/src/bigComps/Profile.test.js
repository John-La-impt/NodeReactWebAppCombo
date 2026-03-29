// import { getByLabelText, getByText, screen, render, fireEvent, computeHeadingLevel } from "@testing-library/react";

// import Profile from "./Profile";

// var rendered;
// var topContainer;
// const localStorageMock = {
//     getItem: jest.fn(),
//     setItem: jest.fn(),
//     clear: jest.fn()
// };
// global.localStorage = localStorageMock; //as unknown as Storage;

// beforeAll(() => {
//     localStorageMock.setItem()
// });
import { getByLabelText, getByText, screen, render, fireEvent, computeHeadingLevel } from "@testing-library/react";
import axios from "axios";
import { getUserRepo } from "../repository/Repository";
import Profile from "./Profile";

jest.mock("axios");

const API_HOST = "http://localhost:4000";

var rendered;
var topContainer;

// test("sss", () => {
//    expect(true).toBe(true); 
// });

// beforeEach(() => {
    // rendered = render(<Profile loggedInId={1} />); // render app
    // const utils = shallow
    // topContainer = rendered.container;
// });

test("Mock the getUser function", async () => {
    // const mockUsers = [ 
    //     {
    //         id: 1, email: "mattboo@email.com", firstName: "Matt", lastName: "boo", password: "Abcd1234!", reserves: "3=4", updatedAt: "2023-10-03T10:16:25.000Z"
    //     },
    //     {
    //         id: 2, email: "joeboo@email.com", firstName: "Joe", lastName: "boo", password: "Abcd1234!", reserves: "5=6", updatedAt: "2023-10-03T10:16:25.000Z"
    //     },
    // ];
    const mockUser = { id: 1, email: "mattboo@email.com", firstName: "Matt", lastName: "boo", password: "Abcd1234!", reserves: "3=4", updatedAt: "2023-10-03T10:16:25.000Z" };
    
    // axios.get.mockImplementationOnce((id) => {
    //     if (id == 1) {
    //         return Promise.resolve({ data: mockUser });
    //     } else {
    //         return Promise.reject(null);
    //     }
    //     // } else {
    //     //     return Promise.reject(null);
    //     // }
    // });

    var id = 1;

    axios.get.mockImplementationOnce(() => Promise.resolve({
        data: mockUser
    }));

    const result = await getUserRepo(id);
    // console.log("got" + result)

    expect(axios.get).toHaveBeenCalledWith(API_HOST + `/api/users/view/${id}`);
    expect(axios.get).toHaveBeenCalledTimes(1);
    // expect(true).toBe(true);
});

// test("Test profile: ", async () => {
//     expect(screen.getByText("Profile:")).toBeInTheDocument();
// });
