import express from 'express';
import knex from './database/connection';

const router = express.Router()

router.get('/items', async (request, response) => {
    const items = await knex('items').select('*');

    const serializedItems = items.map(item => {
       return {
         title: item.title,
         image: item.image,
         image_url: 'http://localhost:3333/uploads/' + item.image,
       }
    })

    return response.json(serializedItems);
})


export default router;