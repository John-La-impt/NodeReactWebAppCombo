# Node and React Apps Combo
### Demo video: https://drive.google.com/file/d/13nqZMyxiXId0MjHw_NKjuWZX5D67OOr9/view?usp=sharing

-------------------------------------

# 1. User Targeted Website
Front and middle app produce a website that represent what a typical user would see. This portal allows a user to view movies and their sessions, sign up/in, reserve tickets (seats) when signed in, and leave reviews on movies.

## 1.1 Front App
A React app that displays the data queried from middle app. Implemented with focus on the useState hook.
<img width="700" height="296" alt="Untitled" src="https://github.com/user-attachments/assets/4aaf6cea-91d5-4f32-b655-0fac2a10717c" />
<img width="700" height="285" alt="Untitled2" src="https://github.com/user-attachments/assets/d4cb765d-a557-4d83-9b93-76466682235a" />

## 1.2. Middle App
A Node-Express app that handles communication with a SQL database. Mapped using Sequelize, send requests and receive .json using REST API. The middle app provides routes for the front app to query and receive the data.

-------------------------------------

# 2. Admin Targeted Website
Admin front and admin middle app produce a website that represent what a admin user would see. This portal allows an admin to view some analytics, edit users and movie entries.

## 2.1. Admin Front App
A React app that displays the data queried from middle app. Implemented with focus on the useReducer hook.
<img>
<img width="700" height="350" alt="Untitled3" src="https://github.com/user-attachments/assets/0a06f5f0-0c80-4612-a9ee-18fc2559b90b" />
<img width="700" height="282" alt="Untitled4" src="https://github.com/user-attachments/assets/cb850fa3-f72d-4030-8d86-5d04105cb31a" />

## 2.2. Admin Middle App
A Node-GraphQL app that handles communication with a SQL database. Build GraphQL schema and send/receive flexible requests. The admin middle app provides routes for the admin front app to query and receive the data.
