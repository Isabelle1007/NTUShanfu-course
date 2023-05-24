import './UploadCurriculum.css';
import { useContext, useEffect, useState } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";
import { api } from '../utils/api'

import { Card, Button, DatePicker, Form, Input, Radio, Select, Upload, message } from 'antd';
import { UploadOutlined, SnippetsOutlined } from '@ant-design/icons';

import Swal from 'sweetalert2'

const UploadCurriculum = () => {

  const { colors, semesters, types } = useContext(FilterContext);
  const [ nameList, setNameList ] = useState([]);
  const [ fileData, setFileData ] = useState([]);
  const [ uploadDone, setUploadDone ] = useState(false);
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

  const handleBeforeUpload = (e) => {
    setFileData(e)
    return false; // Prevent automatic upload
  };

  const uploadClick = async () => {

    // input data check
    let isFormValuesComplete = true;
    const keys = Object.keys(formValues);

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      const value = formValues[key];

      if (key != 'author') {
        if (value === '') {
          isFormValuesComplete = false;
          break;
        }
      } else {
        if (value.length === 0) {
          isFormValuesComplete = false;
          break;
        }
      }
    }

    if(!isFormValuesComplete || fileData.length === 0){
      Swal.fire({
        title: 'Error!',
        text: '請填入教案紙完整資訊',
        icon: 'error',
        confirmButtonText: 'OK',
        allowOutsideClick: false 
      })
      return
    }

    // upload file
    let formdata = new FormData();
    formdata.append('file', fileData);
    formdata.append('name', 'test_file_name')
  
    let url;
    try {
      const fileUploadResponse = await api.postFile(formdata);
      if (fileUploadResponse.code === '000') {
        url = fileUploadResponse.data.file_info.Location;
        handleInputChange('file', url);
        setUploadDone(true)
      } else {
        console.log(fileUploadResponse.message);
        setUploadDone(false)
        return;
      }
    } catch (error) {
      console.log(error);
      setUploadDone(false)
      return;
    }
  }
  
  useEffect(() => {
    getUsers();
    }, []
  );

  useEffect(() => {
    // create new curriculum
    if(uploadDone === true){
      api.postCurriculum(formValues)
      .then((json2) => {
        if (json2.code != '000'){
          console.log(json2.message);
          message.error('教案新增失敗')
        }else{
          message.success('教案新增成功') 
        }
      })
      .catch((err) => console.log(err));
    }  
  }, [uploadDone]);

  return (
    <>
      <Header/>
      <div className='upload__container'>
      <Card
        title="新教案紙"
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
            height: 370
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
              placeholder='請選擇日期'
            />
          </Form.Item>
          <Form.Item>
            <div style={{ marginLeft: '500px', marginTop: '-170px', width: '240px'}}>
              <Upload
                accept=".doc, .docx"
                listType="picture"
                maxCount={1}
                beforeUpload={(e) => handleBeforeUpload(e)}
                onRemove={() => {
                  setFileData([]);
                  setUploadDone(false)
                }}
              >
                <Button icon={<UploadOutlined />}>上傳教案紙</Button>
              </Upload>
            </div>
          </Form.Item>
        </Form>
        <Button 
          type="dashed" 
          icon={<SnippetsOutlined />} 
          size='large' 
          style={{ width: '850px', marginTop: '-20px'}}
          onClick={ uploadClick } 
        >
           新增教案
        </Button>
      </Card>
      </div>
      <Footer/>
    </>
  );
}

export default UploadCurriculum;
