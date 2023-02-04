const dotenv = require('dotenv'); //allow us to create environment variables using config file

dotenv.config({ path: './config.env' }); //must be before require app

const app = require('./app');

//<><><><><><><><><><><><><><><><><><><><><><><><><><>//
const serverPort = 8000;
app.listen(serverPort);
