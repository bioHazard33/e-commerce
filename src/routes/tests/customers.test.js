const request=require('supertest')
const app=require('../../app')

const { customerOne,setupDB } = require('./db')
const { CustomersModel } = require("../../database/mysql/sequelize");

beforeAll(setupDB)

// * Actual Tests

describe('SIGNUP a customer',()=>{
    test('Should SINGUP a customer',async ()=>{
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
    
    test('Should NOT SIGNUP a customer',async()=>{
        const response = await request(app).post('/customers/').send({
            name:'mynewname',
            email:'',
            password:'mynewpassword'
        }).expect(400)
        
        expect(response.body.data).toBeNull()
    })
})

describe('LOGIN a Customer',()=>{
    test('Should LOGIN successfully', async ()=>{
        const response = await request(app).post('/customers/login/').send({
            'email':customerOne.email,
            'password':customerOne.password
        }).expect(200)
    
        accessToken=response.body.data.accessToken
        expect(response.body.data).toHaveProperty('customer')
        expect(response.body.data).toHaveProperty('accessToken')
    })
    
    test('Should NOT LOGIN successfully (Wrong Password)',async ()=>{
        const response = await request(app).post('/customers/login/').send({
            'email':customerOne.email,
            'password':customerOne.password+'1'
        }).expect(404)
    
        expect(response.body.data).toBe(null)
    })

    test('Should NOT login successfully (Not existing email)',async ()=>{
        const response = await request(app).post('/customers/login/').send({
            'email':customerOne.email+'1',
            'password':customerOne.password
        }).expect(400)
    
        expect(response.body.data).toBe(null)
    })
})

describe('UPDATE Customer',()=>{

    describe('UPDATE whole details',()=>{
        test('Should UPDATE customer details',async ()=>{
            await request(app)
            .put('/customers/')
            .set('Authorization',`Bearer ${customerOne.accessToken}`)
            .send({name:'mynameupdated',email:'updatedmail@asd.com',password:'updatedPassword'})
            .expect(200)
        })
        
        test('Should NOT UPDATE customer details',async ()=>{
            await request(app)
            .put('/customers/')
            .set('Authorization',`Bearer ${'NOT_A_JWT_TOKEN'}`)
            .send({name:'mynameupdated',email:'updatedmail@asd.com',password:'updatedPassword'})
            .expect(404)
        })
    })
    
    describe('UPDATE Credit Card Details',()=>{
        test('Should UPDATE credit card details',async ()=>{
            await request(app)
            .put('/customers/creditCard')
            .set('Authorization',`Bearer ${customerOne.accessToken}`)
            .send({credit_card:'123123123123'})
            .expect(200)
        })
        
        test('Should NOT UPDATE credit card details', async ()=>{
            await request(app)
            .put('/customers/creditCard')
            .set('Authorization',`Bearer ${customerOne.accessToken}`)
            .send({credit_card:'12312'})
            .expect(400)
        })
    })
    
    describe('UPDATE Address details',()=>{
        test('Should UPDATE address details',async ()=>{
            await request(app)
            .put('/customers/address')
            .set('Authorization',`Bearer ${customerOne.accessToken}`)
            .send({address:'earth' , city:'mycity' , postal_code:'123456'})
            .expect(200)
        })

        test('Should NOT UPDATE address details',async()=>{
            await request(app)
            .put('/customers/address')
            .set('Authorization',`Bearer ${customerOne.accessToken}`)
            .send({address:'' , city:'' , postal_code:'123233456'})
            .expect(400)
        })
    })
})