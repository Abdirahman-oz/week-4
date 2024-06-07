const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert/strict');


const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app') // Replace with the path to your main app file

const api = supertest(app)

// Assuming you have a model for blogs (replace with your actual model)
const User = require('../models/user') // Replace with the path to your blog model
var bcrypt = require('bcryptjs');
// Helper function to create a blog for testing purpos
const initialNotes = [
    {
        username: 'Abdi',
        name: 'Osman',
        password: "https",

    },
    {
        username: 'Abdulahhi',
        name: 'Osmanite',
        password: "https",
    },
]

describe('when there is initially some users saved', () => {

    beforeEach(async () => {
        await User.deleteMany({});


        for (const note of initialNotes) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(note.password, salt);
            const userObject = new User({
                username: note.username,
                name: note.name,
                passwordHash,
            });

            await userObject.save()
        }
    })

    test('all users are returned as json', async () => {

        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)

    });
    test('a specific user is within the returned users', async () => {

        const repsonse = await api.get('/api/users')
        const contents = repsonse.body.map(r => r.name)
        assert(contents.includes("Osman"))
    });
})


describe('creating a user', () => {

    beforeEach(async () => {
        await User.deleteMany({});


        for (const note of initialNotes) {
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(note.password, salt);
            const userObject = new User({
                username: note.username,
                name: note.name,
                passwordHash,
            });

            await userObject.save()
        }
    })


    test('user is created successfully', async () => {

        const user = {
            username: 'Arsenal',
            name: 'Arteta',
            password: 'newPassword', // Send the plaintext password
        };

        await api
            .post('/api/users')
            .send(user)
            .expect(201);

        const response = await api.get("/api/users")

        assert.strictEqual(response.body.length, initialNotes.length + 1)

    });

    test('fails with status code 400 if username is less the length of 3', async () => {
        const user = {
            username: "23",
            password: "arse"
           
        }

        await api
            .post('/api/users')
            .send(user)
            .expect(400)

        // const response = await api.get("/api/users")

        // assert.strictEqual(response.body.length, initialNotes.length)
    })


})

after(async () => {
    await mongoose.connection.close()
})