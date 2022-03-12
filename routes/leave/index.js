const express = require("express");

const router = express.Router();

const Leave = require("../../controllers/leave/index");

router.post("/add-update-leave", Leave.addOrUpdateLeave);
router.post("/approve-reject", Leave.leaveApprovalOrRejection);
router.post("/leave-data", Leave.leaveDetails);
router.get("/all-leave", Leave.allLeave);

module.exports = router;
