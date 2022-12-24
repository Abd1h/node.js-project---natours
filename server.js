const dotenv = require('dotenv');

dotenv.config({ path: './config.env' }); //must be before require app

const app = require('./app');

//<><><><><><><><><><><><><><><><><><><><><><><><><><>//
const serverPort = 8000;
app.listen(serverPort);
