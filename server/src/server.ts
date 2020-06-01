import express from 'express';

const app = express()

app.get('/users', (request, response) => {
    
    return response.json({
        message: 'Foooooi',
        habilidades: ['react', 'node', 'typescript', 'python', 'sql']
    });
})

app.listen(3333);