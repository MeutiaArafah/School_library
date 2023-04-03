/** load Joi Library */
const Joi = require(`joi`)

/** create function to validate request of member */
const validateMember = (request) => {
    /** define rules for request */
    const rules = Joi
        .object()
        .keys({
            /** name is required(dibutuhkan)*/
            name: Joi.string().required(),
            /** address is required */
            address: Joi.string().required(),
            /** contact is number only and required */
            contact: Joi.number().required(),
            /** gender is only "Male" adn "Female" allowed */
            gender: Joi.string().valid(`Male`, `Female`)
        })
        .options({ abortEarly: false })
        /** abort = berhenti, early = awal */

    /** get error of validation if it exists */
    let { error } = rules.validate(request.body)

    /** if error is exists */
    if (error != null) {
        /** get all error message */
        let errMessage = error.details.map(it => it.message).join(",")

        /** return error message with code 442 */
        return {
            status: false,
            message: errMessage
        }
    }

    /** if error doesn't exists, continue to controller */
    return{
        status: true
    }
}

module.exports = validateMember 
/** gaada {} : object, ada {} : value */