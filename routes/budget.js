/*    
    Budgets routes  / Budget
    host + /api/budget
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/field-validator');
const { validateJwt } = require('../middlewares/validate-jwt');
const { createBudget,
        readBudget, 
        deleteBudget,
        updateBudget } = require('../controllers/budgets');

const router = Router();
router.use(validateJwt);
//create
router.post(
        '/', 
        [
            //middloewares
            check('name', 'Name is required').not().isEmpty(),
            check('currencyId', 'Currency is required').not().isEmpty(),
            validateFields,
        ], 
        createBudget
)
//update
router.put(
    '/:id',
    updateBudget
)
//read
router.get(
        '/',
        readBudget
)
//delete
router.delete(
    '/:id', 
    deleteBudget
)

module.exports = router;