import client from "../db/connet.js";

const managerPath = async (req,res) => {
    res.status(201).json({message: "welcome manager"})
}

export {managerPath};
