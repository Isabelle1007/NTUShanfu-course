const express = require('express')
const multer = require('multer')
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
const { s3Uploadv2 } = require('./s3Service')
app.use('/file', fileRouter);

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype === 'application/msword'){
        cb(null, true);
    }else{
        cb(new Error ("file is not the correct type"), false);
    }
}

const upload = multer({ storage, fileFilter });
app.post("/file/upload", upload.single("file"), async (req, res) => {
    const result = await s3Uploadv2(req.file)
    console.log(req.file)
    res.json(result)
}); 

// Listen on server port
const port = PORT || 4001;
app.listen(port, (req, res) => {
    console.log(`Server runnning on port ${port}`)
})