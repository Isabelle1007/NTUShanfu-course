import './Curriculum.css';
import { useContext, useEffect, useState } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";
import { api } from '../utils/api'

import { Card, Form } from 'antd';
import DocViewer from 'react-doc-viewer';

const Curriculum = () => {

  const { colors } = useContext(FilterContext);
  const [ curriculum, setCurriculum ] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [displayDate, setDisplayDate] = useState('');
  const id = new URLSearchParams(location.search).get('id');

  const docs = [
    { uri: 'https://doc-file-uploads.s3.ap-northeast-1.amazonaws.com/2023%E5%8F%B0%E5%A4%A7%E5%B1%B1%E6%9C%8D%E5%86%AC%E4%BB%A4%E7%87%9F_%E6%96%B0%E6%AD%A6%E5%AE%B6_%E7%B6%9C%E5%90%88_%E7%84%A1%E6%95%B5%E7%A0%B4%E5%A3%9E%E7%8E%8B2_%E4%BB%BB%E9%87%87%E8%93%81_20230120.docx'},
    { uri : 'https://www.flaticon.com/free-icon/paper_2541979?term=paper&page=1&position=2&origin=search&related_id=2541979'},
  ]

  useEffect(() => {
    api.getCurriculumByID(id).then((json) => {
      if(json.data){
        setCurriculum(json.data);
        setDisplayName(json.data.author.join(', '));
        setDisplayDate(json.data.last_update.split(' ')[0]);
      }
    }, []);
  })

  return (
    <>
      <Header/>
      <div className='curriculum__container'>
      <Card
        title={`教案紙 #${id}`}
        bordered={true}
        style={{
          width: 900,
        }}
      >
        <Form
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
          <Form.Item label="檔案">
            <div className='input' >TBC...</div>
          </Form.Item>
        </Form>
      </Card>
      {/* <DocViewer documents={docs}/> */}
    </div>
    <Footer/>
    </>
  );
}

export default Curriculum;
