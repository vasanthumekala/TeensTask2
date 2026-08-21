import bcrypt from "bcrypt";
import client from "../db/connet.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password,role="employee" } = req.body;

    const checkQuery = `
    SELECT *
    FROM users
    WHERE email = $1;
    `;

    const result = await client.query(checkQuery, [email]);
    console.log(result)
    if (result.rows.length > 0) {
      return res.status(409).json({
        message: "Email already exists",result
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertQuery = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4);
    `;

    const newEmployee = await client.query(insertQuery, [name, email, hashedPassword,role]);

    res.status(201).json({
      message: "User registered successfully",
      result
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req,res) => {
  // const {email,password} = req.body();

  // try{
  //   const dbQuery = `SELECT * FROM USERS WHERE EMAIL=$1;`
  // }
}
