import express, { request } from 'express';

const app = express()
app.use(express.json());

const users = [
    'jorge',
    'amaro',
    'duda',
    'maria',
    'esmeralda',
    'rodrigo',
    'natalia',
    'roberto',

]
// buscar usuário onde...
app.get('/users/search', (request, response) => {
    const like = String(request.query.like);

    const filteredUsers = like ? users.filter(user => user.includes(like)) :users;

    return response.json(filteredUsers);
})

// listar usuários
app.get('/users', (request, response) => {
    return response.json(users);
})


// buscar usuário único
app.get('/users/:id', (request, response) => {
    const id = Number(request.params.id)

    return response.json(users[id])
})

// criar usuário
app.post('/users', (request, response) => {
    const data = request.body
    console.log(data)
    return response.json(data)
})

app.listen(3333);