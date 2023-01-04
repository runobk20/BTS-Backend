const { response } = require('express');
const {check} = require('express-validator');

const checkBug = (req, res = response, next) => {
    check('title', 'Title is required and of 40 or less characters').not().isEmpty().isLength({max: 40})
    check('description', 'Description is required, max lenght is 140 characters').not().isEmpty().isLength({max: 140})
    check('severity', 'Severity is required').not().isEmpty()
    check('priority', 'Priority is required').not().isEmpty()
    check('status', 'Sstatus is required').not().isEmpty()
    check('stepsToRep', 'The steps to reproduce are required').not().isEmpty()
    check('actualResult', 'Actual results are required').not().isEmpty()
    check('expectedResult', 'The expected result is required').not().isEmpty()

    next();
}

module.exports = {
    checkBug
}