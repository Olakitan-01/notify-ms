require('dotenv');
const app = require('./src/app.js')


app.listen(process.env.PORT, () => {
    console.log(`API Gateway is running on port ${process.env.PORT}`);
});