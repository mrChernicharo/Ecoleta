import express from 'express';

const router = express.Router()

router.get('/', (request, response) => {
    return response.json({ message: 'hello world'});
})

export default router;