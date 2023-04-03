/** create first simple middleware */
const midOne = async (request, response, next) => {
    console.log(`Run MIddleware One`)
    next()
    /** next() function used to continue to the contrroller proccess */
}

/** export function to another file */
module.exports = {
    midOne
}

