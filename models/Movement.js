const {Schema, model} = require('mongoose');

const MovementSchema = Schema({
    
    movementTypeId: {
        type: String, 
        required:true
    },
    amount: {
        type: Number,
        required: true
    }
})

MovementSchema.method('toJSON', function() {
    const { __v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});
module.exports = model('Movement', MovementSchema);