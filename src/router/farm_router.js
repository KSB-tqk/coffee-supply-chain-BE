import express from 'express';
import FarmServices from '../controller/farm_controller.js';
import auth from '../middleware/authentication.js';

const FarmRouter = express.Router();

// add new seed
FarmRouter.post('/seed/', FarmServices.seedController.addSeed);

// update seed
FarmRouter.patch('/seed/:id', auth, FarmServices.seedController.updateSeed);

// delete seed
FarmRouter.delete('/seed/:id', auth, FarmServices.seedController.deleteSeed);

export default FarmRouter;