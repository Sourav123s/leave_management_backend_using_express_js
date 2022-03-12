const Employee = require("../../models/").employee;

const { hashPassword, verfiPassword } = require("../../services/password");

const jwt = require("jsonwebtoken");
const Designation = require("../../models").designations;

async function addEmployee(req, res) {
  try {
    const rb = req.body;
    let check_employee = await Employee.findOne({
      where: {
        email: rb.email,
      },
      attribute: ["id"],
    });
    if (check_employee) {
      res.json({
        success: false,
        message: "Emplyee is already exist created ",
      });
    }
    let password = await hashPassword(rb.password);

    let create = await Employee.create({
      emp_id: Math.random().toString(36).slice(2),
      name: rb.name,
      email: rb.email,
      mobile_no: rb.mobile_no,
      designation_id: rb.designation_id,
      no_of_sick_leaves: 5,
      no_of_casual_leaves: 12,
      password: password,
    });

    res.json({
      success: true,
      message: "Employee created successfully ",
      create,
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: 0,
      message: "Emplyee is not created ",
    });
  }
}

async function singIn(req, res) {
  try {
    const rb = req.body;
    let employee = await Employee.findOne({
      where: {
        email: rb.email,
      },
    });

    if (!employee) {
      return res.json({
        success: false,
        message: "Employee with this email not exists ",
      });
    }

    let hashPassword = employee.password;
    let checkPassword = verfiPassword(rb.password, hashPassword);

    if (checkPassword) {
      delete employee.dataValues.password;

      let token = jwt.sign(
        {
          id: employee.id,
          emp_id: employee.emp_id,
          name: employee.name,
          email: employee.email,
          mobile_no: employee.mobile_no,
          no_of_sick_leaves: employee.no_of_sick_leaves,
          no_of_casual_leaves: employee.no_of_casual_leaves,
          designation_id: employee.designation_id,
        },
        process.env.JWTSECRET,
        { expiresIn: "1h" }
      );
      return res.json({
        success: true,
        message: "sing In sucessfully",
        details: { employee, token },
      });
    } else {
      return res.json({
        success: false,
        message: "wrong password ",
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      success: 0,
      message: "Emplyee is not created ",
    });
  }
}

async function employeeDetails(req, res) {
  try {
    let id = req.body.id;
    let employee = await Employee.findOne({
      where: {
        id,
      },
      attributes: { exclude: ["created_at", "updated_at", "password"] },
      include: [
        {
          model: Designation,
        },
      ],
    });

    res.json({
      success: true,
      msg: "User feteched successfully",
      details: employee,
    });
  } catch (err) {
    console.log(err);
  }
}

function verifyjwtToken(req, res, next) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, process.env.JWTSECRET, (err, payload) => {
      if (err) {
        throw err;
      }
      req.user = payload;
      next();
    });
  } else {
    return res.status(401).send("Unauthorize");
  }
}

module.exports = {
  addEmployee,
  verifyjwtToken,
  singIn,
  employeeDetails,
};
