const express = require('express');
const employees = require('./employees.js');

const app = express();

app.use(express.static('dist'));

// Endpoint to respond with a greeting
app.get('/', (req, res) => {
    res.send("Hello employees!");
});

// Endpoint to get the list of all employees
app.get('/employees', (req, res) => {
    res.json(employees);
});

// Endpoint to get an employee by ID
app.get('/employees/:id', (req, res) => {
    const employeeId = parseInt(req.params.id);
    const employee = employees.find(emp => emp.id === employeeId);
    
    if (employee) {
        res.json(employee);
    } else {
        res.status(404).send('Employee not found');
    }
});

// Endpoint to get a random employee
app.get('/employees/random', (req, res) => {
    const randomIndex = Math.floor(Math.random() * employees.length);
    const randomEmployee = employees[randomIndex];
    res.json(randomEmployee);
});

// Endpoint to add a new employee
app.post('/employees', (req, res) => {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Invalid employee name' });
    }
    
    const newEmployee = {
        id: employees.length ? Math.max(...employees.map(emp => emp.id)) + 1 : 1,
        name: name.trim()
    };
    
    employees.push(newEmployee);
    res.status(201).json(newEmployee);
});

// Error-handling middleware
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});