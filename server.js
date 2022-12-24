const app = require('./app');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });
console.log(process.env.NODE_ENV);
//<><><><><><><><><><><><><><><><><><><><><><><><><><>//
const serverPort = 8000;
app.listen(serverPort);
