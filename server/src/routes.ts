import express, { request, response } from 'express';
import knex from './database/connection';

import PointsController from './controllers/pointsController';

const router = express.Router()

const pointsController = new PointsController();

router.get('/items', async (request, response) => {
    const items = await knex('items').select('*');

    const serializedItems = items.map(item => {
       return {
         id: item.id,  
         title: item.title,
         image: item.image,
         image_url: 'http://localhost:3333/uploads/' + item.image,
       }
    })

    return response.json(serializedItems);
})

router.post('/points', pointsController.create );

export default router;