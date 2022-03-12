const Leave = require("../../models").leaves;

const LeaveStatus = require("../../models").all_leave_statuses;

const Employee = require("../../models").employee;
const Designation = require("../../models").designations;
const e = require("express");
// const leaves = require("../../models/leaves");

async function addOrUpdateLeave(req, res) {
  try {
    const rb = req.body;
    let msg = rb.id
      ? "Leave updated sucessfully "
      : "Leave applied sucessfully";

    if (rb.id) {
      if (rb.leave_status === "approved" || rb.leave_status === "Rejected") {
        return res.json({
          success: true,
          msg: "Leave is already " + rb.leave_status,
        });
      }

      await Leave.update(
        {
          user_id: rb.user_id,
          designation_id: rb.designation_id,
          from_date: rb.from_date,
          to_date: rb.to_date,
          type_of_day: rb.type_of_day,
          leave_type: rb.leave_type,
          reason: rb.reason,
          leave_status: rb.leave_status,
          work_resume: rb.work_resume,
        },
        {
          where: {
            id: rb.id,
          },
        }
      );

      let leave = await Leave.findOne({
        where: {
          id: rb.id,
        },
      });
      // checking
      return res.json({
        success: false,
        msg: leave,
      });
    } else {
      await Leave.create({
        user_id: rb.user_id,
        designation_id: rb.designation_id,
        from_date: rb.from_date,
        to_date: rb.to_date,
        type_of_day: rb.type_of_day,
        leave_type: rb.leave_type,
        reason: rb.reason,
        leave_status: "Pending",
        leave_apply_date: new Date(),
        work_resume: rb.work_resume,
      });

      const empDetails = await Employee.findOne({
        where: {
          id: rb.user_id,
        },
        attributes: { exclude: ["created_at", "updated_at", "password"] },
      });

      await Employee.update(
        {
          no_of_sick_leaves:
            rb.leave_type == "sick"
              ? rb.type_of_day == "full"
                ? empDetails.no_of_sick_leaves - 1
                : empDetails.no_of_sick_leaves - 0.5
              : empDetails.no_of_sick_leaves,
          no_of_casual_leaves:
            rb.leave_type == "casual"
              ? rb.type_of_day == "full"
                ? empDetails.no_of_casual_leaves - 1
                : empDetails.no_of_casual_leaves - 0.5
              : empDetails.no_of_casual_leaves,
        },
        {
          where: {
            id: rb.user_id,
          },
        }
      );
    }
    const empDetails = await Employee.findOne({
      where: {
        id: rb.user_id,
      },
      attributes: { exclude: ["created_at", "updated_at", "password"] },
    });

    res.json({
      success: true,
      msg,
      emp: empDetails,
    });
  } catch (err) {
    console.log(err);
  }
}

async function leaveDetails(req, res) {
  try {
    let leave = await Leave.findAll({
      where: {
        user_id: req.body.user_id,
      },
      include: [
        {
          model: LeaveStatus,
        },
      ],
    });
    if (leave.length == 0) {
      return res.json({
        success: true,
        msg: " No Leave Taken ",
      });
    }
    res.json({
      success: true,
      msg: "leave taken ",
      details: leave,
    });
  } catch (err) {
    console.log(err);
  }
}

async function leaveApprovalOrRejection(req, res) {
  const rb = req.body;

  let userDesignation = await Designation.findOne({
    where: {
      id: rb.designation_id,
    },
  });

  if (
    userDesignation.name === "HR" ||
    userDesignation.name === "Admin" ||
    userDesignation.name === "Project Manager"
  ) {
    let checkLeave = await Leave.findOne({
      where: {
        id: rb.leave_id,
      },
    });

    await Leave.update(
      {
        leave_status: rb.leave_status,
        approved_date: new Date(),
      },
      {
        where: { id: rb.leave_id },
      }
    );

    await LeaveStatus.create({
      leave_id: rb.leave_id,
      approved_or_rejected_by: rb.user_id,
      approve_or_rejected_date: new Date(),
      leave_status: rb.leave_status,
    });

    if (rb.leave_status == "Rejected") {
      let employee = await Employee.findOne({
        where: {
          id: checkLeave.user_id,
        },
        attributes: { exclude: ["created_at", "updated_at", "password"] },
      });

      await employee.update(
        {
          no_of_sick_leaves:
            checkLeave.leave_type == "sick"
              ? checkLeave.type_of_day == "full"
                ? parseFloat(employee.no_of_sick_leaves) + 1
                : parseFloat(employee.no_of_sick_leaves) + 0.5
              : employee.no_of_sick_leaves,
          no_of_casual_leaves:
            checkLeave.leave_type == "casual"
              ? checkLeave.type_of_day == "full"
                ? parseFloat(employee.no_of_casual_leaves) + 1
                : parseFloat(employee.no_of_casual_leaves) + 0.5
              : employee.no_of_casual_leaves,
        },
        {
          where: { id: employee.id },
        }
      );
    }

    let status =
      rb.leave_status.charAt(0).toLowerCase() + rb.leave_status.slice(1);

    res.json({
      success: true,
      msg: `leave ${status}`,
    });
  } else {
    return res.json({
      success: false,
      msg: "Only admin, HR, Project Manager can change leave status",
    });
  }
}

async function allLeave(req, res) {
  let leave = await Leave.findAll();

  return res.json({
    success: true,
    msg: leave,
  });
}

module.exports = {
  addOrUpdateLeave,
  leaveDetails,
  leaveApprovalOrRejection,
  allLeave,
};
