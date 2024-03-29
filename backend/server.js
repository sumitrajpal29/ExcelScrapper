const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const mongoose = require("mongoose");
const cors = require("cors");
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
const { BrowserRouter, Switch, Route } = require("react-router-dom");

const app = express();
const port = 8000;

// Defining storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

// Creating multer instance
const upload = multer({ storage });

// Enable CORS
app.use(cors());
app.use(express.json());

// MongoDb connection
mongoose.connect("mongodb://localhost:27017/cogniDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Schema to be changed accoring excel
const empSchema = new mongoose.Schema({
  empId: Number,
  name: String,
  grade: String,
  billability: String,
  isOnsite: String,
  projectId: Number,
  projectName: String,
  managerName: String,
  availableHours: Number,
  billedHours: Number,
  utilizationPercentage: Number,
  utilizationRange: String,
  billedFTE: Number,
  totalFTE: Number,
  unbilledFTE: Number, //(totalFTE - billedFTE)
});

const Employee = mongoose.model("Employee", empSchema);

const Trash = mongoose.model("Trash", empSchema);

// Define route for uploading Excel file
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Read Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Insert data to MongoDB
    const result = await Employee.insertMany(sheetData);

    res.send("File uploaded successfully. Result = " + result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/uploadSingle", async (req, res) => {
  try {
    const item = req.body;

    const isAdded = await Employee.create(item);
    res.send("This is added to Employee" + isAdded);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// Define route for fetching filtered data
app.get("/get", async (req, res) => {
  try {
    const { filters, sortValue } = req.query;

    const employees = await Employee.find(filters).sort(sortValue);

    res.json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/getOffCount/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const result = await Employee.find({
      billability: code,
      isOnsite: "false",
    }).count();
    //console.log("Line 122", result);
    res.status(200).json({ success: true, result: result });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/getOnCount/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const result = await Employee.find({
      billability: code,
      isOnsite: "true",
    }).count();

    res.status(200).json({ success: true, result: result });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/getFilteredData/:code/:onsite", async (req, res) => {
  try {
    const { code, onsite } = req.params;
    const result = await Employee.find({
      billability: code,
      isOnsite: onsite,
    }).sort({ managerName: 1, grade: 1 });
    //console.log("line 146", result);

    res.status(200).json({ success: true, result: result });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const trashData = await Employee.findOne({ _id: id });
    await Trash.insertMany(trashData);
    await Employee.deleteOne({ _id: id }).then(
      res.send("Deleted Successfully")
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/trash/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Trash.deleteOne({ _id: id }).then(res.send("Permanently deleted."));
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/trash", async (req, res) => {
  try {
    const trashes = await Trash.find();
    res.json(trashes);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { empId, name, projectId, grade, billability } = req.body;

    const updatedEmployee = await Employee.findOneAndUpdate(
      { empId: id },
      { empId, name, projectId, grade, billability },
      { new: true }
    );

    res.json(updatedEmployee);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
