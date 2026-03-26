const db = require("../config/db");

// SELECT
exports.getUsers = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM USER");
  console.log("GET USERS:", rows);
  res.json(rows);
};

// INSERT
exports.createUser = async (req, res) => {
  const { email, username } = req.body;

  const [result] = await db.query(
    "INSERT INTO USER (email, username) VALUES (?, ?)",
    [email, username]
  );

  console.log("USER CREATED:", result);

  res.json({
    message: "User created",
    insertId: result.insertId
  });
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { display_name } = req.body;

  const [result] = await db.query(
    "UPDATE USER SET display_name = ? WHERE id = ?",
    [display_name, id]
  );

  console.log("USER UPDATED:", result);

  res.json({
    message: "User updated",
    affectedRows: result.affectedRows
  });
};

// DELETE
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  const [result] = await db.query(
    "DELETE FROM USER WHERE id = ?", [id]
  );

  console.log("USER DELETED:", result);

  res.json({
    message: "User deleted",
    affectedRows: result.affectedRows
  });
};