const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const express = require('express');
const app = express();
const port = process.env.PORT;
if(!port)
{
    port = 3000;
}
app.listen(port,() => {
    console.log('app is running on port ',port);
})