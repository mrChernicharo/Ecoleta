import express from 'express';

import ItemsController from './controllers/itemsController';
import PointsController from './controllers/pointsController';

const router = express.Router()

const itemsController = new ItemsController();
const pointsController = new PointsController();

router.get('/items', itemsController.index)

router.post('/points', pointsController.create);
router.get('/points/:id', pointsController.show);

export default router;