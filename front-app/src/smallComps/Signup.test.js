import { getByLabelText, getByText, screen, render, fireEvent, computeHeadingLevel } from "@testing-library/react";
import Signup from "./Signup";
import App from "../App";
import { checkEmail, checkPassword } from "./Signup";

import axios from "axios";

// import { getAllUserRepo } from "../repository/Repository";

// import axios from "axios";

// import { checkEmail } from "./Signup";

import { workSubmit } from "./Signup";

jest.mock("axios");

const API_HOST = "http://localhost:4000";


// global
// var users;
var rendered;
var topContainer;
// var countBefore;
// var countAfter;
// var oldLastAdded;

// run before all tests - setup the global var
beforeAll(() => {
    // const dataBefore = await getAllUserRepo();
    // countBefore = dataBefore.length;
    // async function getLatest() {
    //     const response = await axios.get(API_HOST + "/api/users/lastAdded");
    //     oldLastAdded = response.data;
    // }
    // getLatest();
});

beforeEach(() => {
    rendered = render(<Signup  />); // render app
    // const utils = shallow
    topContainer = rendered.container;
});

test("Component rendered", () => {
    expect(screen.getByText("Signup:")).toBeInTheDocument();
});

test("Mock the submit function: success", async () => {
    const mockUser = { id: 1, email: "mattboo@email.com", firstName: "Matt", lastName: "Boo", password: "Abcd1234!", reserves: "3=4", updatedAt: "2023-10-03T10:16:25.000Z" };
    axios.post.mockImplementationOnce(() => Promise.resolve({
        data: mockUser
    }));

    var email = "mattboo@email.com";
    var fname = "Matt";
    var lname = "Boo";
    var password = "Abcd1234!"
    var user = { email: email, firstName: fname, lastName: lname, password: password};

    const result = await workSubmit(email, fname, lname, password);
    expect(axios.post).toHaveBeenCalledWith(API_HOST + "/api/users", user);
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUser);
});

test("Mock the submit function: fail email", async () => {
    const mockUser = { id: 1, email: "mattboo@email.com", firstName: "Matt", lastName: "Boo", password: "Abcd1234!", reserves: "3=4", updatedAt: "2023-10-03T10:16:25.000Z" };
    axios.post.mockImplementationOnce(() => Promise.resolve({
        data: mockUser
    }));

    var email = "mattboo@email.c";
    var fname = "Matt";
    var lname = "Boo";
    var password = "Abcd1234!"
    var user = { email: email, firstName: fname, lastName: lname, password: password};

    const result = await workSubmit(email, fname, lname, password);
    // expect(axios.post).toHaveBeenCalledWith(API_HOST + "/api/users", user);
    expect(axios.post).toHaveBeenCalledTimes(0);
    expect(result).toEqual(null);
});

test("Mock the submit function: fail password", async () => {
    const mockUser = { id: 1, email: "mattboo@email.com", firstName: "Matt", lastName: "Boo", password: "Abcd1234!", reserves: "3=4", updatedAt: "2023-10-03T10:16:25.000Z" };
    axios.post.mockImplementationOnce(() => Promise.resolve({
        data: mockUser
    }));

    var email = "mattboo@email.com";
    var fname = "Matt";
    var lname = "Boo";
    var password = "abcd1234!"
    var user = { email: email, firstName: fname, lastName: lname, password: password};

    const result = await workSubmit(email, fname, lname, password);
    // expect(axios.post).toHaveBeenCalledWith(API_HOST + "/api/users", user);
    expect(axios.post).toHaveBeenCalledTimes(0);
    expect(result).toEqual(null);
});

test("Mock the submit function: fail empty fields", async () => {
    const mockUser = { id: 1, email: "mattboo@email.com", firstName: "Matt", lastName: "Boo", password: "Abcd1234!", reserves: "3=4", updatedAt: "2023-10-03T10:16:25.000Z" };
    axios.post.mockImplementationOnce(() => Promise.resolve({
        data: mockUser
    }));

    var email = "mattboo@email.com";
    var fname = "";
    var lname = "";
    var password = "Abcd1234!"
    var user = { email: email, firstName: fname, lastName: lname, password: password};

    const result = await workSubmit(email, fname, lname, password);
    // expect(axios.post).toHaveBeenCalledWith(API_HOST + "/api/users", user);
    expect(axios.post).toHaveBeenCalledTimes(0);
    expect(result).toEqual(null);
});

