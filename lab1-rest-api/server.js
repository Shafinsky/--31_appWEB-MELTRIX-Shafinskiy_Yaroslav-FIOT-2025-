const express = require("express");
const app = express();

app.use(express.json());

// Тимчасова "база даних"
let students = [
    { id: 1, name: "Ivan", group: "A1" },
    { id: 2, name: "Maria", group: "B2" }
];

// Головний маршрут
app.get("/", (req, res) => {
    res.send("Hello from Node.js server");
});


// Завдання 3
// GET /students – отримати список студентів
app.get("/students", (req, res) => {
    res.json(students);
});


// Завдання 4
// POST /students – додати студента
app.post("/students", (req, res) => {
    const { id, name, group } = req.body;

    const newStudent = { id, name, group };
    students.push(newStudent);

    res.status(201).json(newStudent);
});


// Завдання 5
// PUT /students/:id – оновити студента
app.put("/students/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { name, group } = req.body;

    const student = students.find(s => s.id === id);

    if (!student) {
        return res.status(404).send("Student not found");
    }

    student.name = name || student.name;
    student.group = group || student.group;

    res.json(student);
});


// DELETE /students/:id – видалити студента
app.delete("/students/:id", (req, res) => {
    const id = parseInt(req.params.id);

    students = students.filter(s => s.id !== id);

    res.send("Student deleted");
});


app.listen(3000, () => {
    console.log("Server started on port 3000");
});