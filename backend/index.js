const express = require('express')
const cors = require('cors')
const path = require('path')
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env') });
const { PORT } = process.env;

const app = express()

// Use CORS and JSON middleware
// app.use(cors())
app.use(express.json())
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // or specific domain
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Define routes
const basicRouter = require('./routes/basic_route');
const curriculumRouter = require('./routes/curriculum_route');
const userRouter = require('./routes/user_route');
const typeRouter = require('./routes/type_route');
const homeRouter = require('./routes/home_route');
const roleRouter = require('./routes/role_route');
const fileRouter = require('./routes/file_route');

app.use('/', basicRouter);
app.use('/curriculum', curriculumRouter);
app.use('/user', userRouter);
app.use('/type', typeRouter);
app.use('/home', homeRouter);
app.use('/role', roleRouter);
app.use('/file', fileRouter);

// Listen on server port
const port = PORT || 4001;
app.listen(port, (req, res) => {
    console.log(`Server runnning on port ${port}`)
})