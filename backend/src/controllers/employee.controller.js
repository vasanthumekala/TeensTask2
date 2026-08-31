import client from "../db/connect.js";

const employeePath = async (res) => {
    try{
        const employeeQuery = `SELECT employee_id,name,email,phone FROM employees;`;
        const employeeResult = await client.query(employeeQuery);
        res.status(200).json({message: "Employee data retrieved", result: employeeResult.rows});
    } catch (error) {
        console.error("Employee path error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export {employeePath};
