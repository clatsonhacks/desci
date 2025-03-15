const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fundingSchema = new Schema({
    papername: {type: String,required: true},
    description: {type: String,required: true},
    amount: {type: Number , required: true},
    duration: {type: Number, required: true},
    date: {type: Date,required: true},
},{
    timestamps: true,
});
const Funds = mongoose.model('OldFunds',fundingSchema);
module.exports = Funds;