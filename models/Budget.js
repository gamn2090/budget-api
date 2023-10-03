const {Schema, model} = require('mongoose');

const BudgetSchema = Schema({

    name: {
        type: String,
        required: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    sharedWith: [
        { 
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    movements: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movement'
        }
    ],
    currencyId: {
        type: String,
        required: true
    },
    currentExchangeValue: {
        type: Number,
        required:true
    }
})

BudgetSchema.method('toJSON', function() {
    const { __v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
})

module.exports = model('Budget', BudgetSchema);