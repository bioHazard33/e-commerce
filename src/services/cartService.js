const logger = require("../config/logger/winston");
const { to } = require("await-to-js");
const { client } =require('../database/mysql/sequelize')
const { CartModel, CartWithProductsModel,ProductsModel } = require("../database/mysql/sequelize");

let globalTransaction;

const cartService = {
    generateUUID: async () => {
        let [error, data] = await to(CartModel.create());
        if (error) {
            logger.error(`Error while generating cart unique ID , ${error}`);
            return { status: 500, data: null, error: "Server Error" };
        }
        logger.info(`Successfully generated cart with ID : ${data.dataValues.cart_id}`);
        return { status: 201, data: { cart_id: data.dataValues.cart_id }, error: null };
    },

    addItemToCart: async (insert_object) => {
        let {transaction,err}=await startTransaction()
        if(err)   return transaction

        globalTransaction=transaction
        
        let [error, data] = await to(CartWithProductsModel.create(insert_object,{transaction:globalTransaction}));
        if (error) {
            logger.error(
                `Error while adding Product ${insert_object.product_id} to Cart ${insert_object.cart_id}, Error: ${error}`
            );
            if (error.parent.code === "ER_NO_REFERENCED_ROW_2") {
                return {
                    status: 400,
                    data: null,
                    error: `Cart with ID : ${insert_object.cart_id} or Product with ID ${insert_object.product_id} does not exists`,
                };
            }
            await globalTransaction.rollback()
            return { status: 500, data: null, error: "Server Error" };
        }

        result=await cartService.refreshPrice(insert_object.cart_id)

        if(result.error){
            await transaction.transaction.rollback();
            logger.error(result.error)
        }
        logger.info(
            `Successfully added Product ${insert_object.product_id} to Cart ${insert_object.cart_id}`
        );

        await transaction.transaction.commit()
        return { status: 201, data, error: null };
    },

    getProductsInCart:async(cart_id)=>{
        let [error,data] = await to(CartModel.findOne({
            where:{
                cart_id
            },
            attributes:['cart_id','cart_total'],
            include:{
                model:ProductsModel,
                attributes:['product_id','price'],
                as:'products',
                through:{
                    model:CartWithProductsModel,
                    attributes:['quantity']
                }
            }
        }))

        if(error){
            console.log(error)
            logger.error(`While getting products in cart with ID : ${cart_id}  , Error : ${error}`)
            return {status:500,data:null,error:`Error in getting your products in cart with ID : ${cart_id}`}
        }

        if(data==null)  return {status:404,data:null,error:`No cart exists with ID : ${cart_id}`}

        logger.info(`Successfully get products in Cart with ID : ${cart_id}`)
        return {status:200,data,error:null}
    },

    refreshPrice: async (cart_id) => {
        let cart_total=0;
        let result=await cartService.getProductsInCart(cart_id)

        console.log(result.data.dataValues.products)
        if(result.data.dataValues.products==undefined || result.data.dataValues.products==null || result.data.dataValues.products.length==0)    return cart_total;

        await result.data.dataValues.products.forEach(product => {
            let quantity=parseInt(product.dataValues['CartWithProducts'].quantity)
            let price=parseFloat(product.dataValues.price)

            cart_total+=quantity*price;
        });

        result=await cartService.updateCart(cart_id,{cart_total})
        return result
    },

    updateCart:async (cart_id,update_object)=>{
        let [error,data]=await to(CartModel.update(update_object,{
            where:{
                cart_id
            }
        },{
            transaction:globalTransaction
        }))
        if(error){
            logger.error(`Error while update cart with ID=${cart_id} , error : ${error}`)
            return {status:500,data:null,error:`Error while update cart with ID=${cart_id}`}
        }
        logger.info(`Successfully Update cart with ID=${cart_id}`)
        return {status:204,data:`Successfully Update cart with ID=${cart_id}`,error:null}
    }
};

startTransaction=async()=>{
    let [error,transaction]=await to(client.transaction())
    if(error){
        logger.error(`Cannot start Transaction`)
        return {status:500,data:null,error:`Cannot start Transaction`}
    }
    return {transaction,error:null}
}

module.exports = cartService;
