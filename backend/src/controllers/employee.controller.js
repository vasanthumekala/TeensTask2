import client from "../db/connet.js";

const employeePath = async (req,res) => {
    res.status(201).json({message: "welcome employee"})
}

export {employeePath};
