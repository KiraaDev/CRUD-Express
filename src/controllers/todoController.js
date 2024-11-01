const TodoModel = require('../models/TodoModel')

exports.createTodo = async (req, res) => {
    const { title, body, dueDate } = req.body;
    const userId = req.user.userId;

    try {

        // checking due date if it is valid
        if (new Date(dueDate) < new Date()) {
            return res.status(400).json({ message: 'Due date invalid! must be in the future.' });
        }

        const newTodo = await TodoModel({ userId: userId, title: title, body: body, dueDate: dueDate })

        await newTodo.save();

        res.status(200).json({ message: "New todo added", newTodo });
    } catch (error) {
        res.status(400).json({ message: error });
    }
}

exports.getTodos = async (req, res) => {
    
}

exports.updateTodo = async (req, res) => {
    const { title, body, dueDate } = req.body;
    const { id } = req.params;
    const userId = req.user.userId;

    try {

        const existingTodo = await TodoModel.findById(id);

        if (!existingTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (existingTodo.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this todo' });
        }    


        if (new Date(dueDate) < new Date()) {
            return res.status(400).json({ message: 'Due date invalid! must be in the future.' });
        }

        if(title) existingTodo.title = title;
        if (body) existingTodo.body = body;
        if (dueDate) existingTodo.dueDate = dueDate;

        const updatedTodo = await existingTodo.save();

        res.status(200).json({ message: 'Todo updated successfully', updatedTodo });

    } catch (error) {
        res.status(400).json({ message: error });

    }
}

exports.deleteTodo = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;

    try {
        const todo = await TodoModel.findById(id);
        
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        if (todo.userId.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this todo' });
        }

        await TodoModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error("Error deleting todo:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
