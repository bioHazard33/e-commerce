const express = require("express");
const logger = require("../config/logger/winston");
const router = express.Router();
const categoriesService = require('../services/categoriesService');

router.get('/',async (req,res)=>{
    let sort='category_id',page=1,limit=10;   // *Defaults
    
    let validSort=['category_id','name']
    try{
        if(req.query.sort && validSort.includes(req.query.sort))    sort=req.query .sort
        if(req.query.page && !parseInt(req.query.page)<=0)  page=parseInt(req.query.page)
        if(req.query.limit && !parseInt(req.query.limit)<=0)  limit=parseInt(req.query.limit)
    }
    catch(e){
        return res.status(400).send('Invalid Query Parameters')
    }

    const result = await categoriesService.getCategories(sort,page,limit);
    console.log(result);
    res.status(result.status).send({ data: result.data, error: result.error });
})

router.get('/:category_id',async (req,res)=>{
    let category_id;
    try{
        category_id=parseInt(req.params.category_id)
    }
    catch(e){
        logger.error(`Tried to get category ${req.params.category_id}`)
        return res.status(400).send({data:null,error:'Invalid Category Id'})
    }

    const result=await categoriesService.getCategoryById(category_id)
    console.log(result)
    res.status(result.status).send({ data: result.data, error: result.error });
})

router.get('/inDepartment/:department_id',async (req,res)=>{
    let department_id;
    try{
        department_id=parseInt(req.params.department_id)
    }
    catch(e){
        logger.error(`Tried to get categories in departments : ${req.params.department_id}`)
        return res.status(400).send({data:null,error:'Invalid Department Id'})
    }

    const result=await categoriesService.getCategoriesByDepartmentId(department_id)
    console.log(result)
    res.status(result.status).send({ data: result.data, error: result.error });
    
})

router.get('/inProduct/:product_id',async (req,res)=>{
    let product_id;
    try{
        product_id=parseInt(req.params.product_id)
    }
    catch(e){
        logger.error(`Tried to get category by a product : ${req.params.product_id}`)
        return res.status(400).send({data:null,error:'Invalid Product Id'})
    }

    const result=await categoriesService.getCategoryByProductId(product_id)
    console.log(result)
    res.status(result.status).send({ data: result.data, error: result.error })
})

module.exports = router;