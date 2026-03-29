import { getByLabelText, getByText, screen, render, fireEvent, computeHeadingLevel } from "@testing-library/react";

import axios from "axios";

import Review from "./Review";

import { getUserRepo,getMovieRepo, postReviewRepo } from "../repository/Repository";

import { workSubmit } from "./Review";

// review uses: getUserRepo, getMovieRepo, postReviewRepo

jest.mock("axios");

const API_HOST = "http://localhost:4000";

var rendered;
var topContainer;

beforeEach(() => {
    rendered = render(<Review  />); // render app
    // const utils = shallow
    topContainer = rendered.container;
});

test("Component rendered", () => {
    expect(screen.getByText("Add Review:")).toBeInTheDocument();
});

test("Mock the work function: success", async () => {
    // const mockUser = { id: 1, email: "mattboo@email.com", firstName: "Matt", lastName: "boo", password: "Abcd1234!", reserves: "3=4", updatedAt: "2023-10-03T10:16:25.000Z" };
    axios.get.mockImplementation(() => Promise.resolve({
        data: "good"
    }));

    axios.post.mockImplementation(() => Promise.resolve({
        data: "good"
    }));

    
    // const radio5 = screen.getByRole("radio5");
    // const textArea = screen.getByRole("textArea");
    // const submitBtn = screen.getByRole("submitBtn");
    // fireEvent.click(radio5);
    // fireEvent.change(textArea, { target: { value: "test input" } });
    // fireEvent.click(submitBtn);
    var userId = 1;
    var movieId = 2;
    var ratings = 3;
    var comments = "456";

    const data = await workSubmit(userId, movieId, ratings, comments);

    // expect(axios.get).toHaveBeenCalledWith(API_HOST + "/api/users/login", { params: { email, password } });
    expect(axios.get).toHaveBeenCalledTimes(2);
    expect(axios.post).toHaveBeenCalledTimes(1);
    // expect(result).toEqual(mockUser);
});