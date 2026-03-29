import { getByLabelText, getByText, screen, render, fireEvent, computeHeadingLevel } from "@testing-library/react";


import Signin from "./Signin";

import axios from "axios";


import { signinRepo } from "../repository/Repository";

import { workSubmit } from "./Signin";


jest.mock("axios");

const API_HOST = "http://localhost:4000";

var rendered;
var topContainer;

beforeAll(() => {

});

beforeEach(() => {
    rendered = render(<Signin  />); // render app
    // const utils = shallow
    topContainer = rendered.container;
});

test("Mock the submit function: success", async () => {
    const mockUser = { id: 1, email: "mattboo@email.com", firstName: "Matt", lastName: "Boo", password: "Abcd1234!", reserves: "3=4", updatedAt: "2023-10-03T10:16:25.000Z" };
    axios.get.mockImplementationOnce(() => Promise.resolve({
        data: mockUser
    }));

    var email = "mattboo@email.com";
    var password = "Abcd1234!"

    const result = await workSubmit(email, password);

    expect(axios.get).toHaveBeenCalledWith(API_HOST + "/api/users/login", { params: { email, password } });
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockUser);
});

test("Mock the submit function: fail due to empty", async () => {
    const mockUser = { id: 1, email: "mattboo@email.com", firstName: "Matt", lastName: "Boo", password: "Abcd1234!", reserves: "3=4", updatedAt: "2023-10-03T10:16:25.000Z" };
    axios.get.mockImplementationOnce(() => Promise.resolve({
        data: mockUser
    }));

    var email = "mattboo@email.com";
    var password = ""

    const result = await workSubmit(email, password);

    // expect(axios.get).toHaveBeenCalledWith(API_HOST + "/api/users/login", { params: { email, password } });
    expect(axios.get).toHaveBeenCalledTimes(0);
    expect(result).toEqual(null);
});

test("Mock the submit function: fail due to wrong email form", async () => {
    const mockUser = { id: 1, email: "mattboo@email.com", firstName: "Matt", lastName: "Boo", password: "Abcd1234!", reserves: "3=4", updatedAt: "2023-10-03T10:16:25.000Z" };
    axios.get.mockImplementationOnce(() => Promise.resolve({
        data: mockUser
    }));

    var email = "mattboo@r@email.com";
    var password = "Abcd1234!";

    const result = await workSubmit(email, password);

    // expect(axios.get).toHaveBeenCalledWith(API_HOST + "/api/users/login", { params: { email, password } });
    expect(axios.get).toHaveBeenCalledTimes(0);
    expect(result).toEqual(null);
});

test("Component rendered", () => {
    expect(screen.getByText("Signin:")).toBeInTheDocument();
});

// test("Check signup fields are changing", () => {
//     const emailInput = screen.getByRole("emailField");
//     const passwordInput = screen.getByRole("passwordField");

//     fireEvent.change(emailInput, { target: { value: "jon@mai.com" } });
//     fireEvent.change(passwordInput, { target: { value: "Abcd1234!" } });
//     expect(testFields(emailInput.value, "jon@mai.com", fnameInput.value, "jon", lnameInput.value, "jonson", passwordInput.value, "Abcd1234!")).toBe(true);
// });
// function testFields(emailInput, emailValue, passwordInput, passwordValue) {
//     var checkEmail = (emailInput == emailValue);
//     var checkPassword = (passwordInput == passwordValue);
//     return (checkEmail && checkPassword);
// }



