const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

//load env vars
dotenv.config({path: './config/config.env'});

//Connect to database
connectDB();

// // setting the default time zone
// process.env.TZ = "Asia/Calcutta";

//route files
const userRoutes = require('./routes/user.routes');
const scheduleRoutes = require('./routes/schedule.routes');

const app = express();

//body parser
app.use(express.json());


//mount routers
app.use('/api/v1/users',userRoutes);
app.use('/api/v1/schedule',scheduleRoutes);


const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on ${process.env.NODE_ENV} mode on port ${PORT}`));

//handle unhandled PromeseRejection
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.message}`.red);
    
    //Close Server & exit process
    server.close(()=> process.exit(1));
})

