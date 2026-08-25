import bcrypt from "bcrypt";
import client from "../db/connect.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

//registration for user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = "employee" } = req.body;

    const checkQuery = `
    SELECT *
    FROM users
    WHERE email = $1;
    `;

    const result = await client.query(checkQuery, [email]);
    if (result.rows.length > 0) {
      return res.status(409).json({
        message: "Email already exists",
        result,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role;
    `;

    const newEmployee = await client.query(insertQuery, [
      name,
      email,
      hashedPassword,
      role,
    ]);

    const user = newEmployee.rows[0];
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    res.status(201).json({
      message: "User registered successfully",
      jwt: token,
      user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//login for user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const dbQuery = `SELECT * FROM USERS WHERE EMAIL=$1;`;
    const userFind = await client.query(dbQuery, [email]);
    if (userFind.rows.length === 0) {
      return res.status(409).json({ message: "user doesn't existed" });
    }
    console.log(userFind.rows[0]);
    const { role, id } = userFind.rows[0];
    const verifyPassword = await bcrypt.compare(
      password,
      userFind.rows[0].password,
    );
    if (!verifyPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }
    const userCredentials = {
      id: id,
      role: role,
    };
    console.log(userCredentials);
    const token = jwt.sign(userCredentials, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    return res
      .status(201)
      .json({ message: "Login success", jwt: token, user: userFind.rows[0] });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
