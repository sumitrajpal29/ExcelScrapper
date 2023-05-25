const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 8000;

// Defining storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`);
    }
});

// Creating multer instance
const upload = multer({ storage });

// Enable CORS
app.use(cors());

// MongoDb connection
mongoose.connect('mongodb://localhost:27017/cogniDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const empSchema = new mongoose.Schema({
    empId: Number,
    name: String,
    projectId: Number,
    grade: String,
    billability: String
});

const Employee = mongoose.model('Employee', empSchema);





// Define route for uploading Excel file
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        // Read Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Insert data to MongoDB
        const result = await Employee.insertMany(sheetData);

        res.send('File uploaded successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Define route for fetching filtered data
app.get('/get', async (req, res) => {
    try {
        const { projectId, billability, grade } = req.query;

        const filters = {};

        if (projectId) {
            filters.projectId = projectId;
        }

        if (billability) {
            filters.billability = billability;
        }

        if (grade) {
            filters.grade = grade;
        }

        const employees = await Employee.find(filters);

        res.json(employees);
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

app.delete('/delete:id', async (req, res, next) => {
    try {
        console.log("Working!");
    } catch {
        console.log("some error in BackEnd");
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
