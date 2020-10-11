const request = require('supertest')
const app=require('../../app')

test('Should get 10 categories',async()=>{
    const response=await request(app).get('/categories/').expect(200)

    expect(response.body.data).not.toBeNull()
    expect(response.body.data).toHaveLength(10)

    expect(response.body.data[0]).not.toHaveProperty('createdAt')
    expect(response.body.data[0]).not.toHaveProperty('updatedAt')
})

test('Should get 5 categories',async()=>{
    const response=await request(app).get('/categories?limit=5').expect(200)

    expect(response.body.data).not.toBeNull()
    expect(response.body.data).toHaveLength(5)

    expect(response.body.data[0]).not.toHaveProperty('createdAt')
    expect(response.body.data[0]).not.toHaveProperty('updatedAt')
})

test('Should get category by ID',async()=>{
    const response=await request(app).get('/categories/5').expect(200)

    expect(response.body.data).not.toBeNull()

    expect(response.body.data).not.toHaveProperty('createdAt')
    expect(response.body.data).not.toHaveProperty('updatedAt')

    expect(response.body.data.category_id).toEqual(5)
})

test('Should not get category by ID',async()=>{
    const response=await request(app).get('/categories/25').expect(400)

    expect(response.body.data).toBeNull()
})

test('Should get categories in a department',async()=>{
    const response=await request(app).get('/categories/inDepartment/1').expect(200)

    expect(response.body.data).not.toBeNull()
    expect(response.body.data.department_id).toEqual(1)
    expect(response.body.data).toHaveProperty('Categories')
    expect(response.body.data.Categories).toHaveLength(2)
})


test('Should not get categories in a department',async()=>{
    const response=await request(app).get('/categories/inDepartment/11').expect(400)

    expect(response.body.data).toBeNull()
})

test('Should get category by product ID',async()=>{
    const response=await request(app).get('/categories/inProduct/1').expect(200)

    expect(response.body.data).not.toBeNull()
    expect(response.body.data.product_id).toEqual(1)
    expect(response.body.data).toHaveProperty('Category')
})

test('Should not get category by product ID',async()=>{
    const response=await request(app).get('/categories/inProduct/100').expect(400)

    expect(response.body.data).toBeNull()
})