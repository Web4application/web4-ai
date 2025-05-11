const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.get("/", taskController.getTasks);
router.put("/priority/:id", taskController.updatePriority);

module.exports = router;
