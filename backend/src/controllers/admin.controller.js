import client from "../db/connet.js";

const adminPath = async (req,res) => {
    try {
        const adminQuery = `SELECT * FROM admins;`;
        const adminResult = await client.query(adminQuery);
        res.status(200).json({message: "Admin data retrieved", result: adminResult.rows});
    } catch (error) {
        console.error("Admin path error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export {adminPath};