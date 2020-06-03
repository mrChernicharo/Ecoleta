import express, { request, response } from 'express';
import knex from './database/connection';

const router = express.Router()

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

router.post('/points', async (request, response) => {
   const { 
      name, email, whatsapp, longitude, latitude, city, uf, items,
   } = request.body;

   const ids = await knex('points').insert({
      name, 
      image:'fake-img',
      email,
      whatsapp, 
      longitude, 
      latitude, 
      city, 
      uf, 
   });

   const pointItems = items.map((item_id: number )=> {
      return {
         item_id,
         point_id: ids[0],
      }
   })

   await knex('point_items').insert(pointItems);

   return response.json({ success: true })
});

export default router;