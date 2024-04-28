[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/qCtVf2Dd)
# Final Project
itempile - online marketplace

**Currently live at http://172.16.4.130** \
NOTE: needs VPN connection to TAMK's network to be able to reach the site

## Summary

- Itempile is an online marketplace like eBay or Tori.fi where users can post their own items and see other users items
- Each item has contact information so users can contact the seller via email
- The application is created with JavaScript and consists of a Vite/React frontend, a Node backend with an Express API and a MySQL database
- Used GitHub issues while developing

## How the project went?
Overall the project went really well but I still had some problems and challenges during it. Right at the start when I was setting up ESlint for my backend code I ran to my first problem. I tried setting up ESlint with the `npm init @eslint/config` command but it didnt work properly for me. Then I noticed that the init script didnt install the correct dependencies, since there was for example `eslint-plugin-react` installed even though I said in the init script that I was using ESlint for a Node backend. I then decided to just install the ESlint manually without the init script. But I was left wondering if that bug was only a me problem or was it for other people too, so I decided to make an issue about it in ESlint's repository. It turned out to be an actual bug that they then fixed! Link to the issue: https://github.com/eslint/create-config/issues/87

Apart from that problem at the start, I didnt have any major problems. I had some challenges during writing tests for the frontend, because I had to mock a lot of stuff but luckily I managed to overcome them. If I did this project again, I would consider writing e2e tests with cypress mostly instead. That way you wouldn't have to mock so much stuff and it would cover the whole application. I would also consider using only Material UI for the frontend styling and not a combination of plain CSS and Material UI 


## Running the application locally
To run the application locally in dev mode, do the following:
  1. Have Node 18 or above installed
  2. Clone the repository
  3. Add a .env file to the server folder
      - The .env file should look like this:
         ```
         PORT=[WRITE THE PORT WHERE YOU WANT THE SERVER TO RUN HERE]
         MYSQL_HOST=localhost
         MYSQL_USER=root
         MYSQL_PASSWORD=itempile_password
         MYSQL_DATABASE=itempile
         JWT_KEY=[WRITE A RANDOM STRING HERE]
         ```
  4. Add a .env file to the client folder
      - The .env file should look like this:
          ```
          VITE_API_URL=http://localhost:[WRITE THE PORT HERE THAT YOU SPECIFIED IN THE SERVER ENV FILE]
          ```
  6. In the root folder of the cloned repository folder run `docker compose -f .\docker-compose.dev.yml up `
  7. Run `npm install` in the `server` folder
  8. Run `npm run dev` in the `server` folder
  9. Run `npm install` in the `client` folder
  10. Run `npm run dev` in the `client` folder
  11. Now you have the application running at http://localhost:5173
  12. If you want to run the test on both client and server, you can do it with `npm test` in the corresponding folder
      - for example for client to run test you would do it in the `client` folder
  13. You can also test the endpoints yourself with the rest files in the `server` folder
      - `localhost.rest` is used for testing locally running endpoints
      - `server.rest` is used for testing endpoints in deployment



