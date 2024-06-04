import './Curriculum.css';
import { useContext, useEffect, useState, useRef } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";
import PdfFile from '../components/pdfFile';
import { api } from '../utils/api'

import { FloatButton, Spin, Popover } from 'antd';
import { LoadingOutlined, DownloadOutlined, EditOutlined, InfoCircleOutlined, CalendarOutlined, HomeOutlined, TagsOutlined } from '@ant-design/icons';

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

import Swal from 'sweetalert2'

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 48,
    }}
    spin
  />
);

const Curriculum = () => {

  const { colors, userInfo, isLogin, setIsLogin } = useContext(FilterContext);
  const [ curriculum, setCurriculum ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ displayName, setDisplayName ] = useState('');
  const [ semesterNumber, setSemesterNumber ] = useState('');
  const [ semesterChar, setSemesterChar ] = useState('');
  const [ pureDate, setPureDate ] = useState(''); 
  const [ fileName, setFileName ] = useState(''); 
  const [ infoTitle, setInfoTitle ] = useState('');
  const [ content, setContent] = useState(null);
  const [ noEdit, setNoEdit ] = useState(true); 
  const id = new URLSearchParams(location.search).get('id');

  const [downloadedFile, setDownloadedFile] = useState(null);

  const client = new S3Client({ 
    region: import.meta.env.VITE_AWS_REGION,
    credentials: {
      accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
      secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
    }
  })

  const handleEdit = async () => {
    window.location.href = `/curriculum/edit?id=${id}`;
  };

  const text_no_data = `
    <div>
      <span>該教案目前無提供檔案預覽</span><br>
      <span>No data preview for this course</span>
    </div>
  `
  const downloadClick = async () => {

    if(curriculum.file_pdf === null){
      Swal.fire({
        title: 'Oops!',
        html: text_no_data,
        icon: 'error',
        confirmButtonText: 'OK',
        allowOutsideClick: false 
      })
      return
    } 
    linkRef.current.click();
  }

  const linkRef = useRef(null);

  const showPdf = async () => {
    const command = new GetObjectCommand({
      Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
      Key: `pdf/${curriculum.title}.pdf`
    });

    try {
      const response = await client.send(command);
      const reader = response.Body.getReader();
      const chunks = [];
      let chunk;
      while (!(chunk = await reader.read()).done) {
        chunks.push(chunk.value);
      }
      const fileBlob = new Blob(chunks, { type: 'application/octet-stream' });
      const fileUrl = URL.createObjectURL(fileBlob);
      setDownloadedFile(fileUrl);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  }

  const checkLogIn = async () => {
    const jwtToken = window.localStorage.getItem('jwtToken');
    if(jwtToken){
        setIsLogin(true)
    }   
    else{
        setIsLogin(false)
    }  
}

  useEffect(() => {
    checkLogIn();
    api.getCurriculumByID(id).then((json) => {
      if(json.data){
        setCurriculum(json.data);
        setDisplayName(json.data.author.join(', '));

        // Splitting the curriculum.semester into two parts
        const semesterRegex = /(\d+)([\u4e00-\u9fa5])/;
        const match = json.data.semester.match(semesterRegex);
        if (match) {
          setSemesterNumber(match[1]); // The numeric part
          setSemesterChar(match[2]); // The Chinese character
        }

        // Splitting the date
        let dateOnly = json.data.last_update.split(' ')[0];
        setPureDate(dateOnly.replace(/-/g, ''));

        // Set editing permissions based on the curriculum author and user info
        if (json.data.author.includes(userInfo.name)) {
          setNoEdit(false);
        } else {
          setNoEdit(true);
        }
      }
    });
  },[]);

  useEffect(() => {
    checkLogIn();
    }, [isLogin]
);

  useEffect(() => {
    if (curriculum.id) { // Check if curriculum.id is available
      showPdf();
      setFileName(`20${semesterNumber}台大山服${semesterChar}令營_${curriculum.home}家_${curriculum.subject}_${curriculum.title}_${displayName}_${pureDate}`)
      setInfoTitle(`${curriculum.title}（${displayName}）`)
      setContent(
        <div>
          <p><CalendarOutlined /> 期數：{curriculum.semester}</p>
          <p><HomeOutlined /> 家別：{curriculum.home}</p>
          <p><TagsOutlined /> 科別：{curriculum.subject}</p>
        </div>
      );
    }
  }, [curriculum]);

  useEffect(() => {
    // Check edit permissions when curriculum or userInfo changes
    if (curriculum && curriculum.author && userInfo && userInfo.name) {
      setNoEdit(!curriculum.author.includes(userInfo.name));
    }
  }, [curriculum, userInfo]); // Dependencies on curriculum and userInfo
  

  return (
    <>
      <Header/>
      {
        loading ? <Spin indicator={antIcon} size="large"/> : (
        <>
          <div className='curriculum__container'>
            { downloadedFile && (
              <div style={{ width: '900px', marginTop: '-50px'}}>
                <PdfFile file={downloadedFile} />
              </div>
            )}
          </div>
          <FloatButton.Group
            className='floatBtnGroup-c'
            style={{ position: 'fixed', bottom: '100px', right: '80px' }}
          >
            <Popover content={content} title={infoTitle} trigger="click" placement="topLeft">
              <FloatButton
                className='floatBtn' 
                tooltip={
                  <div>
                    <span>查看教案基本資訊</span><br/>
                    <span>View basic information</span>
                  </div>
                }
                icon={
                  <span className="icon-wrapper">
                    <InfoCircleOutlined style={{ color: colors.colorPrimary, fontSize: '1.8em' }}/>
                  </span>
                }
              />
            </Popover>
            <FloatButton 
              className='floatBtn' 
              tooltip={ noEdit ? 
                <div>
                  <span>沒有編輯權限</span><br/>
                  <span>No Edit Permission</span>
                </div> : 
                <div>
                  <span>編輯教案基本資訊</span><br/>
                  <span>Edit basic information</span>
                </div>
              }
              icon={
                <span className="icon-wrapper">
                  <EditOutlined style={{ color: colors.colorPrimary, fontSize: '1.8em' }}/>
                </span>
              }
              size='large'
              disabled={ noEdit }
              style={{ opacity: noEdit ? 0.5 : 1 }} // Apply transparency when disabled
              onClick={ handleEdit }
            />
            <FloatButton 
              className='floatBtn' 
              icon={
                <span className='icon-wrapper'>
                  <DownloadOutlined style={{ color: colors.colorPrimary, fontSize: '1.8em' }}/>
                </span>
              }
              tooltip={ isLogin ? 
                <div>
                  <span>下載教案紙</span><br/>
                  <span>Download Curriculum Paper</span>
                </div> : 
                <div>
                  <span>沒有下載權限</span><br/>
                  <span>No Download Permission</span>
                </div>
              }
              size='large'
              disabled={ isLogin ? false : true }
              style={{ opacity: isLogin ? 1 : 0.5 }}
              onClick={ downloadClick } 
            />
          </FloatButton.Group>
          <a ref={linkRef} href={curriculum.file_pdf} target="_blank" rel="noopener noreferrer" style={{ display: 'none' }}/>
          </>
        )
      }
      <Footer/>
    </>
  );  
}

export default Curriculum;
