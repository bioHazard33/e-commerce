const request = require('supertest')
const app=require('../../app')

describe('GET products',()=>{
    test('Should GET 20 products',async()=>{
        const response=await request(app).get('/products/').expect(200)
        expect(response.body.data).not.toBeNull()
        expect(response.body.data).toHaveLength(20)
    
        expect(response.body.data[0]).not.toHaveProperty('createdAt')
        expect(response.body.data[0]).not.toHaveProperty('updatedAt')
    })

    test('Should GET 10 products',async()=>{
        const response=await request(app).get('/products?limit=10').expect(200)
        expect(response.body.data).not.toBeNull()
        expect(response.body.data).toHaveLength(10)
    
        expect(response.body.data[0]).not.toHaveProperty('createdAt')
        expect(response.body.data[0]).not.toHaveProperty('updatedAt')
    })

    test('Should NOT GET any products',async()=>{
        const response=await request(app).get('/products?page=100').expect(200)
        expect(response.body.data).toHaveLength(0)
    })
})

describe('GET Products by ID',()=>{
    test('Should GET Product by ID',async()=>{
        const response=await request(app).get('/products/5').expect(200)
    
        expect(response.body.data).not.toBeNull()
    
        expect(response.body.data).not.toHaveProperty('createdAt')
        expect(response.body.data).not.toHaveProperty('updatedAt')
    
        expect(response.body.data.product_id).toEqual(5)
    })

    test('Should NOT GET Product by ID',async()=>{
        const response=await request(app).get('/products/100').expect(400)
    
        expect(response.body.data).toBeNull()    
    })
})

describe('GET Products By Category ID',()=>{
    test('Should GET Products by Category ID',async()=>{
        const response=await request(app).get('/products/inCategory/5').expect(200)

        expect(response.body.data).not.toBeNull()

        expect(response.body.data.category_id).toEqual(5)
        expect(response.body.data).toHaveProperty('Products')
    })

    test('Should NOT GET Products by Category ID',async()=>{
        const response=await request(app).get('/products/inCategory/100').expect(400)

        expect(response.body.data).toBeNull()
    })
})

describe('GET Products By Department ID',()=>{
    test('Should GET Products by Department ID',async()=>{
        const response=await request(app).get('/products/inDepartment/5').expect(200)

        expect(response.body.data).not.toBeNull()

        expect(response.body.data.department_id).toEqual(5)
        expect(response.body.data).toHaveProperty('Categories')
        expect(response.body.data.Categories[0]).toHaveProperty('Products')

    })

    test('Should NOT GET Products by Department ID',async()=>{
        const response=await request(app).get('/products/inDepartment/100').expect(400)

        expect(response.body.data).toBeNull()
    })
})