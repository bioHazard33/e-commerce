const express = require("express");
const logger = require("../config/logger/winston");
const { getAllDepartments,getDepartmentsById } = require('../services/departmentsService')

const router = express.Router();

router.get('/',async(req,res)=>{
    const result=await getAllDepartments();
    res.status(result.status).send({data:result.data,error:result.error})
})

router.get('/:department_id',async(req,res)=>{
    let department_id;
    try{
        department_id=parseInt(req.params.department_id)
    }
    catch(e){
        logger.error(e)
        return res.status(400).send({data:null,error:'Invalid Parameters'})
    }

    const result=await getDepartmentsById(department_id)
    res.status(result.status).send({data:result.data,error:result.error})
})

module.exports=router