/** load library express */
const express = require(`express`)

/** initiate object that instance of express */
const app = express()

/** allow to read 'request' with json type */
app.use(express.json())

/** load admin's controller */
const adminController = require(`../controllers/admin.controller`)

/** load authorization function from controllers */
// const { authorize } = require(`../controllers/auth.controller`)

/** load middleware for validation request */
// let { validateAdmin } = require(`../middlewares/admin-validation`)

/** create route to get data with method "GET" */
app.get("/", adminController.getAllAdmin)

/** create route to add new admin using method "POST" */
app.post("/", adminController.addAdmin)

/** create route to find admin
 * using method "POST" and path "find" */
app.post("/find", adminController.findAdmin)

/** create route to update member 
 * using method "PUT" and define parameter for "id" */
app.put("/:id", adminController.updateAdmin)

/** create route to delete member
 * using method "DELETE" and define parameter for 'id */
app.delete("/:id", adminController.deleteAdmin)

/** export app in order to load in another file */
module.exports = app

