const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const jsonwebtoken = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware');


blogsRouter.get('/', async (request, response) => {
  
	const blogs = await Blog.find({}).populate('user',{username: 1, name: 1, id: 1})

  response.json(blogs);
})

blogsRouter.post('/',async (request, response) => {
  const { title, author, url, likes,userId } = request.body

  const decodedToken = jsonwebtoken.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
      return response.status(401).json({'error': 'token missing or invalid'})
  }
  if (!title || !url) {
    return response.status(400).json({ error: 'title or url missing' });
  }
  const user = await User.findById(userId)
  if (!user) {
    return response.status(404).json({ error: 'user not found' });
  }
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes ?? 0,
    user: user.id
  })

 const savedBlog = await blog.save();
 user.blogs = user.blogs.concat(savedBlog._id);
 await user.save();
 response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blogs = await Blog.findById(request.params.id);
  response.json(blogs);
})

blogsRouter.delete('/:id',userExtractor ,async (request, response) => {

  const postId = request.params.id
  console.log("heler",postId)
  const user = request.user
  const blog = await Blog.findById(postId)
if (blog.user._id.toString() === user.id.toString()){
  await Blog.findByIdAndDelete(postId)
  user.blogs = user.blogs.filter(blog => blog.toString() != postId)
  await user.save()
  return response.status(204).end()

}
return response.status(401).json({'error': 'unauthorized to delete post'}).end()

 
})

// blogsRouter.put('/:id', async (request, response) => {
// 	const body = request.body
//   if (!body.title || !body.url) {
//     return response.status(400).json({ error: 'title or url missing' });
//   }
// 	const blog = {
// 		title: body.title,
// 		author: body.author,
// 		url: body.url,
// 		likes: body.likes? body.likes : 0 ,
// 	}
  
// 	await Blog.findByIdAndUpdate(request.params.id, blog)
// 	response.json(blog)
//   })

module.exports = blogsRouter
