const express = require("express");
const cors = require('cors')
const cookieParser = require('cookie-parser');
const connectDb = require('./config/db');
const userCotroller = require("./controllers/userController");
const authenticateToken = require("./middleware/authToken");
const todoController = require("./controllers/todoController");

const app = express(express.json);
app.use(express.json())
app.use(cookieParser());
app.use(cors({
    credentials: true
})) 

app.get('/', (req, res) => {
    res.json({ message: 'This is my express app' });
})

app.get('/getUsers', authenticateToken, userCotroller.getAllUsers)

app.post('/createTodo', authenticateToken, todoController.createTodo);

app.patch('/todos/:id', authenticateToken, todoController.updateTodo)

app.delete('/delete/:id', authenticateToken, todoController.deleteTodo)

app.post('/register',userCotroller. registerUser);

app.post('/login', userCotroller.loginUser);

if(connectDb()) {
    app.listen(8080, () => {
        console.log('Server is now running on port 8080...');
    })
}