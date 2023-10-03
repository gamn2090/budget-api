/*    
    Movements routes  / Movement
    host + /api/movement
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/field-validator');
const { validateJwt } = require('../middlewares/validate-jwt');
const { createMovement,
        readMovement,
        deleteMovement,
        updateMovement,
    } = require('../controllers/movements');

const router = Router();
router.use(validateJwt);
//create
router.post(
    '/', 
    [
        //middloewares
        check('movementTypeId', 'The type of movement is required').not().isEmpty(),
        check('amount', 'You need to specify the amount').not().isEmpty(),
        check('budgetId', 'You need to specify the budget which this movement belongs to').not().isEmpty(),
        validateFields,
    ], 
    createMovement
)
//update
router.put(
    '/:id', 
    [
        //middloewares
        check('movementTypeId', 'The new type of movement is required').not().isEmpty(),
        check('amount', 'You need to specify the new amount').not().isEmpty(),
        check('budgetId', 'You need to specify the budget which this movement belongs to').not().isEmpty(),
        validateFields,
    ], 
    updateMovement
)
//read
router.get(
    '/',
    readMovement
)
//delete
router.delete(
    '/:id', 
    deleteMovement
)

module.exports = router;