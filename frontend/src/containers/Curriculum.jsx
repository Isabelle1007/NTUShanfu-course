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
      Bucket: import.meta.env.VITE_AWS_BUCKET_NAME,
      Key: `pdf/${curriculum.title}.pdf`
    });

    try {
      const response = await client.send(command);
      if (response.Body instanceof ReadableStream) {
        // If response.Body is a ReadableStream
        const newResponse = new Response(response.Body);
        const blob = await newResponse.blob();
        const fileUrl = URL.createObjectURL(blob);
        setDownloadedFile(fileUrl);
      } else {
        // Handle other possible types of response.Body
        console.error("Unsupported response body type:", typeof response.Body);
      }
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
              <span className="custom-card-title-curri">教案紙 #{id}</span>
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
