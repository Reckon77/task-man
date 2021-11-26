# Task-man

Task man is a REST api to keep track of your day to day task. Users can login to taskman and perform various operations such as:

1. Creating a task with "description" and "completed" information of the task.
2. Updating a task.
3. Deleting a task.
4. Setting up a user profile picture.

## Docs

### Create User/ Register

Registers a new user in the database and returns the user information, along with the web token.

| **Title**            | **Create User**                                                                                                                                                                                                                                                | **Login User**                                                                                                                                                                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **URL**              | `/users`                                                                                                                                                                                                                                                       | `/users/login`                                                                                                                                                                                                                                               |
| **Method**           | POST                                                                                                                                                                                                                                                           | POST                                                                                                                                                                                                                                                         |
| **URL Parameters**   | None                                                                                                                                                                                                                                                           | None                                                                                                                                                                                                                                                         |
| **Data Parameters**  | **Body:** `{ "name": "John Doe", "email": "johndoe@gmail.com", "age": 21, "password" : "newuser1289" }`                                                                                                                                                        | **Body:** `{ "email": "johndoe@gmail.com", "password" : "newuser1289" }`                                                                                                                                                                                     |
| **Success Response** | **Code:** 201 **Content:**` { "user": { "name": "John Doe", "email": "johndoe@gmail.com", "age": 21, "_id": "619fb34831490c08facc98d7", "createdAt": "2021-11-25T16:01:12.944Z", "updatedAt": "2021-11-25T16:01:13.105Z", "__v": 1 }, "token": "eyJhb..." }`   | **Code:** 200 **Content:** `{ "user": { "name": "John Doe", "email": "johndoe@gmail.com", "age": 21, "_id": "619fb34831490c08facc98d7", "createdAt": "2021-11-25T16:01:12.944Z", "updatedAt": "2021-11-25T16:01:13.105Z", "__v": 1 }, "token": "eyJhb..." }` |
| **Error Response**   | **Code:** 400                                                                                                                                                                                                                                                  | **Code:** 400                                                                                                                                                                                                                                                |
| **Sample Call**      | `const user = { name: 'John Doe', email: 'johndoe@gmail.com', age: 21, password : 'newuser1289' }; axios.post('https://{url}/users', user) .then((response) =>{ console.log(response) }) .catch((error) => { console.error('There was an error!', error); });` | `const user = { email: 'johndoe@gmail.com', password: 'newuser1289' }; axios.post('https://{url}/users/login', user) .then((response) =>{ console.log(response) }) .catch((error) => { console.error('There was an error!', error); });`                     |
