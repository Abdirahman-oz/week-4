const { test, after,beforeEach,expect } = require('node:test')
const assert = require('node:assert/strict');

const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app') // Replace with the path to your main app file

const api = supertest(app)

// Assuming you have a model for blogs (replace with your actual model)
const Blog = require('../models/blog') // Replace with the path to your blog model

// Helper function to create a blog for testing purpos
const initialNotes = [
  {
       title: 'Abdi',
    author: 'Osman',
    url: "https://fullstackopen.com/en/part4/testing_the_backend#test-environment",
    likes: 5 ,
  },
  {
    title: 'Abdulahhi',
    author: 'Osman',
    url: "https://fullstackopen.com/en/part4/testing_the_backend#test-environment",
    likes: 2 ,
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialNotes[0])
  await blogObject.save()
  blogObject = new Blog(initialNotes[1])
  await blogObject.save()
})

test.only('blog without url is not added', async () => {
  const newBlog = {
    title: 'Title Without URL',
    author: 'Author Without URL',
    likes: 5,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400);

});

// test.only('a valid note can be added ', async () => {
//   const newBlog= {
//     title: 'Abdi',
//     author: 'Osman',
//     url: "https://fullstackopen.com/en/part4/testing_the_backend#test-environment",
//     likes: 5 ,
//   }

//   await api
//     .post('/api/blogs')
//     .send(newBlog)
//     .expect(201)
//     .expect('Content-Type', /application\/json/)

//   const response = await api.get('/api/blogs')
// assert.strictEqual(response.body.length , initialNotes.length +1)
// })


// test.only('a valid note can be added ', async () => {
//   const newBlog= {
//     title: 'Abdi',
//     author: 'Osman',
//     url: "https://fullstackopen.com/en/part4/testing_the_backend#test-environment",
//     likes: 5 ,
//   }

//   await api
//     .put(`/api/blogs/${'665fb55dedd029e1885b543cc'}`)
//     .send(newBlog)
//     .expect(500)
//     .expect('Content-Type', /text\/html/)
   

// })





// test.only('blogs are returned as json', async () => {
//   await api
//     .get('/api/blogs')
//     .expect(200)
//     .expect('Content-Type', /application\/json/)
    
// })






// test('there are two notes', async () => {

//     const response = await api.get('/api/blogs');
//     const contents = response.body.map(r => r.title)

//     assert.strictEqual(response.body.length, 2)

//    assert(contents.includes('Abdulahhi'))

// });






// test('returns 404 for non-existent blog id', async () => {
//   const invalidId = 'invalid_id'; // Replace with a non-existent ID

//   const response = await api
//     .get(`/api/blogs/${invalidId}`)
//     .expect(404); // Expect Not Found status code
// });

// test('creating a blog with valid data succeeds', async () => {
//   const newBlogTitle = 'New blog title'
//   const newBlogUrl = 'https://example.com/new-blog'

//   const response = await api
//     .post('/api/blogs')
//     .send({ title: newBlogTitle, url: newBlogUrl })
//     .expect(201) // Expect Created status code
//     .expect('Content-Type', /application\/json/)

//   expect(response.body.title).toBe(newBlogTitle)
//   expect(response.body.url).toBe(newBlogUrl)

//   // Optional: Check if the blog is saved in the database
//   const blogs = await Blog.find({})
//   expect(blogs.length).toBe(1) // One blog created
// });

// test('creating a blog with missing title or url fails', async () => {
//   const response1 = await api
//     .post('/api/blogs')
//     .send({ url: 'https://example.com/new-blog' }) // Missing title
//     .expect(400) // Expect Bad Request status code

//   const response2 = await api
//     .post('/api/blogs')
//     .send({ title: 'New blog title' }) // Missing URL
//     .expect(400) // Expect Bad Request status code
// });

// Add more tests for updating and deleting blogs (if applicable)

after(async () => {
  await mongoose.connection.close()
})
