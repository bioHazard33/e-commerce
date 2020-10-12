const logger = require("../config/logger/winston");
const { to } = require("await-to-js");
const { client } = require("../database/mysql/sequelize");
const { CartModel, CartWithProductsModel, ProductsModel } = require("../database/mysql/sequelize");

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
        let { transaction, err } = await startTransaction();
        if (err) return transaction;

        let { status,data, error } = await findOrCreate(insert_object, transaction);

        if (error) {
            logger.error(error);
            await transaction.rollback();
            return { status, data, error };
        }

        if (data[1] === false) {
            insert_object["quantity"] += data[0]["quantity"];
            data[0]["quantity"] = insert_object["quantity"];
            let result = await cartService.updateCartWithProduct(insert_object, transaction);
            if (result.error) {
                await transaction.rollback();
                logger.error(result);
                return result;
            }
        } else {
            result = await cartService.refreshPrice(insert_object.cart_id, transaction);

            if (result.error) {
                await transaction.rollback();
                logger.error(result.error);
                return result;
            }
        }

        await transaction.commit();
        logger.info(
            `Successfully added Product ${insert_object.product_id} to Cart ${insert_object.cart_id}`
        );

        return { status: 201, data: data[0], error: null };
    },

    getProductsInCart: async (cart_id) => {
        let [error, data] = await to(
            CartModel.findOne({
                where: {
                    cart_id,
                },
                attributes: ["cart_id", "cart_total"],
                include: {
                    model: ProductsModel,
                    attributes: ["product_id",'name', "price"],
                    as: "products",
                    through: {
                        model: CartWithProductsModel,
                        attributes: ["quantity"],
                    },
                },
            })
        );

        if (error) {
            logger.error(`While getting products in cart with ID : ${cart_id}  , Error : ${error}`);
            return {
                status: 500,
                data: null,
                error: `Error in getting your products in cart with ID : ${cart_id}`,
            };
        }

        if (data == null)
            return { status: 404, data: null, error: `No cart exists with ID : ${cart_id}` };

        logger.info(`Successfully get products in Cart with ID : ${cart_id}`);
        return { status: 200, data, error: null };
    },

    refreshPrice: async (cart_id, transaction) => {
        logger.info(`Refresing price for Cart ID : ${cart_id}`);
        let cart_total = 0;
        let result = await cartService.getProductsInCart(cart_id);

        if (result.data == null) {
            return { status: 500, data: null, error: `Error while refresing Price` };
        } else if (
            result.data.dataValues.products == undefined ||
            result.data.dataValues.products == null ||
            result.data.dataValues.products.length == 0
        ) {
            cart_total = 0;
        } else {
            await result.data.dataValues.products.forEach((product) => {
                let quantity = parseInt(product.dataValues["CartWithProducts"].quantity);
                let price = parseFloat(product.dataValues.price);

                cart_total += quantity * price;
            });
        }

        result = await cartService.updateCart(cart_id, { cart_total }, transaction);
        return result;
    },

    updateCartWithProduct: async (update_object, transaction) => {
        if (transaction == null) {
            let { trans, err } = await startTransaction();
            if (err) return trans;
            transaction = trans;
        }

        let [error, data] = await to(
            CartWithProductsModel.update(
                {
                    quantity: update_object.quantity,
                },
                {
                    where: {
                        product_id: update_object.product_id,
                        cart_id: update_object.cart_id,
                    },
                    transaction: transaction,
                }
            )
        );

        if (error) {
            logger.error(
                `Error while update cart with ID=${update_object.cart_id} , error : ${error}`
            );
            return {
                status: 500,
                data: null,
                error: `Error while update cart with ID=${update_object.cart_id}`,
            };
        }
        if (data == 0) {
            logger.error(
                `Cart with ID : ${update_object.cart_id} or Product with ID ${update_object.product_id} does not exists`
            );
            return {
                status: 400,
                data: null,
                error: `Cart with ID : ${update_object.cart_id} or Product with ID ${update_object.product_id} does not exists`,
            };
        }
        logger.info(`Successfully Update CartWithProduct  with ID=${update_object.cart_id}`);

        let result = await cartService.refreshPrice(update_object.cart_id, transaction);
        if (result.error) {
            logger.error(result.error);
            return result;
        }
        return {
            status: 200,
            data: `Successfully Update CartWithProduct with ID=${update_object.cart_id}`,
            error: null,
        };
    },

    updateCart: async (cart_id, update_object, transaction) => {
        let [error, data] = await to(
            CartModel.update(update_object, {
                where: {
                    cart_id,
                },
                transaction: transaction,
            })
        );
        if (error || data === 0) {
            logger.error(`Error while update cart with ID=${cart_id} , error : ${error}`);
            return { status: 500, data: null, error: `Error while update cart with ID=${cart_id}` };
        }
        logger.info(`Successfully Update cart with ID=${cart_id}`);
        return { status: 200, data: `Successfully Update cart with ID=${cart_id}`, error: null };
    },

    emptyCart: async (cart_id) => {
        let { transaction, err } = await startTransaction();
        if (err) return transaction;

        let [error, data] = await to(
            CartWithProductsModel.destroy(
                {
                    where: {
                        cart_id,
                    },
                },
                {
                    transaction: transaction,
                }
            )
        );

        if (error) {
            await transaction.rollback();
            logger.error(`Error while emptying cart with ID=${cart_id} , error : ${error}`);
            return {
                status: 500,
                data: null,
                error: `Error while emptying cart with ID=${cart_id}`,
            };
        }

        const result = await cartService.updateCart(cart_id, { cart_total: 0 }, transaction);
        if (result.error) {
            await transaction.rollback();
        }

        await transaction.commit();
        return result;
    },

    getTotalAmount: async (cart_id) => {
        let [error, data] = await to(
            CartModel.findOne({
                where: {
                    cart_id,
                },
                attributes: ["cart_id", "cart_total"],
            })
        );

        if (data === null) {
            logger.info(`Carrt ID:${cart_id} does not exists`);
            return { status: 400, data: null, error: `Carrt ID:${cart_id} does not exists` };
        }
        if (error) {
            logger.error(`While getting total amount of cart ID : ${cart_id}`);
            return { status: 500, data: null, error: `Server Error` };
        }

        return { status: 200, data, error };
    },

    removeProduct: async (delete_object) => {
        let { transaction, err } = await startTransaction();
        if (err) return transaction;

        let [error, data] = await to(
            CartWithProductsModel.destroy(
                {
                    where: {
                        cart_id: delete_object.cart_id,
                        product_id: delete_object.product_id,
                    },
                },
                {
                    transaction: transaction,
                }
            )
        );

        if (data === null) {
            await transaction.rollback();
            logger.info(
                `Product with ID: ${delete_object.product_id} does not exists on Cart with ID: ${delete_object.cart_id}`
            );
            return {
                status: 400,
                data: null,
                error: `Product with ID: ${delete_object.product_id} does not exists on Cart with ID: ${delete_object.cart_id}`,
            };
        }

        if (error) {
            await transaction.rollback();
            logger.error(`Error while deleting Product ${delete_object.product_id}`, error);
            return {
                status: 500,
                data: null,
                error: `Error while deleting Product ${delete_object.product_id}`,
            };
        }

        let result = await cartService.refreshPrice(delete_object.cart_id, transaction);

        if (result.error) {
            await transaction.rollback();
            logger.error(result.error);
            return result;
        }

        await transaction.commit();
        logger.info(
            `Successfully Deleted Product ${delete_object.product_id} from Cart ${delete_object.cart_id}`
        );

        return {
            status: 200,
            data: `Successfully Deleted Product ${delete_object.product_id} from Cart ${delete_object.cart_id}`,
            error: null,
        };
    },

    deleteCart:async(cart_id)=>{
        let {error,data}=await to(CartModel.destroy(
            {
                where:{
                    cart_id
                }
            }
        ))

        if(error){
            logger.error(`While deleting cart ${cart_id}`);
            return {status:500,data:null,error:`Server Error`}
        }

        logger.info(`Successfully deleted cart ${cart_id}`)
        return {status:200,data:`Successfully deleted cart ${cart_id}` ,error:null}
    }
};

startTransaction = async () => {
    let [err, transaction] = await to(client.transaction());
    if (err) {
        logger.error(`Cannot start Transaction`);
        return { status: 500, data: null, err: `Cannot start Transaction` };
    }
    return { transaction, err: null };
};

findOrCreate = async (insert_object, transaction) => {
    let [error, data] = await to(
        CartWithProductsModel.findOrCreate({
            where: {
                cart_id: insert_object.cart_id,
                product_id: insert_object.product_id,
            },
            defaults: insert_object,
            options: { transaction },
        })
    );
    if (error) {
        logger.error(
            `Error while adding Product ${insert_object.product_id} to Cart ${insert_object.cart_id}, Error: ${error}`
        );
        if (error.parent && error.parent.code === "ER_NO_REFERENCED_ROW_2") {
            return {
                status: 400,
                data: null,
                error: `Cart with ID : ${insert_object.cart_id} or Product with ID ${insert_object.product_id} does not exists`,
            };
        }
        return {status:500 , data: null, error: "Server Error" };
    }
    return { status:201 ,data, error };
};

module.exports = cartService;
