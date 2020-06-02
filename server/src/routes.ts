import express from 'express';
import knex from './database/connection';

const router = express.Router()

router.get('/items', async (request, response) => {
    const items = await knex('items').select('*');

    return response.json(items);
})

export default router;