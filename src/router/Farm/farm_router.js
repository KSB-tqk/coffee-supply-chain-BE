import express from 'express';
import FarmServices from '../../controller/Farm/farm_controller.js';
import auth from '../../middleware/authentication.js';

const FarmRouter = express.Router();

/* -----------Seed----------- */
// add new seed
FarmRouter.post('/seed/', FarmServices.seedController.addSeed);

// update seed
FarmRouter.patch('/seed/:id', FarmServices.seedController.updateSeed);

// delete seed
FarmRouter.delete('/seed/:id', FarmServices.seedController.deleteSeed);

// get all seed by farm ID
FarmRouter.get('/seed/all/:id', FarmServices.seedController.getAllSeeds);

// get detail seed
FarmRouter.get('/seed/:id', FarmServices.seedController.getSeed);

/* -----------Land----------- */
// add new land
FarmRouter.post('/land/', FarmServices.landController.addLand);

// update land
FarmRouter.patch('/land/:id', FarmServices.landController.updateLand);

// delete land
FarmRouter.delete('/land/:id', FarmServices.landController.deleteLand);

// get all land by farm ID
FarmRouter.get('/land/all/:id', FarmServices.landController.getAllLands);

// get detail land
FarmRouter.get('/land/:id', FarmServices.landController.getLand);

/* -----------Farm----------- */
// add farm
FarmRouter.post('/', FarmServices.farmController.addFarm);

// update farm
FarmRouter.patch('/:id', FarmServices.farmController.updateFarm);

// get detail farm
FarmRouter.get('/:id', FarmServices.farmController.getFarm);

// get all farm
FarmRouter.get('/', FarmServices.farmController.getAllFarms);

export default FarmRouter;