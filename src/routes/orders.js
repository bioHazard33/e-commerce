const express = require("express");
const { to } = require("await-to-js");
const auth=require('../middleware/auth')
const logger=require('../config/logger/winston')
const cartValidation=require('../config/validations/cartValidation')
const customerService=require('../services/customersService')
const orderService=require('../services/ordersService.js');
const orderValidation = require("../config/validations/orderValidation");

const router = express.Router();

router.post('/',auth,async (req,res)=>{
    let result=await customerService.getCustomerAddressDetails(req['customer_id'])
    if(result.error){
        return res.status(result.status).send({data:result.data,error:result.error})
    }

    let address=result.data.dataValues
    if(address.address == null || address.city==null || address.postal_code==null){
        return res.status(500).send({data:null,error:'Please Update your address first'})
    }

    let create_order={
        customer_id:req['customer_id'],
        ...address,
    }

    let {error,value}=cartValidation.cartIdValidation.validate({cart_id:req.body.cart_id})
    if(error){
        logger.error(`Got ${create_order} for creating an order`)
        return res.status(400).send({ data: null, error: error.details[0].message });
    }

    result=await orderService.createOrder(create_order,req.body.cart_id)
    res.status(result.status).send({data:result.data,error:result.error})
})

router.get('/inCustomer',auth,async (req,res)=>{
    const result=await orderService.getOrdersByCustomer(req['customer_id'])
    return res.status(result.status).send({data:result.data,error:result.error})
})

router.get('/shortDetails/:order_id',async (req,res)=>{
    let {error,value}=orderValidation.orderIdValidation.validate({order_id:req.params.order_id})
    if(error){
        logger.error(`Got ${req.params.order_id} for getting an order's short details`)
        return res.status(400).send({ data: null, error: error.details[0].message });
    }

    const result=await orderService.getOrderShortDetails(value.order_id)
    return res.status(result.status).send({data:result.data,error:result.error}) 
})

router.get('/:order_id',auth,async (req,res)=>{
    let {error,value}=orderValidation.orderIdValidation.validate({order_id:req.params.order_id})
    if(error){
        logger.error(`Got ${req.params.order_id} for getting an order`)
        return res.status(400).send({ data: null, error: error.details[0].message });
    }

    const result=await orderService.getOrderDetails(value.order_id)
    return res.status(result.status).send({data:result.data,error:result.error})
})



module.exports=router