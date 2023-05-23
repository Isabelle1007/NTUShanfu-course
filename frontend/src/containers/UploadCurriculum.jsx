import './UploadCurriculum.css';
import { useContext, useEffect, useState } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";
import { api } from '../utils/api'

import { Card, Button, DatePicker, Form, Input, Radio, Select, Upload, message } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';

const UploadCurriculum = () => {

  const { colors, semesters, types } = useContext(FilterContext);
  const [ curriculum, setCurriculum ] = useState([]);
  const [ nameList, setNameList ] = useState([])
  const [ formValues, setFormValues ] = useState({
    'title': '',
    'author': [],
    'semester': '',
    'home': '',
    'type': '',
    'last_update': '',
    'file': ''
  });

  const getUsers = () => {
    try {
      api.getAllUsers().then((json) => {
          const code = json.code;
          if(code == "000"){
            for(var i = 0; i < json.data.length; i++){
              const home = json.data[i].home;
              const name = json.data[i].name;
              setNameList((prev) => [
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

  const handleBeforeUpload = (file) => {
    // console.log(file)
    handleInputChange('file', file)
    return false; // Prevent automatic upload
  };

  const uploadClick = async () => {
    // const { file } = formValues.file;
    // const formData = new FormData();
    // formData.append('file', formValues.file);
    // fetch(`${api.hostname_be}/file/upload`, {
    //   method: 'POST',
    //   body: formData,
    // })
    //   .then((response) => {
    //     if (response.code === "000") {
    //       // File upload successful
    //       message.success(`${file.name} uploaded successfully.`);
    //     } else {
    //       // File upload failed
    //       message.error('Upload failed');
    //     }
    //   })
    //   .catch((error) => {
    //     // Handle any error that occurred during the upload
    //     console.error('File upload error:', error);
    //     message.error('An error occurred during file upload.');
    //   });

    setCurriculum(formValues);

    api.postCurriculum(curriculum)
      .then((json) => {
        if(json.code === '000'){
          console.log(json.data)
        }
        else console.log(json.message)
      })
      .catch((err) => console.log(err))
  };

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
          width: 900
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
              options={nameList}
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
          <Form.Item>
            <div style={{ marginLeft: '500px', marginTop: '-170px', width: '240px'}}>
              <Upload
                action={`${api.hostname_be}/file/upload`}
                accept=".doc, .docx"
                listType="picture"
                maxCount={1}
                beforeUpload={ handleBeforeUpload }
              >
                <Button icon={<UploadOutlined />}>上傳教案紙</Button>
              </Upload>
            </div>
          </Form.Item>
        </Form>
        <Button 
          type="dashed" 
          icon={<UploadOutlined />} 
          size='large' 
          style={{ width: '850px' }}
          onClick={ uploadClick } 
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
