import client from "../db/connect.js";

const taskPath = async (req, res) => {
  try {
    const userId = req.user.id;
    const taskQuery = `SELECT task_name, description, status FROM tasks WHERE user_id = $1;`;
    const taskResult = await client.query(taskQuery, [userId]);
    res.status(200).json({ message: "Tasks retrieved", result: taskResult.rows });
  } catch (error) {
    console.error("Task path error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { taskPath };
