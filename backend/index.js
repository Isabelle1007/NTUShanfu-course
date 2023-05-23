const express = require('express')
const app = express()
const cors = require('cors')

const path = require('path')
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });
const { PORT } = process.env;

app.use(cors())
app.use(express.json())

// Router
const basicRouter = require('./routes/basic_route');
app.use('/', basicRouter);

const curriculumRouter = require('./routes/curriculum_route');
app.use('/curriculum', curriculumRouter);

const userRouter = require('./routes/user_route');
app.use('/user', userRouter);

const typeRouter = require('./routes/type_route');
app.use('/type', typeRouter);

const homeRouter = require('./routes/home_route');
app.use('/home', homeRouter);

const fileRouter = require('./routes/file_route');
app.use('/file', fileRouter);

// Listen on server port
const port = PORT || 4001;
app.listen(port, (req, res) => {
    console.log(`Server runnning on port ${port}`)
})