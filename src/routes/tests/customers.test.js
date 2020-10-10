const request=require('supertest')
const bcrypt = require('bcrypt')
const jwt=require('jsonwebtoken')

const { CustomersModel } = require("../../database/mysql/sequelize");
const app=require('../../app')

let accessToken="";

const customerOne={
    customer_id:1,
    name:'myname',
    email:'myemail@gmail.com',
    password:'mypassword',
    accessToken:jwt.sign(
        { customer_id : 1 },
        process.env.JWT_SECRET,
        {
            expiresIn: "12h",
        }
    )
}

beforeAll(async ()=>{
    await CustomersModel.destroy({where:{}})
    await CustomersModel.create({
        customer_id:customerOne.customer_id,
        name:customerOne.name,
        email:customerOne.email,
        password:await bcrypt.hash(customerOne.password,5)
    })
})

// * Actual Tests

test('Should signup a customer',async ()=>{
    const response = await request(app).post('/customers/').send({
        name:'mynewname',
        email:'mynewemail@gmail.com',
        password:'mynewpassword'
    }).expect(201)

    const customer=await CustomersModel.findOne({ where : { 'customer_id' : response.body.data.customer.customer_id } })

    expect(customer).not.toBeNull()

    expect(response.body.data).toHaveProperty('customer')
    expect(response.body.data).toHaveProperty('accessToken')
})

test('Should login successfully', async ()=>{
    const response = await request(app).post('/customers/login/').send({
        'email':customerOne.email,
        'password':customerOne.password
    }).expect(200)

    accessToken=response.body.data.accessToken
    expect(response.body.data).toHaveProperty('customer')
    expect(response.body.data).toHaveProperty('accessToken')
})

test('Should not login successfully (Wrong Password)',async ()=>{
    const response = await request(app).post('/customers/login/').send({
        'email':customerOne.email,
        'password':customerOne.password+'1'
    }).expect(404)

    expect(response.body.data).toBe(null)
})

test('Should not login successfully (Not existing email)',async ()=>{
    const response = await request(app).post('/customers/login/').send({
        'email':customerOne.email+'1',
        'password':customerOne.password
    }).expect(400)

    expect(response.body.data).toBe(null)
})

test('Should update customer details',async ()=>{
    await request(app)
    .put('/customers/')
    .set('Authorization',`Bearer ${customerOne.accessToken}`)
    .send({name:'mynameupdated',email:'updatedmail@asd.com',password:'updatedPassword'})
    .expect(200)
})

test('Should not update customer details',async ()=>{
    await request(app)
    .put('/customers/')
    .set('Authorization',`Bearer ${'NOT_A_JWT_TOKEN'}`)
    .send({name:'mynameupdated',email:'updatedmail@asd.com',password:'updatedPassword'})
    .expect(404)
})

test('Should update credit card details',async ()=>{
    await request(app)
    .put('/customers/creditCard')
    .set('Authorization',`Bearer ${customerOne.accessToken}`)
    .send({credit_card:'123123123123'})
    .expect(200)
})

test('Should not update credit card details', async ()=>{
    await request(app)
    .put('/customers/creditCard')
    .set('Authorization',`Bearer ${customerOne.accessToken}`)
    .send({credit_card:'12312'})
    .expect(400)
})

test('Should update address details',async ()=>{
    await request(app)
    .put('/customers/address')
    .set('Authorization',`Bearer ${customerOne.accessToken}`)
    .send({address:'earth' , city:'mycity' , postal_code:'123456'})
    .expect(200)
})