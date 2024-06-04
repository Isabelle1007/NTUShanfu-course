const express = require('express')
const cors = require('cors')
const path = require('path')
const dotenv = require('dotenv');
// const https = require('https'); //development
// const fs = require('fs'); //development

dotenv.config({ path: path.resolve(__dirname, '.env') });
const { PORT } = process.env;

const app = express()

// Use CORS and JSON middleware
app.use(cors())
app.use(express.json())

// Define routes
const basicRouter = require('./routes/basic_route');
const curriculumRouter = require('./routes/curriculum_route');
const userRouter = require('./routes/user_route');
const subjectRouter = require('./routes/subject_route');
const homeRouter = require('./routes/home_route');
const roleRouter = require('./routes/role_route');
const fileRouter = require('./routes/file_route');

app.use('/', basicRouter);
app.use('/curriculum', curriculumRouter);
app.use('/user', userRouter);
app.use('/subject', subjectRouter);
app.use('/home', homeRouter);
app.use('/role', roleRouter);
app.use('/file', fileRouter);

// Listen on server port
const port = PORT || 4001;
app.listen(port, (req, res) => {
    console.log(`Server runnning on port ${port}`)
})

//Development
// const sslServer = https.createServer({
//     key: fs.readFileSync(path.resolve(__dirname, 'cert', 'key.pem')),
//     cert: fs.readFileSync(path.resolve(__dirname, 'cert', 'cert.pem'))
// }, app);

// sslServer.listen(port, () => console.log(`Server runnning on port ${port}`));