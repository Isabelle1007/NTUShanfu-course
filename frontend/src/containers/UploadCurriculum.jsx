import './UploadCurriculum.css';
import { useContext, useEffect, useState } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";
import { api } from '../utils/api'

import { Card, Button, Cascader, Tooltip, DatePicker, Form, Input, Radio, Select, Upload } from 'antd';
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
  const [ options, setOptions ] = useState([])
  const [formValues, setFormValues] = useState({
    'title': '',
    'author': [],
    'semester': '',
    'home': '',
    'type': '',
    'last_update': '',
    'file': null
  });
  const [fileList, setFileList] = useState([]);

  const handleBeforeUpload = (file) => {
    // Limit to only one file
    setFileList([file]);
    return false; // Prevent default upload behavior
  };

  const getUsers = () => {
    try {
      api.getAllUsers().then((json) => {
          const code = json.code;
          if(code == "000"){
            for(var i = 0; i < json.data.length; i++){
              const home = json.data[i].home;
              const name = json.data[i].name;
              setOptions((prev) => [
                ...prev,
                {
                  value: name,
                  label: `${home}/${name}`
                }
              ]);
            }
          }
      })
    }catch (err) {
        console.log(err)
    }
  }

  const handleInputChange = (fieldName, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  const handleDatePickerChange = (date) => {
    const d = new Date(date.$d);
    const formattedDate = d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    const parts = formattedDate.split('/');
    const correctDate = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
    setFormValues((prevValues) => ({
      ...prevValues,
      'last_update': correctDate,
    }));
  };

  const uploadClick = () => {

    // const updatedAuthor = formValues.author.map((author) => author.split('/')[1]);
    // const updatedFormValues = {
    //   ...formValues,
    //   author: updatedAuthor
    // };
    // setFormValues(updatedFormValues);
    
    setCurriculum(formValues);
    api.postCurriculum(curriculum)
      .then((json) => {
        if(json.code === '000'){
          console.log('Success')
        }
        else console.log(json.message)
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    getUsers();
    }, []
  );

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
            <Input 
              className='input__box' 
              value={formValues['title']} 
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
          </Form.Item>
          <Form.Item label="作者">
            <Select
              mode="multiple"
              size='middle'
              onChange={(e) => handleInputChange('author', e)}
              style={{ width: '600px', marginLeft: '20px'}}
              options={options}
            />        
          </Form.Item>
          <Form.Item label="家別">
            <Radio.Group 
              style={{ marginLeft: '-70px' }} 
              value={formValues['home']}
              onChange={(e) => handleInputChange('home', e.target.value)}
            >
              <Radio value="加拿"> 加拿 </Radio>
              <Radio value="新武"> 新武 </Radio>
              <Radio value="霧鹿"> 霧鹿 </Radio>
              <Radio value="利稻"> 利稻 </Radio>
              <Radio value="電光"> 電光 </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="期數">
            <div style={{display: 'flex', flexDirection:'row', marginLeft: '20px', width: '240px'}}>
              <Select
                value={formValues['semester']} 
                onChange={(value) => handleInputChange('semester', value)}
              >
                {
                  semesters.map((s) => (
                    <Select.Option value={s.key} onChange={(value) => handleInputChange('semester', value)}>{s.key} </Select.Option>
                  ))
                }
              </Select>
            </div>
          </Form.Item>
          <Form.Item label="科別">
            <div style={{display: 'flex', flexDirection:'row', marginLeft: '20px', width: '240px'}}>
              <Select 
                value={formValues['type']}
                onChange={(value) => handleInputChange('type', value)}
              >
                {
                  types.map((t) => (
                    <Select.Option value={t.key} onChange={(value) => handleInputChange('type', value)}>{t.key}</Select.Option>
                  ))
                }
              </Select>
            </div>
          </Form.Item>
          <Form.Item label="最後編輯日">
            <DatePicker 
              style={{marginLeft: '-170px', width: '240px'}} 
              onChange={handleDatePickerChange}
            />
          </Form.Item>
          <Form.Item 
            valuePropName="fileList" 
            getValueFromEvent={normFile}
          >
            <div style={{marginLeft: '500px', marginTop: '-160px', width: '240px'}}>
              <Upload 
                action={`${api.hostname}/api/file/upload`} 
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
        <Button 
          type="dashed" 
          icon={<UploadOutlined />} 
          size='large' 
          style={{width: '850px'}}
          onClick={uploadClick} 
        >
          上傳教案紙
        </Button>
      </Card>
      </div>
      <Footer/>
    </>
  );
}

export default UploadCurriculum;
