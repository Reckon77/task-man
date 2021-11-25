# Task-man

Task man is a REST api to keep track of your day to day task. Users can login to taskman and perform various operations such as:

1. Creating a task with "description" and "completed" information of the task.
2. Updating a task.
3. Deleting a task.
4. Setting up a user profile picture.

## Docs

### Create User/ Register

Registers a new user in the database and returns the user information, along with the web token.

```markdown
| **Title**  | **Create User** |
| ---------- | --------------- |
| **URL**    | `/users`        |
| **Method** | **POST**        |
```
