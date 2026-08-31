import client from "../db/connect.js";

const adminPath = async (res) => {
    try {
        const adminQuery = `SELECT admin_id,name,email,phone FROM admins;`;
        const adminResult = await client.query(adminQuery);
        res.status(200).json({message: "Admin data retrieved", result: adminResult.rows});
    } catch (error) {
        console.error("Admin path error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export {adminPath};
