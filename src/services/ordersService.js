const { to } = require("await-to-js");
const { OrdersModel, ProductOrdersModel ,ProductsModel } = require("../database/mysql/sequelize");
const { client } = require("../database/mysql/sequelize");
const logger = require("../config/logger/winston");
const cartService = require("../services/cartService");

// *Get producs and quantity from cart
// *Create order in orders table
// *Bulk create in the product order
// *Empty cart and product with orders

const ordersService = {
    createOrder: async (create_order,cart_id) => {
        let { transaction, err } = await startTransaction();
        if (err || !transaction) return transaction;

        let result = await cartService.getProductsInCart(cart_id);

        if(result.error){
            await transaction.rollback()
            return result;
        }
        else if (result.data == null) {
            await transaction.rollback()
            return { status: 500, data: null, error: `Error while placing your Order` };
        } else if (
            result.data.dataValues.products == undefined ||
            result.data.dataValues.products == null ||
            result.data.dataValues.products.length == 0
        ) {
            await transaction.rollback()
            logger.error(`No prducts in cart ${cart_id}`);
            return { status: 400, data: null, error: `No prducts in cart ${cart_id}` };
        }

        create_order['order_total'] = result.data.dataValues["cart_total"];

        let addedCartDetails =await addCartDetails(create_order, transaction);

        if(addedCartDetails.error){
            await transaction.rollback()
            return addedCartDetails
        }

        let products_details=await createProductArray(result,addedCartDetails.data.dataValues.order_id)
        result= await addProductsInOrders(products_details,transaction)

        if(result.error){
            await transaction.rollback()
            return result
        }

        result=await cartService.emptyCart(cart_id)
        if(result.error){
            await transaction.rollback()
            return result;
        }

        await transaction.commit()
        return {status:200,data:`Successfully created order from cart ID : ${cart_id}`,error:null};
    },

    getOrderDetails:async (order_id)=>{
        let [error,data]=await to(OrdersModel.findOne({
            where:{
                order_id
            },
            attributes:['order_id','address','city','postal_code','order_total'],
            include:{
                model:ProductsModel,
                attributes:['product_id','name','price'],
                as:'products',
                through:{
                    model: ProductOrdersModel,
                    attributes:['quantity']
                }
            }
        }))

        if (error) {
            logger.error(`While getting Order with ID : ${order_id}  , Error : ${error}`);
            return {
                status: 500,
                data: null,
                error: `Error in getting your Order with ID : ${order_id}`,
            };
        }

        if (data == null)
            return { status: 404, data: null, error: `No Order exists with ID : ${order_id}` };

        logger.info(`Successfully get Order with ID : ${order_id}`);
        return { status: 200, data, error: null };
    },
    
    getOrderShortDetails:async(order_id)=>{
        let [error,data]=await to(OrdersModel.findOne({
            where:{
                order_id
            },
            attributes:['order_id','address','city','postal_code','order_total']
        }))

        if (error) {
            logger.error(`While getting Order with ID : ${order_id}  , Error : ${error}`);
            return {
                status: 500,
                data: null,
                error: `Error in getting your Order with ID : ${order_id}`,
            };
        }

        if (data == null)
            return { status: 404, data: null, error: `No Order exists with ID : ${order_id}` };

        logger.info(`Successfully get Order with ID : ${order_id}`);
        return { status: 200, data, error: null };
    },

    getOrdersByCustomer:async (customer_id)=>{
        let [error,data]=await to(OrdersModel.findAll({
            where:{
                customer_id
            },
            attributes:['order_id','address','city','postal_code','order_total']
        }))

        if (error) {
            logger.error(`While getting Orders with Customer ID : ${customer_id}  , Error : ${error}`);
            return {
                status: 500,
                data: null,
                error: `Error in getting your Orders on Customer with ID : ${customer_id}`,
            };
        }

        if (data == null)
            return { status: 404, data: null, error: `No Order exists with on Customer ID : ${customer_id}` };

        logger.info(`Successfully get Orders on Customer with ID : ${customer_id}`);
        return { status: 200, data, error: null };
    }

};

createProductArray=async (result,order_id)=>{
    let products_details=[]
    result.data.dataValues.products.forEach(product => {
        let curr_product={
            order_id:order_id,
            product_id:product.dataValues.product_id,
            quantity:product.dataValues["CartWithProducts"].quantity
        }
        products_details.push(curr_product)
    });
    return products_details
}

addCartDetails = async (cart_details, transaction) => {
    let [error, data] = await to(OrdersModel.create(cart_details, { transaction: transaction }));
    if(error){
        logger.error(`Error while adding items to order table from cart : ${cart_details.cart_id}, error : ${error}`)
        return {status:500,data:null,error:`Error while adding items to order table from cart : ${cart_details.cart_id}`}
    }

    return {status:200,data:data,error:null}
};

addProductsInOrders=async(products_details,transaction)=>{
    let [error,data]= await to(ProductOrdersModel.bulkCreate(products_details,{transaction:transaction}))
    
    if(error){
        logger.error(`Error while inserting products to orders : ${products_details.cart_id} , error : ${error}`)
        return {status:500,data:null,error:`Error while inserting products to orders : ${products_details.cart_id}`}
    }
    logger.info(`Successfully added Products to orders in cart : ${products_details.cart_id}`)
    return {status:201,data,error};
}

startTransaction = async () => {
    let [err, transaction] = await to(client.transaction());
    if (err) {
        logger.error(`Cannot start Transaction`);
        return { status: 500, data: null, err: `Cannot start Transaction` };
    }
    return { transaction, err: null };
};

module.exports = ordersService;
