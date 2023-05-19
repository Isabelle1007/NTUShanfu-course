import './UploadCurriculum.css';
import { useContext, useEffect, useState } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";
import { api } from '../utils/api'

import { Card, Button, Cascader, Tooltip, DatePicker, Form, Input, InputNumber, Radio, Select, Upload } from 'antd';
import { PlusOutlined, MinusOutlined, UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const UploadCurriculum = () => {

  const { colors, semesters, types } = useContext(FilterContext);
  const [ curriculum, setCurriculum ] = useState([]);
  const [fileList, setFileList] = useState([]);

  const handleBeforeUpload = (file) => {
    // Limit to only one file
    setFileList([file]);
    return false; // Prevent default upload behavior
  };

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

  const [additionalCascaders, setAdditionalCascaders] = useState([]);

  const handleAddCascader = () => {
    setAdditionalCascaders(prevCascaders => [...prevCascaders, <Cascader options={fake_names_list} style={{ width: '240px', marginBottom: '5px' }} />]);
  };

  const handleRemoveCascader = () => {
    setAdditionalCascaders(prevCascaders => {
      const updatedCascaders = [...prevCascaders];
      updatedCascaders.pop(); // Remove the last element
      return updatedCascaders;
    });
  };

  const uploadClick = () => {
    api.postCurriculum(curriculum).then((json) => {
      if(json.code === '000'){
        console.log('Success')
      }
      else console.log(json.message)
    })
  }

  return (
    <>
      <Header/>
      <div className='upload__container'>
      <Card
        title="上傳教案紙"
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
          <Form.Item label="教案名稱">
            <Input className='input__box'/>
          </Form.Item>
          <Form.Item label="作者">
            <div style={{display: 'flex', flexDirection:'row', marginLeft: '20px'}}>
              <div className='left'>
                <Cascader
                  options={ fake_names_list }
                  style={{ width: '240px', marginBottom: '5px'}}
                />
                {additionalCascaders.map((cascader, index) => (
                  <div key={index}>{cascader}</div>
                ))}
              </div>
              <div className='right'>
                <Tooltip title="新增撰寫者">
                  <Button shape="circle" icon={<PlusOutlined />} style ={{margin: '0 10px'}}onClick={handleAddCascader}/>
                </Tooltip>
                <Tooltip title="移除撰寫者">
                  <Button shape="circle" icon={<MinusOutlined />} disabled={additionalCascaders.length === 0} onClick={handleRemoveCascader}/>
                </Tooltip>
              </div> 
            </div>           
          </Form.Item>
          <Form.Item label="家別">
            <Radio.Group style={{ marginLeft: '-70px' }}>
              <Radio value="加拿"> 加拿 </Radio>
              <Radio value="新武"> 新武 </Radio>
              <Radio value="霧鹿"> 霧鹿 </Radio>
              <Radio value="利稻"> 利稻 </Radio>
              <Radio value="電光"> 電光 </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="期數">
            <div style={{display: 'flex', flexDirection:'row', marginLeft: '20px', width: '240px'}}>
              <Select>
                {
                  semesters.map((s) => (
                    <Select.Option value={s.key}>{s.key}</Select.Option>
                  ))
                }
              </Select>
            </div>
          </Form.Item>
          <Form.Item label="科別">
            <div style={{display: 'flex', flexDirection:'row', marginLeft: '20px', width: '240px'}}>
              <Select>
                {
                  types.map((t) => (
                    <Select.Option value={t.key}>{t.key}</Select.Option>
                  ))
                }
              </Select>
            </div>
          </Form.Item>
          <Form.Item label="最後編輯日">
            <DatePicker style={{marginLeft: '-170px', width: '240px'}}/>
          </Form.Item>
          <Form.Item 
            valuePropName="fileList" 
            getValueFromEvent={normFile}
          >
            <div style={{marginLeft: '500px', marginTop: '-160px', width: '240px'}}>
              <Upload 
                action={`${api.hostname_be}/api/file/upload`} 
                accept=".doc,.docx"
                listType="picture-card" 
                fileList={fileList}
                beforeUpload={handleBeforeUpload}
              >
                <div >
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>
                    教案紙word檔
                  </div>
                </div>
              </Upload>
            </div>
          </Form.Item>
        </Form>
        <Button onClick={uploadClick} type="dashed" icon={<UploadOutlined />} size='large' style={{width: '850px'}}>
          上傳教案紙
        </Button>
      </Card>
      </div>
      <Footer/>
    </>
  );
}

export default UploadCurriculum;
