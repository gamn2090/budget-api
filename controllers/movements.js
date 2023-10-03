const {response} = require('express');
const Movement = require('../models/Movement');
const Budget = require('../models/Budget');
const mongoose = require('mongoose');

const createMovement = async (req, res = response) => {
    try {
        const { budgetId, movementTypeId, amount } = req.body;

        const budget = await Budget.findById(budgetId)
                                       .populate('movements');

        //create the new movements of the budget
        const tempBudget = await Budget.findById(budgetId);

        if(!tempBudget){           
            return res.status(404).json({
                ok: false,
                mgs: 'That budget does not exist'
            })       
        }

        let convertedAmount = amount / budget.currentExchangeValue;

        //save the movement
        const newBody = {
            movementTypeId,
            amount: convertedAmount
        }

        movement = new Movement( newBody );
        await movement.save();        

        const newMovements = tempBudget.movements;
        newMovements.push(movement._id);

        const newBudgetBody = {
            movements: newMovements 
        }

        const updatedBudget = await tempBudget.save(newBudgetBody);
    
        res.status(201).json({
            ok: true,
            movement,
            budget: updatedBudget
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            mgs: 'Please contact admin'
        })
    }
   
}

const readMovement = async (req, res = response) => {
    try {

        const movements = await Movement.find();

        res.status(201).json({
            ok: true,
            movements: movements
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            mgs: 'Please contact admin'
        })
    }
}

const updateMovement = async (req, res = response) => {
    
    const { budgetId, movementTypeId, amount } = req.body;
    const movementId = req.params.id;

    try {

        const movement = await Movement.findById(movementId);

        if(!movement)
        {
            return res.status(404).json({
                ok: false,
                mgs: 'That movement does not exist'
            })
        }

        const budget = await Budget.findById(budgetId);
        
        if(!budget)
        {
            return res.status(404).json({
                ok: false,
                mgs: 'That budget does not exist'
            })
        }

        if (budget.owner.toString() !== req.uid && !budget.sharedWith.find(i => i.toString()=== req.uid) )
        {
            return res.status(401).json({
                ok: false,
                mgs: 'This user is not the owner of this budget nor have it shared with'
            })
        }

        let convertedAmount = amount / budget.currentExchangeValue;

        //save the movement
        const newBody = {
            movementTypeId,
            amount: convertedAmount
        }       

        const updatedMovement = await Movement.findByIdAndUpdate(movementId, newBody, {new: true});

        res.status(201).json({
            ok: true,
            movement: updatedMovement
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            mgs: 'Please contact the admin'
        })
    }    
}

const deleteMovement = async (req, res = response) => {
    
    const movementId = req.params.id;

    try {       
        const movement = await Movement.findById(movementId);

        if(!movement)
        {
            return res.status(404).json({
                ok: false,
                mgs: 'That movement does not exist'
            })
        }

        const budget = await Budget.findOne({movements: movementId});
        
        if(!budget)
        {
            return res.status(404).json({
                ok: false,
                mgs: 'That budget does not exist'
            })
        }

        if (budget.owner.toString() !== req.uid  )
        {
            return res.status(401).json({
                ok: false,
                mgs: 'Only the owner can delete a Movement from this Budget'
            })
        }

        const parentBudgetMovement = budget.movements;
        console.log(parentBudgetMovement)

        const newMovements = parentBudgetMovement.filter((element) => element.toString() !== movementId);

        console.log(newMovements)       

        await Movement.findByIdAndDelete(movementId);

        await Budget.updateOne({ _id:  budget.id }, { $set: { movements: newMovements} })

        res.status(201).json({
            ok: true
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            mgs: 'Please contact the admin'
        })
    }    
}

module.exports = {
    createMovement,
    readMovement,
    deleteMovement,
    updateMovement
}