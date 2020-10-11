const request = require('supertest')
const app=require('../../app')

describe('GET all Departments',()=>{
    test('Should GET all departments',async()=>{
        const response=await request(app).get('/departments/').expect(200)
    
        expect(response.body.data).not.toBeNull()
    
        expect(response.body.data[0]).not.toHaveProperty('createdAt')
        expect(response.body.data[0]).not.toHaveProperty('updatedAt')
    })
})

describe('GET Departments by ID',()=>{
    test('Should GET department by ID',async()=>{
        const response=await request(app).get('/departments/5').expect(200)
    
        expect(response.body.data).not.toBeNull()
    
        expect(response.body.data).not.toHaveProperty('createdAt')
        expect(response.body.data).not.toHaveProperty('updatedAt')
    
        expect(response.body.data.department_id).toEqual(5)
    })
    
    test('Should NOT GET category by ID',async()=>{
        const response=await request(app).get('/departments/25').expect(400)
    
        expect(response.body.data).toBeNull()
    })
})