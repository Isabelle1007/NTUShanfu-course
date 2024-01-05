import './Curriculum.css';
import { useContext, useEffect, useState, useRef } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";
import PdfFile from '../components/pdfFile';
import { api } from '../utils/api'

import { FloatButton, Spin, Popover, Image} from 'antd';
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

  const { colors, userInfo } = useContext(FilterContext);
  const [ curriculum, setCurriculum ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ displayName, setDisplayName ] = useState('');
  const [ semesterNumber, setSemesterNumber ] = useState('');
  const [ semesterChar, setSemesterChar ] = useState('');
  const [ pureDate, setPureDate ] = useState(''); 
  const [ fileName, setFileName ] = useState(''); 
  const [ infoTitle, setInfoTitle ] = useState('');
  const [ content, setContent] = useState(null);
  const [ wordCloudPic, setWordCloudPic ] = useState(''); // Default wordcloud pic
  const id = new URLSearchParams(location.search).get('id');

  const [downloadedFile, setDownloadedFile] = useState(null);

  const client = new S3Client({ 
    region: 'ap-northeast-1',
    credentials: {
      accessKeyId: "AKIA4HQT7FC5HWVKMB7E",
      secretAccessKey: "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",
    }
  })

  const handleEdit = async () => {
    if(curriculum.author.includes(userInfo.name)){
      window.location.href = `/curriculum/edit?id=${id}`;
    }
    else{
      Swal.fire({
        title: 'Oops!',
        text: '沒有編輯權限',
        icon: 'error',
        confirmButtonText: 'OK',
        allowOutsideClick: false 
      })
      return
    }
  };

  const downloadClick = async () => {

    if(curriculum.file_pdf === null){
      Swal.fire({
        title: 'Oops!',
        text: '該教案目前無提供檔案',
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
      Bucket: "doc-file-uploads",
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

  useEffect(() => {
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

        
      }
    });
  },[]);

  useEffect(() => {
    if (curriculum.id) { // Check if curriculum.id is available
      showPdf();
      setFileName(`20${semesterNumber}台大山服${semesterChar}令營_${curriculum.home}家_${curriculum.type}_${curriculum.title}_${displayName}_${pureDate}`)
      setInfoTitle(`${curriculum.title}（${displayName}）`)
      setContent(
        <div>
          <p><CalendarOutlined /> 期數：{curriculum.semester}</p>
          <p><HomeOutlined /> 家別：{curriculum.home}</p>
          <p><TagsOutlined /> 科別：{curriculum.type}</p>
        </div>
      );
      setWordCloudPic(curriculum.pic_url)
    }
  }, [curriculum]);

  return (
    <>
      <Header/>
      {
        loading ? <Spin indicator={antIcon} size="large"/> : (
          <>
            <FloatButton.Group
              style={{ position: 'fixed', bottom: '100px', right: '50px' }}
            >
              <Popover content={content} title={infoTitle} trigger="click" placement="topLeft">
                <FloatButton 
                  icon={<InfoCircleOutlined style={{ color: colors.colorPrimary}}/>} 
                  tooltip={<div>教案基本資訊</div>}
                  size='large' 
                />
              </Popover>
              <FloatButton 
                icon={<EditOutlined style={{ color: colors.colorPrimary}}/>} 
                tooltip={<div>編輯教案</div>}
                size='large'
                onClick={ handleEdit } 
              />
              <FloatButton 
                icon={<DownloadOutlined style={{ color: colors.colorPrimary }}/>} 
                tooltip={<div>下載教案紙</div>}
                size='large'
                onClick={ downloadClick } 
              />
            </FloatButton.Group>
            <div className='curriculum__container'>
              { downloadedFile && (
                <div style={{ width: '900px', marginTop: '-50px'}}>
                  <PdfFile file={downloadedFile} />
                </div>
              )}
            </div>
            <a ref={linkRef} href={curriculum.file_pdf} target="_blank" rel="noopener noreferrer" style={{ display: 'none' }}/>
          </>
        )
      }
      <Footer/>
    </>
  );  
}

export default Curriculum;
