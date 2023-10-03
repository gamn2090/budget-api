const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {dbConnection} = require('./database/config');
//create express server
const app = express();

//database
dbConnection();

//CORS
app.use(cors())

//Public directory
app.use(express.static('./public'));

//read and pase of the body
app.use( express.json() )

//auth routes
app.use('/api/auth', require('./routes/auth'))
//budgets routes
app.use('/api/budget', require('./routes/budget'))
//movements routes
app.use('/api/movement', require('./routes/movement'))

//lister requests
app.listen( process.env.PORT, () => {
    console.log(`server running in the ${process.env.PORT} port`)
})