const express = require("express");
const logger = require("../config/logger/winston");
const router = express.Router();
const { getAllProducts,getProductById } = require('../services/productsService')

router.get('/',async (req,res)=>{
    let page=1,limit=20,description_length=200;
    
    try{
        if(req.query.page && !parseInt(req.query.page)<=0)  page=parseInt(req.query.page)
        if(req.query.limit && !parseInt(req.query.limit)<=0)  limit=parseInt(req.query.limit)
    }
    catch(e){
        return res.status(400).send('Invalid Query Parameters')
    }

    const result=await getAllProducts(page,limit)
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

    const result=await getProductById(product_id)
    console.log(result)
    res.status(result.status).send({ data: result.data, error: result.error });
})

module.exports=router