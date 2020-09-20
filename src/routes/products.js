const express = require("express");
const logger = require("../config/logger/winston");
const router = express.Router();
const productsService = require('../services/productsService')

router.get('/',async (req,res)=>{
    let page=1,limit=20,description_length=200;
    
    try{
        if(req.query.page && !parseInt(req.query.page)<=0)  page=parseInt(req.query.page)
        if(req.query.limit && !parseInt(req.query.limit)<=0)  limit=parseInt(req.query.limit)
    }
    catch(e){
        return res.status(400).send('Invalid Query Parameters')
    }

    const result=await productsService.getAllProducts(page,limit)
    res.status(result.status).send({data:result.data,error:result.error})
})

router.get('/:product_id',async (req,res)=>{
    let product_id;
    try{
        product_id=parseInt(req.params.product_id)
    }
    catch(e){
        logger.error(`Tried to get product ${req.params.product_id}`)
        return res.status(400).send({data:null,error:'Invalid Product Id'})
    }

    const result=await productsService.getProductById(product_id)
    console.log(result)
    res.status(result.status).send({ data: result.data, error: result.error });
})

router.get('/inCategory/:category_id',async (req,res)=>{
    let category_id;
    try{
        category_id=parseInt(req.params.category_id)
    }
    catch(e){
        logger.error(`Tried to get Products in Category : ${req.params.category_id}`)
        return res.status(400).send({data:null,error:'Invalid Categoty Id'})
    }

    const result=await productsService.getProducsByCategoryId(category_id)
    console.log(result)
    res.status(result.status).send({ data: result.data, error: result.error });
})

router.get('/inDepartment/:department_id',async (req,res)=>{
    let department_id;
    try{
        department_id=parseInt(req.params.department_id)
    }
    catch(e){
        logger.error(`Tried to get Products in departments : ${req.params.department_id}`)
        return res.status(400).send({data:null,error:'Invalid Categoty Id'})
    }

    const result=await productsService.getProducsByDepartmentId(department_id)
    console.log(result)
    res.status(result.status).send({ data: result.data, error: result.error });
})

module.exports=router