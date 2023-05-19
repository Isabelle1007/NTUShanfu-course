import './Curriculum.css';
import { useContext, useEffect, useState } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";
import { api } from '../utils/api'

import { Card, Cascader, DatePicker, Form, Input, InputNumber, Radio, Select, Upload, } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const Curriculum = () => {

  const { colors } = useContext(FilterContext);
  const [ curriculum, setCurriculum ] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [displayDate, setDisplayDate] = useState('');
  const id = new URLSearchParams(location.search).get('id');

  const fake_names_list = [
    {
    value: '加拿',
    label: '加拿',
    children: [
      {
        value: '劉宥廷',
        label: '劉宥廷'
      },
      {
        value: '陳彥廷',
        label: '陳彥廷'
      },
      {
        value: '李浩然',
        label: '李浩然'
      }
    ]
  },
  {
    value: '新武',
    label: '新武',
    children: [
      {
        value: '陳涵',
        label: '陳涵'
      },
      {
        value: '何安婕',
        label: '何安婕'
      },
      {
        value: '陳建宇',
        label: '陳建宇'
      },
      {
        value: '許祐嘉',
        label: '許祐嘉'
      }
    ]
  },
  {
    value: '霧鹿',
    label: '霧鹿',
    children: [
      {
        value: '江嶸',
        label: '江嶸'
      },
      {
        value: '戴悅鈴',
        label: '戴悅鈴'
      },
      {
        value: '黃喬柔',
        label: '黃喬柔'
      }
    ]
  },
  {
    value: '利稻',
    label: '利稻',
    children: [
      {
        value: '陳忠峻',
        label: '陳忠峻'
      },
      {
        value: '王宇彤',
        label: '王宇彤'
      },
      {
        value: '陳則宇',
        label: '陳則宇'
      }
    ]
  }]

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
    </div>
    <Footer/>
    </>
  );
}

export default Curriculum;
