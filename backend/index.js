const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())

const path = require('path')
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env') });
const { PORT } = process.env;

app.use(express.json())

// Router
const basicRouter = require('./routes/basic_route');
app.use('/api', basicRouter);

const curriculumRouter = require('./routes/curriculum_route');
app.use('/api/curriculum', curriculumRouter);

const userRouter = require('./routes/user_route');
app.use('/api/user', userRouter);

const typeRouter = require('./routes/type_route');
app.use('/api/type', typeRouter);

const homeRouter = require('./routes/home_route');
app.use('/api/home', homeRouter);

const fileRouter = require('./routes/file_route');
app.use('/api/file', fileRouter);

// Listen on server port
const port = PORT || 4001;
app.listen(port, (req, res) => {
    console.log(`Server runnning on port ${port}`)
})