/** load Joi Library */
const Joi = require(`joi`)

/** create function to validate request of member */
const validateBorrow = (request) => {
    /** define rules for request */
    const rules = Joi
        .object()
        .keys({
            /** memberID is number only and required*/
            memberID: Joi.number().required(),
            /**  title is required */
            adminID: Joi.number().required(),
            /** author is required */
            date_of_borrow: Joi.number().required(),
            /** publisher is required */
            date_of_return: Joi.number().required(),
            /** category is required */
            status: Joi.number().required()
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
    return {
        status: true
    }
}

module.exports = validateBorrow
/** gaada {} : object, ada {} : value */