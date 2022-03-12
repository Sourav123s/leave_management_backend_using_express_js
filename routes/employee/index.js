const { Router } = require("express");
const express = require("express");
const router = express.Router();

const Employee = require("../../controllers/employee/index");

router.post("/add-employee", Employee.addEmployee);

router.post("/signin", Employee.singIn);

router.post(
  "/employee-details",
  Employee.verifyjwtToken,
  Employee.employeeDetails
);

module.exports = router;
