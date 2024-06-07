const usersRouter = require('express').Router()
const User = require('../models/user')
var bcrypt = require('bcryptjs');

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs',{url: 1,title: 1,author: 1,id: 1});
    const reorderedUsers = users.map(user => {
        const { blogs, ...rest } = user.toJSON();
        return { blogs, ...rest };
    });
    response.json(reorderedUsers);
})

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
    if (!username || !password) {
        return response.status(400).json({ error: 'password and username must be given' });
    }
    else if (password.length < 3 || username.length < 3) {
        return response.status(400).json({ error: 'password or username must be at least 3 characters long' })
    }
    else {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password,salt)
        const user = new User({
            username,
            name,
            passwordHash,
        })
        const savedUser= await user.save();
        response.status(201).json(savedUser)
    }


})



usersRouter.get('/:id', async (request, response) => {
    const user = await User.findById(request.params.id).populate('blogs',{url: 1,title: 1,author: 1,id: 1});
    const { blogs, ...rest } = user.toJSON()
    const reorderedUser = { blogs, ...rest };

    response.json(reorderedUser);
})

// usersRouter.delete('/:id', async (request, response) => {
//     const deleteUser = await User.findByIdAndDelete(request.params.id);
//     response.status(204).end;
// })

// usersRouter.put('/:id', async (request, response) => {
//     const body = request.body
//     if (!body.username || !body.password) {
//         return response.status(400).json({ error: 'title or url missing' });
//     }
//     const blog = {
//         title: body.title,
//         author: body.author,
//         url: body.url,
//         likes: body.likes ? body.likes : 0,
//     }

//     await User.findByIdAndUpdate(request.params.id, blog)
//     response.json(blog)
// })

module.exports = usersRouter
