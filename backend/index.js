const express = require('express')
const app = express()

const path = require('path')
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });
const { PORT } = process.env;

app.use(express.json())

// Router
const basicRouter = require('./routes/basic_route');
app.use('/', basicRouter);

const curriculumRouter = require('./routes/curriculum_route');
app.use('/curriculum', curriculumRouter);

const userRouter = require('./routes/user_route');
app.use('/user', userRouter);

// Listen on server port
const port = PORT || 4001;
app.listen(port, (req, res) => {
    console.log(`Server runnning on port ${port}`)
})