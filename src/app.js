const express = require('express');
const bodyParser = require('body-parser');
const {sequelize} = require('./model')
const contractRouter = require('./routes/contract.router');
const jobRouter = require('./routes/job.router');
const balanceRouter = require('./routes/balances.router');
const adminRouter = require('./routes/admin.router');
const logErrors = require("./middleware/log-errors.middleware");
const clientErrorHandler = require("./middleware/client-error.middleware");
const errorHandler = require("./middleware/error.middleware");

const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.use(contractRouter)
app.use(jobRouter)
app.use(balanceRouter)
app.use(adminRouter)

app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

module.exports = app;
