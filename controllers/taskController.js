const db = require("../config/db");
const { validationResult } = require("express-validator");

// get all tasks for logged in user
exports.getTasks = (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      message: "You are not authenticated to access the task manager",
    });
  }

  const userId = req.user.id;
  const { status, page = 1, limit = 10 } = req.query; //for pagination and filtering with status, bonus work

  const offset = (parseInt(page) - 1) * parseInt(limit);
  let sql = "SELECT * FROM tasks WHERE userId = ?";
  const params = [userId];

  if (status) {
    sql += " AND status = ?";
    params.push(status);
  }

  sql += " LIMIT ? OFFSET ?";
  params.push(parseInt(limit), offset);

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });

    res.status(200).json({
      page: parseInt(page),
      limit: parseInt(limit),
      tasks: results,
    });
  });
};

// create a new task
exports.createTask = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { title, description, status, dueDate } = req.body;
  const userId = req.user.id;

  const sql =
    "INSERT INTO tasks (title, description, status, dueDate, userId) VALUES (?, ?, ?, ?, ?)";
  db.query(
    sql,
    [title, description, status || "pending", dueDate, userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Task creation failed" });

      res.status(201).json({
        message: "Task created successfully",
        taskId: result.insertId,
      });
    }
  );
};

// update a task which only belongs to user
exports.updateTask = (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;
  const { title, description, status, dueDate } = req.body;

  const sql = `
    UPDATE tasks
    SET title = ?, description = ?, status = ?, dueDate = ?
    WHERE id = ? AND userId = ?
  `;

  db.query(
    sql,
    [title, description, status, dueDate, taskId, userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Update failed" });

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Task not found or unauthorized" });
      }

      res.status(200).json({ message: "Task updated successfully" });
    }
  );
};

// delete a task which only belongs to user
exports.deleteTask = (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.id;

  db.query(
    "DELETE FROM tasks WHERE id = ? AND userId = ?",
    [taskId, userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Delete failed" });

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Task not found or unauthorized" });
      }

      res.status(200).json({ message: "Task deleted successfully" });
    }
  );
};
