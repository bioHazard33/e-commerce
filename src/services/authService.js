const { CustomersModel } = require("../database/mysql/sequelize");
const { to } = require("await-to-js");
const logger = require("../config/logger/winston");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const authService={
     loginCustomer:async (customer) =>{
        let [error, data] = await to(
            CustomersModel.findOne({
                where: {
                    email:customer.email,
                },
                attributes:['customer_id','name','email','password']
            })
        );
        if (error) {
            logger.error(error);
            return { status: 500, data: null, error: "Database Error" };
        }

        if(data==null || data.length==0 )    return {status:404,data:null,error:'Account does not exists'}

        let [err,result]=await to(bcrypt.compare(customer.password,data.password))
        if(err){
            logger.error(`Got error while comparing password ${customer.password} and ${data.password}, error: ${err}`)
            return { status: 500, data: null, error: "Some error occurred" };
        }

        if(result===false)  return {status:404,data:null,error:'Email and password does not match'}
        try{
            delete data.dataValues["password"]
        }
        catch(e){
            logger.error(`While deleting password on customer with ID : ${data.customer_id}`)
        }
        const accessToken =await generateToken(data.customer_id)

        result={customer:data,accessToken,expiresIn:'12h'}
        
        logger.info(`Successfully logged in customer with email : ${result}`)
        return {status:200,data:result,error:null}
    },

    signUpCustomer: async (customer) => {
        let [err, hashedPassoword] = await to(bcrypt.hash(customer["password"], 5));

        if (!hashedPassoword) {
            logger.error("Error while generating password error : ", err);
            return { status: 500, data: null, error: "Error while generating password" };
        }

        customer["password"] = hashedPassoword;

        let [error, data] = await to(CustomersModel.create(customer));

        if (error) {
            logger.error(error);
            if (error.parent.code == "ER_DUP_ENTRY") {
                status = 400;
                error = "Email already exists";
            } else {
                status = 500;
                error = error.message;
            }
            return { status, data: null, error };
        }

        customer["customer_id"] = data.dataValues.customer_id;

        const accessToken =await generateToken(data.dataValues.customer_id)
        delete customer["password"];

        let createdCustomer = { customer, accessToken, expiresIn: "12h" };
        logger.info(`Created Customer : ${JSON.stringify(createdCustomer)}`);

        return { status: 201, data: createdCustomer, error: null };
    },
}

generateToken=async(customer_id)=>{
    const accessToken = jwt.sign(
        { customer_id },
        process.env.JWT_SECRET,
        {
            expiresIn: "12h",
        }
    );
    return accessToken
}

module.exports=authService