const jwt = require("jsonwebtoken");
const logger = require("../config/winston");

const auth = async (req, res, next) => {
    let payload;
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.log(error)
        logger.error('Error while Authenticating token');
        return res.status(404).send({ data: null, error: "Not Authenticated" });
    }
    
    req['customer_id'] = parseInt(payload['customer_id']);
    next();
};

module.exports=auth