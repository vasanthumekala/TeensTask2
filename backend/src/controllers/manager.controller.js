import client from "../db/connect.js";

const managerPath = async (req,res) => {
    try {
        const managerQuery = `SELECT manager_id,name,email,phone FROM managers;`;
        const managerResult = await client.query(managerQuery);
        res.status(200).json({message: "Manager data retrieved", result: managerResult.rows});
    } catch (error) {
        console.error("Manager path error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export {managerPath};
