import './Curriculum.css';
import { useContext, useEffect, useState, useRef } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";
import PdfFile from '../components/pdfFile';
import { api } from '../utils/api'

import { Card, Form, Button, Space} from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, DownloadOutlined, EditOutlined, FileTextOutlined } from '@ant-design/icons';

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";

import Swal from 'sweetalert2'

const Curriculum = () => {

  const { colors, userInfo } = useContext(FilterContext);
  const [ curriculum, setCurriculum ] = useState([]);
  const [ displayName, setDisplayName ] = useState('');
  const [ displayDate, setDisplayDate ] = useState('');
  const [ openView, setOpenView ] = useState(false); 
  const [ semesterNumber, setSemesterNumber ] = useState('');
  const [ semesterChar, setSemesterChar ] = useState('');
  const [ pureDate, setPureDate ] = useState(''); 
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

  const linkRef = useRef(null);

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

  const viewFileClick = async () => {

    if(curriculum.file_pdf === null){
      Swal.fire({
        title: 'Error!',
        text: '該教案目前無提供檔案',
        icon: 'error',
        confirmButtonText: 'OK',
        allowOutsideClick: false 
      })
      return
    }

    setOpenView(!openView)
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
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    api.getCurriculumByID(id).then((json) => {
      if(json.data){
        setCurriculum(json.data);
        setDisplayName(json.data.author.join(', '));
        setDisplayDate(json.data.last_update.split(' ')[0]);

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

  return (
    <>
      <Header/>
      <div className='curriculum__container'>
        <Card
          title={
            <Space>
              <FileTextOutlined style={{ fontSize: '24px', marginTop: '5px' }}/>
              <span className="custom-card-title-curri">20{semesterNumber} 台大山服{semesterChar}令營_{curriculum.home}家_{curriculum.type}_{curriculum.title}_{displayName}_{pureDate}</span>
            </Space>
          }
          bordered={true}
          style={{
            width: 900,
          }}
        >
          <Form
            className="custom-form-c"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 24 }}
            layout="horizontal"
            style={{
              maxWidth: 600,
            }}
          >
            <Form.Item label="教案名稱" >
              <div className='input' >{curriculum.title}</div>
            </Form.Item>
            <Form.Item label="作者">
              <div className='input'>{displayName}</div>
            </Form.Item>
            <Form.Item label="家別">
              <div className='input' >{curriculum.home}</div>
            </Form.Item>
            <Form.Item label="期數">
              <div className='input' >{curriculum.semester}</div>
            </Form.Item>
            <Form.Item label="科別">
              <div className='input' >{curriculum.type}</div>
            </Form.Item>
            <Form.Item label="最後編輯日">
              <div className='input' >{displayDate}</div>
            </Form.Item>
          </Form>
        </Card>
        <Button 
          type="dashed" 
          shape="circle"
          icon={<EditOutlined />} 
          size='large' 
          style={{
            color: colors.colorPrimary,
            alignSelf: 'end',
            marginTop: '-60px',
            marginRight: '20px'
          }}
          onClick={ handleEdit } 
        />
        <div style={{display: 'flex', justifyContent:'space-between', alignItems: 'center', marginTop: '30px'}}>
          <Button 
            type="dashed" 
            icon={<DownloadOutlined />} 
            size='large' 
            style={{ width: '440px'}}
            // style={{ width: '900px'}}
            onClick={ downloadClick } 
          >
            下載教案紙
          </Button>
          <Button 
            type="dashed" 
            icon={ openView ? <EyeInvisibleOutlined /> : <EyeOutlined /> } 
            size='large' 
            style={{ width: '440px'}}
            onClick={ viewFileClick } 
          >
            { openView ? '收起預覽教案紙': '預覽教案紙'}
          </Button>
        </div>
        { downloadedFile && openView && (
          <div style={{ width: '900px'}}>
            <PdfFile file={downloadedFile} />
          </div>
        )}
        <a ref={linkRef} href={curriculum.file_pdf} target="_blank" rel="noopener noreferrer" style={{ display: 'none' }}/>
      </div>
      <Footer/>
    </>
  );
}

export default Curriculum;
