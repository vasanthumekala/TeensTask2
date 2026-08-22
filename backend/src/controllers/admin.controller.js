
import client from "../db/connet.js";

const adminPath = async (req,res) => {
    res.status(201).json({message: "welcome admin"})
}

export {adminPath};