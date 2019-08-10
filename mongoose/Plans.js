
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let plansSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    indian_rupie: Number,
    coin_per_rupee: Number,
    plan_type: {
        type: String,
        enum: ['DEFAULT', 'CUSTOM']
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'TERMINATED']
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: Date
});

const planSchema = mongoose.model('Plans', plansSchema);



const newPlan = async (request) => {
    return new Promise((resolver, reject) => {
        let newPlan = new planSchema({
            name: request.name,
            description: request.description,
            indian_rupie: request.indian_rupie,
            coin_per_rupee: request.coin_per_rupee,
            plan_type: request.plan_type,
            status: 'ACTIVE'
        });
        newPlan.save(function (err, newPlan) {
            if (err) reject(err);
            resolver('Plan added');
        });
    });
};

const getPlan = async () => {
    return new Promise((resolver,reject) => {

        planSchema.find({status:'ACTIVE'},function (err, plans) {
            if (err) reject(err);
            resolver(plans);
        }).select('name description indian_rupie coin_per_rupee plan_type');
    })
    
};


module.exports = {
    newPlan,
    getPlan
}
