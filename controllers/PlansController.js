
'use strict';

const Plans = require('../mongoose/Plans');
const Validator = require('validatorjs');

/**
 * to be used in future
 * # need improvements
 */
const createNew = async (req, res) => {

    let reqBody = req.body;
    const rules = {
        'name': 'required|string',
        'decription': 'required|string',
        'indian_rupie': 'required|number',
        'coin_per_rupie': 'required|number',
        'plan_type': 'required',
        'status': 'required|in:ACTIVE,INACTIVE'
    };

    const validator = new Validator(reqBody, rules);
    if (validator.fails()) {
        return res.status(400).json({ error: true, status: 'FAILED', message: "Validation errors", "validation": validator.errors });
    }

    const plan = await Plans.newPlan(reqBody);

    return res.status(200).json(plan);
}

const getPlans = async (req, res) => {

    let plans = await Plans.getPlan();

    return res.status(200).json(plans);

}


module.exports = {
    getPlans
}
