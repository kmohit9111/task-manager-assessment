const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authenticate = require("../middleware/auth");
const { body } = require("express-validator");

// for protecting all routes
router.use(authenticate);

// GET /api/tasks
router.get("/", taskController.getTasks);

// POST /api/tasks
router.post(
  "/",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("dueDate").notEmpty().withMessage("Due date is required"),
    body("status").optional().isIn(["pending", "in-progress", "completed"]),
  ],
  taskController.createTask
);

// PUT /api/tasks/:id
router.put(
  "/:id",
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("dueDate").notEmpty().withMessage("Due date is required"),
    body("status").optional().isIn(["pending", "in-progress", "completed"]),
  ],
  taskController.updateTask
);

// DELETE /api/tasks/:id
router.delete("/:id", taskController.deleteTask);

module.exports = router;
