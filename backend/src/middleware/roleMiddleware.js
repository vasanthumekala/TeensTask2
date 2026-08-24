const authorization = (...allowedRoles) =>{
    return (req,res,next) => {
        console.log(allowedRoles)
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({message: `${req.user.role} cant't access this resource`})
        }
        next();
    }
}

export {authorization};
