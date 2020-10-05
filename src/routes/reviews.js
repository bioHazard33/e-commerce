const { Router } = require("express");
const express = require("express");
const logger = require("../config/logger/winston");
const auth = require("../middleware/auth");
const reviewsValidation = require("../config/validations/reviewsValidation");
const reviewsService = require("../services/reviewsService");

const router = express.Router();

router.get("/:product_id", async (req, res) => {
    let { error, value } = reviewsValidation.productIdValidation.validate({
        product_id: req.params.product_id,
    });
    if (error) {
        logger.error(`Got ${req.params.product_id} for getting reviews for a product`);
        res.status(400).send({ data: null, error: error.details[0].message });
    }

    const result = await reviewsService.getReviews(value.product_id)

    res.status(result.status).send({ data: result.data, error: result.error });
});

router.post("/add", auth, async (req, res) => {
    let { error, value } = reviewsValidation.addValidation.validate(req.body);
    if (error) {
        logger.error(`Got ${req.body} for adding a review`);
        res.status(400).send({ data: null, error: error.details[0].message });
    }

    const result = await reviewsService.addReview({ ...value, customer_id: req["customer_id"] });

    res.status(result.status).send({ data: result.data, error: result.error });
});

router.put('/update',auth,async (req,res)=>{
    let {error,value}=reviewsValidation.updateValidation.validate(req.body)
    if(error){
        logger.error(`Got ${req.body} for updating a review`);
        res.status(400).send({ data: null, error: error.details[0].message });
    }

    const result = await reviewsService.updateReview(value.review_id,req['customer_id'],value.product_id,{rating:value.rating,review:value.review});

    res.status(result.status).send({ data: result.data, error: result.error });
})

router.delete('/delete/:review_id',auth,async(req,res)=>{
    let {error,value}=reviewsValidation.deleteValidation.validate({review_id:req.params.review_id})
    if(error){
        logger.error(`Got ${req.params.review_id} for delting  a review`);
        res.status(400).send({ data: null, error: error.details[0].message });
    }

    const result = await reviewsService.deleteReview(value.review_id,req['customer_id']);

    res.status(result.status).send({ data: result.data, error: result.error });
})

module.exports = router;