test("Check signup fields are changing", () => {
    // topContainer.setState({ showSignupin: 1 });
    // rendered.setState({ showSignupin: 1 });
    // expect(getByText("Signup:")).toBeInTheDocument();
    // expect(topContainer).toBeInTheDocument();
    // expect(screen.getByText("Signup:")).toBeInTheDocument();
    const emailInput = screen.getByRole("emailField");
    const fnameInput = screen.getByRole("fnameField");
    const lnameInput = screen.getByRole("lnameField");
    const passwordInput = screen.getByRole("passwordField");

    fireEvent.change(emailInput, { target: { value: "jon@mai.com" } });
    fireEvent.change(fnameInput, { target: { value: "jon" } });
    fireEvent.change(lnameInput, { target: { value: "jonson" } });
    fireEvent.change(passwordInput, { target: { value: "Abcd1234!" } });
    expect(testFields(emailInput.value, "jon@mai.com", fnameInput.value, "jon", lnameInput.value, "jonson", passwordInput.value, "Abcd1234!")).toBe(true);
});
function testFields(emailInput, emailValue, fnameInput, fnameValue, lnameInput, lnameValue, passwordInput, passwordValue) {
    var checkEmail = (emailInput == emailValue);
    var checkFname = (fnameInput == fnameValue);
    var checkLname = (lnameInput == lnameValue);
    var checkPassword = (passwordInput == passwordValue);
    // console.log(checkFname);
    // console.log(checkLname);
    // console.log(passwordInput);
    // console.log(checkPassword);

    return (checkEmail && checkFname && checkLname && checkPassword);
}

test("Check email validation", () => {
    var wrongEmail1 = "jimmail.com";
    var wrongEmail2 = "jim@mailcom";
    var wrongEmail3 = "j@im@mail.com";
    var wrongEmail4 = "jim@mail.c"
    var rightEmail = "jim@mail.com"
    // var wrongEmail
    expect(testEmail(wrongEmail1, wrongEmail2, wrongEmail3, wrongEmail4, rightEmail)).toBe(true);
});
function testEmail(wrongEmail1, wrongEmail2, wrongEmail3, wrongEmail4, rightEmail) {
    var check1 = checkEmail(wrongEmail1);
    var check2 = checkEmail(wrongEmail2);
    var check3 = checkEmail(wrongEmail3);
    var check4 = checkEmail(wrongEmail4);
    var check5 = checkEmail(rightEmail);
    // console.log(check2);
    return !check1 && !check2 && !check3 && !check4 && check5;
}

test("Check password validation", () => {
    var wrongPassword1 = "Abc123!";
    var wrongPassword2 = "Abcd1234";
    var wrongPassword3 = "abcd1234!";
    var wrongPassword4 = "Abcdefgh!";
    var rightPassword = "Abcd1234!";
    expect(testPassword(wrongPassword1, wrongPassword2, wrongPassword3, wrongPassword4, rightPassword));
});
function testPassword(wrongPassword1, wrongPassword2, wrongPassword3, wrongPassword4, rightPassword) {
    var check1 = checkPassword(wrongPassword1);
    var check2 = checkPassword(wrongPassword2);
    var check3 = checkPassword(wrongPassword3);
    var check4 = checkPassword(wrongPassword4);
    var check5 = checkPassword(rightPassword);
    return !check1 && !check2 && !check3 && !check4 && check5;
}

// test("check that a user will get created", async () => {
    // const emailInput = screen.getByRole("emailField");
    // const fnameInput = screen.getByRole("fnameField");
    // const lnameInput = screen.getByRole("lnameField");
    // const passwordInput = screen.getByRole("passwordField");
    // const button = screen.getByRole("submitButton");

    // // set the fields and submit
    // fireEvent.change(emailInput, { target: { value: "jonj@mail.com" } });
    // fireEvent.change(fnameInput, { target: { value: "Jon" } });
    // fireEvent.change(lnameInput, { target: { value: "Johnson" } });
    // fireEvent.change(passwordInput, { target: { value: "Abcd1234!" } });
    // fireEvent.click(button);
    

    // function setAndAdd() {
        
    // }

    // var newLast;
    // var oldLast;
    // async function addGuy() {
    //     const emailInput = screen.getByRole("emailField");
    //     const fnameInput = screen.getByRole("fnameField");
    //     const lnameInput = screen.getByRole("lnameField");
    //     const passwordInput = screen.getByRole("passwordField");
    //     const button = screen.getByRole("submitButton");

    //     // set the fields and submit
    //     fireEvent.change(emailInput, { target: { value: "jonj@mail.com" } });
    //     fireEvent.change(fnameInput, { target: { value: "Jon" } });
    //     fireEvent.change(lnameInput, { target: { value: "Johnson" } });
    //     fireEvent.change(passwordInput, { target: { value: "Abcd1234!" } });
    //     fireEvent.click(button);
    // }

    // async function getOldLatest() {
    //     const response = await axios.get(API_HOST + "/api/users/lastAdded");
    //     oldLast = response.data.email;
    // }

    // async function getNewLatest() {
    //     const response = await axios.get(API_HOST + "/api/users/lastAdded");
    //     newLast = response.data.email;
    // }

    // for (var i = 0; i < 1000000000; i++) {
    //     if (i == 1) {
    //         await getOldLatest();
    //     } else if (i == 2000000) {
    //         await addGuy();
    //     } else if (i == 200000000) {
    //         await getNewLatest();
    //     } else if (i == 500000000) {
    //         console.log("old: " + oldLast);
    //         console.log("new: " + newLast);
    //     }
    // }

    // getNewLatest();
// });



