const {response} = require('express');
const Budget = require('../models/Budget');
const { convertToUSD } = require('../helpers/converter');

const createBudget = async (req, res = response) => {
    try {
        const { currencyId } = req.body;       
        
        //validate if the currency is USD we don't have to calculate anything
        let exchangeRate = 0;
        if(currencyId !== 'USD'){
            exchangeRate = await convertToUSD(currencyId);
        }else{
            exchangeRate = 1;
        }
          
        const newBody = {
            owner: req.uid,
            currentExchangeValue: exchangeRate,
            ...req.body
          } 
        budget = new Budget( newBody );
        await budget.save();        
    
        res.status(201).json({
            ok: true,
            budget
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            mgs: 'Please contact admin'
        })
    }
   
}

const readBudget = async (req, res = response) => {
    try {

        const budgets = await Budget.find()
                                    .populate('owner', 'name')
                                    .populate('sharedWith', 'name');

        res.status(200).json({
            ok: true,
            budgets
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            mgs: 'Please contact admin'
        })
    }
}

const updateBudget = async (req, res = response) => {
    
    const { currencyId } = req.body;       

    const budgetId = req.params.id;

    try {

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

        let exchangeRate = budget.currentExchangeValue;

        if(currencyId && currencyId !== budget.currencyId){ 
            if(currencyId !== 'USD'){
                exchangeRate = await convertToUSD(currencyId);
            }else{
                exchangeRate = 1;
            }
        }

        const newBudget = {
            ...req.body,
            currentExchangeValue: exchangeRate, 
        }

        const updatedBudget = await Budget.findByIdAndUpdate(budgetId, newBudget, {new: true});

        res.status(200).json({
            ok: true,
            budget: updatedBudget
        })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            mgs: 'Please contact the admin'
        })
    }    
}

const deleteBudget = async (req, res = response) => {
    
    const budgetId = req.params.id;

    try {

        const budget = await Budget.findById(budgetId);
        
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
                mgs: 'Only the owner can delete a Budget'
            })
        }
        
        const updatedBudget = await Budget.findByIdAndDelete(budgetId);

        res.status(200).json({
            ok: true,
            msg: `The ${budgetId} budget has been deleted correctly `
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
    createBudget,
    readBudget,
    deleteBudget,
    updateBudget
}