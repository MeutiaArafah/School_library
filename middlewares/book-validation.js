/** load Joi Library */
const Joi = require(`joi`)

/** create function to validate request of member */
const validateBook = (request) => {
    /** define rules for request */
    const rules = Joi
        .object()
        .keys({
            /** contact is number only and required*/
            isbn: Joi.number().required(),
            /**  title is required */
            title: Joi.number().required(),
            /** author is required */
            author: Joi.string().required(),
            /** publisher is required */
            publisher: Joi.string().required(),
            /** category is required */
            category: Joi.string().required(),
            /** stock  is required */
            stock: Joi.number().required(),
            /** cover is required */
            cover: Joi.string().required()
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

module.exports = validateBook
/** gaada {} : object, ada {} : value */