## CI/CD
- Development is automated using GitHub Actions
- The main branch is protected and pushes to it can only be done through pull-requests
- Before changes can be merged into main all the tests and linters need to pass
  - The test and linters are ran automatically in the pipeline
  - Both client and server use [ESlint](https://eslint.org/) as a linter
- When code is pushed to main, the same pipeline runs the verifications again, builds images of client and server and saves them to GitHub's registry and lastly deploys the whole project with docker to TAMK's virtual machine


## Client
- The client is a Vite/React frontend done with JavaScript
- Deployed as a docker container
- If the user isnt signed in, they can view other peoples items
- If the user signs up / logs in, they can also post their own items and edit or delete own items
- Styling of the frontend is done mostly with normal css, but [Material UI](https://mui.com/material-ui/getting-started/) is also used
- Validation of user input in forms is done with [formik](https://www.npmjs.com/package/formik) and [yup](https://www.npmjs.com/package/yup)
- Connections between the client and server are done with [react-query](https://www.npmjs.com/package/react-query)
- Users are informed of possible errors or successes using [react-toastify](https://www.npmjs.com/package/react-toastify)

### Client testing
- Client is tested with unit/component tests
- [Vitest](https://vitest.dev/) is used as the test runner
- [React-Testing-Library](https://testing-library.com/docs/react-testing-library/intro/) is used to render/test the components

## Database
- The database is a basic MySQL database
- Deployed as a docker container
- The database has two tables: `users` and `items`
  - Uses the users id as a foreign key to link the two tables
  - Users table has the following fields:
    - id (varchar)
    - name (varchar)
    - email (varchar)
    - password_hash (varchar)
    - created (timestamp)
    - updated (timestamp)
  - Items table has the following fields:
    - id (int)
    - title (varchar)
    - description (varchar)
    - image (varchar)
    - category (varchar)
    - price (varchar)
    - owner_id (varchar)
    - created (timestamp)
    - updated (timestamp)


## Server
- The server is created with Node and runs an Express server with CRUD endpoints for items and login and sign up endpoints for users
- Deployed as a docker container
- Some of the endpoints need an Authorization token to work
  - The token is provided in the login and sign up endpoints responses
  - Tokens are created using [JWT](https://www.npmjs.com/package/jsonwebtoken)
- User passwords are hashed using [bcrypt](https://www.npmjs.com/package/bcrypt)
- Users are given an id using [uuid](https://www.npmjs.com/package/uuid)
- Requests are validated with [joi](https://www.npmjs.com/package/joi)
- The database connections are handled with [mysql2](https://www.npmjs.com/package/mysql2)

### Server testing
- Server is tested with unit and integration tests
- Items endpoints are tested as integration tests
- Users endpoints are tested as unit tests, so connections to database are mocked
- [Jest](https://jestjs.io/) is used to run the tests
- In integration tests, tests run requests on the API using [SuperTest](https://www.npmjs.com/package/supertest)

### Server endpoints
- All the endpoints can be tested using the rest files in the [server folder](https://github.com/TiTe-5G00EV16-3003/2024-final-project-ArtoLaitinen/tree/main/server)
  - localhost.rest is used for local testing and server.rest is used to test the deployed server 
  #### User endpoints
  - Sign up
    - Usage: 
      ```
      POST /api/users/signup
      Content-Type: application/json

      {
        "name": "Tester",
        "email": "test@email.com",
        "password": "good_password"
      }
      ```
    - Output:
      ```
      {
        "id": "03a53840-b687-40ab-a79d-535b907c8fde",
        "name": "Tester",
        "email": "test@email.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAzYTUzODQwLWI2ODctNDBhYi1hNzlkLTUzNWI5MDdjOGZkZSIsImVtYWlsIjoidGVzdEBlbWFpbC5jb20iLCJpYXQiOjE3MTQzMTA5MTUsImV4cCI6MTcxNDMxNDUxNX0.F7rP648Sywiawxsem1cm06xskMe_0a_BGtmZAqI-htU"
      }
      ```

  - Login
    - Usage:
      ```
      POST /api/users/login
      Content-Type: application/json

      {
        "email": "test@email.com",
        "password": "good_password"
      }
      ```
    - Output:
      ```
      {
        "id": "03a53840-b687-40ab-a79d-535b907c8fde",
        "name": "Tester",
        "email": "test@email.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjAzYTUzODQwLWI2ODctNDBhYi1hNzlkLTUzNWI5MDdjOGZkZSIsImVtYWlsIjoidGVzdEBlbWFpbC5jb20iLCJpYXQiOjE3MTQzMTEyMDAsImV4cCI6MTcxNDMxNDgwMH0.pk9RELpyZKj9F8Kssjp644ZXY_lXriZHKWl4j2OTFmM"
      }
      ```
  #### Item endpoints
  - Get all items
    - Usage:
      ```
      GET /api/items
      ```
    - Output:
      ```
      [
        {
          "id": 2,
          "title": "FC Barcelona 10/11 shirt",
          "description": "Really nice shirt for collectors. The shirt has been kept in good condition and it has never been worn",
          "image": "https://thefootballheritage.com/wp-content/uploads/2023/10/cf304ccd.jpg",
          "category": "Sports",
          "price": "120",
          "owner_id": "6eb7a265-d3c1-4780-88cd-54ea3bc7ab59",
          "created": "2024-04-28T10:27:40.000Z",
          "updated": "2024-04-28T10:27:40.000Z",
          "user_name": "dev2",
          "user_email": "dev@gmail.com"
        },
        {
          "id": 1,
          "title": "Football",
          "description": "Upgrade your game with this reliable used football! Perfect for casual play or practice, this ball offers durability and a traditional feel. Grab this deal today and hit the field with confidence",
          "image": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Football_Pallo_valmiina-cropped.jpg",
          "category": "Sports",
          "price": "25",
          "owner_id": "2bfd3e62-6fd4-48bf-be7e-f694f880b10e",
          "created": "2024-04-28T10:27:40.000Z",
          "updated": "2024-04-28T10:27:40.000Z",
          "user_name": "dev1",
          "user_email": "dev@gmail.com"
        }
      ]
      ```
    
  - Get item by id
    - Usage:
      ```
      GET /api/items/:id
      ```
    - Output:
      ```
      {
        "id": 2,
        "title": "FC Barcelona 10/11 shirt",
        "description": "Really nice shirt for collectors. The shirt has been kept in good condition and it has never been worn",
        "image": "https://thefootballheritage.com/wp-content/uploads/2023/10/cf304ccd.jpg",
        "category": "Sports",
        "price": "120",
        "owner_id": "6eb7a265-d3c1-4780-88cd-54ea3bc7ab59",
        "created": "2024-04-28T10:27:40.000Z",
        "updated": "2024-04-28T10:27:40.000Z",
        "user_name": "dev2",
        "user_email": "dev@gmail.com"
      }
      ```
    
  - Get items by userId
    - Usage:
      ```
      GET /api/items/user/:userId
      Authorization: BEARER {{authToken}}
      ```
    - Output:
      ```
      [
        {
          "id": 4,
          "title": "PC",
          "description": "Very nice PC, the lights on it will improve your gaming ability x1000",
          "image": "https://www.trustedreviews.com/wp-content/uploads/sites/54/2023/01/AlphaSync-PBA-Diamond-Gaming-Desktop-PC-16.jpg",
          "category": "Electronics",
          "price": "824",
          "owner_id": "2bfd3e62-6fd4-48bf-be7e-f694f880b10e",
          "created": "2024-04-28T10:27:40.000Z",
          "updated": "2024-04-28T10:27:40.000Z",
          "user_name": "dev1",
          "user_email": "dev@gmail.com"
        },
        {
          "id": 3,
          "title": "Sofa",
          "description": "Just a basic sofa, dont need it anymore because I got a new one",
          "image": "https://live.staticflickr.com/4082/4822322673_c6edb296f2_b.jpg",
          "category": "Furniture",
          "price": "50",
          "owner_id": "2bfd3e62-6fd4-48bf-be7e-f694f880b10e",
          "created": "2024-04-28T10:27:40.000Z",
          "updated": "2024-04-28T10:27:40.000Z",
          "user_name": "dev1",
          "user_email": "dev@gmail.com"
        }
      ]
      ```
    
  - Post an item
    - Usage:
      ```
      POST /api/items
      Content-Type: application/json
      Authorization: BEARER {{authToken}}

      {
        "title": "test item 1",
        "description": "test item 1 description",
        "image": "image.jpg",
        "category": "test category",
        "price": "20",
        "owner_id": "2bfd3e62-6fd4-48bf-be7e-f694f880b10e"
      }
      ```
    - Output:
      ```
      {
        "id": 9,
        "title": "test item 1",
        "description": "test item 1 description",
        "image": "image.jpg",
        "category": "test category",
        "price": "20",
        "owner_id": "2bfd3e62-6fd4-48bf-be7e-f694f880b10e",
        "created": "2024-04-28T10:50:58.000Z",
        "updated": "2024-04-28T10:50:58.000Z",
        "user_name": "dev1",
        "user_email": "dev@gmail.com"
      }
      ```
    
  - Edit an item
    - Usage:
      ```
      PUT /api/items/:id
      Content-Type: application/json
      Authorization: BEARER {{authToken}}

      {
        "title": "new test item 1",
        "description": "new descrition",
        "image": "image.jpg",
        "category": "test category",
        "price": "20"
      }
      ```
    - Output:
      ```
      {
        "id": 1,
        "title": "new test item 1",
        "description": "new descrition",
        "image": "image.jpg",
        "category": "test category",
        "price": "20",
        "owner_id": "2bfd3e62-6fd4-48bf-be7e-f694f880b10e",
        "created": "2024-04-28T10:27:40.000Z",
        "updated": "2024-04-28T10:53:09.000Z",
        "user_name": "dev1",
        "user_email": "dev@gmail.com"
      }
      ```
    
  - Delete an item
    - Usage:
      ```
      DELETE /api/items/:id
      Authorization: BEARER {{authToken}}
      ```
    - Output:
      ```
      {
        "message": "Item deleted successfully"
      }
      ```


