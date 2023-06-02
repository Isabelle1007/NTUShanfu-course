import './UploadCurriculum.css';
import { useContext, useEffect, useState } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";
import { api } from '../utils/api'

import { Card, Button, DatePicker, Form, Input, Radio, Select, Upload, Spin, Space } from 'antd';
import { UploadOutlined, SnippetsOutlined, LoadingOutlined, FileTextOutlined} from '@ant-design/icons';

import Swal from 'sweetalert2'

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 48,
    }}
    spin
  />
);

const UploadCurriculum = () => {

  const { colors, semesters, types } = useContext(FilterContext);

  const [ nameList, setNameList ] = useState([]);

  const [ wordFileData, setWordFileData ] = useState([]);
  const [ pdfFileData, setPdfFileData ] = useState([]);

  const [ wordUploadDone, setWordUploadDone ] = useState(false);
  const [ pdfUploadDone, setPdfUploadDone ] = useState(false);

  const [ loading, setLoading ] = useState(false);

  // const [ click, setClick ] = useState(false);

  const [ formValues, setFormValues ] = useState({
    'title': '',
    'author': [],
    'semester': '',
    'home': '',
    'type': '',
    'last_update': '',
    'file_word': '',
    'file_pdf': ''
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

  const handleBeforeUpload = (e, type) => {
    if(type === 'w'){
      setWordFileData(e)
      // setWordUploadDone(true)
      // setClick(false)
    }
    else{
      setPdfFileData(e)
      // setPdfUploadDone(true)
      // setClick(false)
    }
    return false; // Prevent automatic upload
  };

  const uploadClick = async () => {

    // setClick(true)
    setLoading(true)

    // input data check
    let isFormValuesComplete = true;
    const keys = Object.keys(formValues);

    for (let i = 0; i < keys.length - 2; i++) {
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

    if(!isFormValuesComplete){
      Swal.fire({
        title: 'Error!',
        text: '請填入教案紙完整資訊',
        icon: 'error',
        confirmButtonText: 'OK',
        allowOutsideClick: false 
      })
      setLoading(false)
      return
    }

    if(isFormValuesComplete && (wordFileData.length === 0 || pdfFileData.length === 0)){
      Swal.fire({
        title: 'Oops!',
        text: 'word 及 pdf 檔案未完整上傳',
        icon: 'warning',
        confirmButtonText: 'OK',
        allowOutsideClick: false 
      })
      setLoading(false)
      return
    }

    // if(isFormValuesComplete && !wordUploadDone && !pdfUploadDone){
    //   Swal.fire({
    //     title: 'Are you sure?',
    //     text: "檔案尚未上傳，確定新增教案？",
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonColor: '#3085d6',
    //     cancelButtonColor: '#d33',
    //     confirmButtonText: '確定新增',
    //     cancelButtonText: '返回',
    //   }).then((result) => {
    //     if(!result.isConfirmed) {
    //       return
    //     }else{
    //       // upload without file
    //       api.postCurriculum(formValues)
    //         .then((json) => {
    //           if (json.code != '000'){
    //             console.log(json.message);
    //             Swal.fire({
    //               title: 'Error!',
    //               text: '教案新增失敗',
    //               icon: 'error',
    //               confirmButtonText: 'OK',
    //               allowOutsideClick: false 
    //             })
    //           }else{
    //             Swal.fire({
    //               title: 'Success!',
    //               text: '教案新增成功',
    //               icon: 'success',
    //               confirmButtonText: 'OK',
    //               allowOutsideClick: false 
    //             })
    //           }
    //         })
    //         .catch((err) => console.log(err));
    //         return;
    //     }
    //   })
    // }

    // if(isFormValuesComplete && (wordUploadDone + pdfUploadDone === 1)){
    //   Swal.fire({
    //     title: 'Error!',
    //     text: '請完整上傳兩份檔案',
    //     icon: 'error',
    //     confirmButtonText: 'OK',
    //     allowOutsideClick: false 
    //   })
    //   return
    // }

     // upload with file
    //  if(wordUploadDone && pdfUploadDone){
      let formdata_word = new FormData();
      let formdata_pdf = new FormData();
      formdata_word.append('file', wordFileData);
      formdata_pdf.append('file', pdfFileData);
      formdata_word.append('name', formValues.title)
      formdata_pdf.append('name', formValues.title)
    
      let url1, url2;
      try {
        const fileUploadResponse_word = await api.postFile(formdata_word, 'w');
        const fileUploadResponse_pdf = await api.postFile(formdata_pdf, 'p');
        if (fileUploadResponse_word.code === '000' && fileUploadResponse_pdf.code === '000') {
          url1 = fileUploadResponse_word.data.file_info.Location;
          url2 = fileUploadResponse_pdf.data.file_info.Location;
          handleInputChange('file_word', url1);
          handleInputChange('file_pdf', url2);
          setWordUploadDone(true)
          setPdfUploadDone(true)
        } else {
          // console.log(fileUploadResponse_word.message);
          // console.log(fileUploadResponse_pdf.message);
          setWordUploadDone(false)
          setPdfUploadDone(false)
          return;
        }
      } catch (error) {
        console.log(error);
        setWordUploadDone(false)
        setPdfUploadDone(false)
        return;
      }
    // }
  }

  const checkLogIn = async () => {
    setLoading(true);
    const jwtToken = window.localStorage.getItem('jwtToken');
    if(jwtToken){
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }else{
      Swal.fire('Opps!', '請先登入!', 'error').then((result) => {
          if (result.isConfirmed) {
              window.location.href = '/login';
          }
      });
      setLoading(false);
      return;
    }
  };
  
  useEffect(() => {
    checkLogIn();
    getUsers();
    }, []
  );

  useEffect(() => {
    // create new curriculum
    if( wordUploadDone && pdfUploadDone ){
      setLoading(true)
      api.postCurriculum(formValues)
      .then((json) => {
        if (json.code != '000'){
          Swal.fire({
            title: 'Error!',
            text: '教案新增失敗',
            icon: 'error',
            confirmButtonText: 'OK',
            allowOutsideClick: false 
          })
        }else{
          Swal.fire({
            title: 'Success!',
            text: '教案新增成功',
            icon: 'success',
            confirmButtonText: 'OK',
            allowOutsideClick: false 
          }).then((result) => {
            if(result.isConfirmed){
              setFormValues({})
              setLoading(false)
              window.location.href = '/curriculum/upload'
            }
          })
          
        }
      })
      .catch((err) => console.log(err));
    }  
  }, [wordUploadDone, pdfUploadDone]);

  return (
    <>
      <Header/>
      {
        loading ? <Spin indicator={antIcon} size="large"/> : (
          <div className='upload__container'>
            <Card
               title={
                <Space>
                  <FileTextOutlined style={{ fontSize: '24px', marginTop: '5px' }}/>
                  <span className="custom-card-title-upload">新教案紙</span>
                </Space>
              }
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
                <Form.Item label={<span className="custom-label-upload">教案名稱</span>}>
                  <Input 
                    className='input__box' 
                    value={formValues['title']} 
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </Form.Item>
                <Form.Item label={<span className="custom-label-upload">作者</span>}>
                  <Select
                    mode="multiple"
                    size='middle'
                    onChange={(e) => handleInputChange('author', e)}
                    style={{ width: '600px', marginLeft: '20px'}}
                    options={nameList}
                  />        
                </Form.Item>
                <Form.Item label={<span className="custom-label-upload">家別</span>}>
                  <Radio.Group 
                    style={{ marginLeft: '-70px' }} 
                    value={formValues['home']}
                    onChange={(e) => handleInputChange('home', e.target.value)}
                  >
                    <Radio value="加拿"><span className="custom-option-upload">加拿</span></Radio>
                    <Radio value="新武"><span className="custom-option-upload">新武</span></Radio>
                    <Radio value="霧鹿"><span className="custom-option-upload">霧鹿</span></Radio>
                    <Radio value="利稻"><span className="custom-option-upload">利稻</span></Radio>
                    <Radio value="電光"><span className="custom-option-upload">電光</span></Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label={<span className="custom-label-upload">期數</span>}>
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
                <Form.Item label={<span className="custom-label-upload">科別</span>}>
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
                <Form.Item label={<span className="custom-label-upload">最後編輯日</span>}>
                  <DatePicker 
                    style={{marginLeft: '-170px', width: '240px'}} 
                    onChange={handleDatePickerChange}
                    placeholder='請選擇日期'
                  />
                </Form.Item>
                <Form.Item>
                  <div style={{ marginLeft: '500px', marginTop: '-185px', width: '240px'}}>
                    <Upload
                      accept=".doc, .docx"
                      listType="text"
                      maxCount={1}
                      beforeUpload={(e) => handleBeforeUpload(e, 'w')}
                      onRemove={() => {
                        setWordFileData([]);
                        setWordUploadDone(false)
                      }}
                    >
                      <Button icon={<UploadOutlined />} style={{ width: '200px'}}>上傳教案紙 word</Button>
                    </Upload>
                  </div>
                  <div style={{ marginLeft: '500px', marginTop: '25px', width: '240px'}}>
                    <Upload
                      accept=".pdf"
                      listType="text"
                      maxCount={1}
                      beforeUpload={(e) => handleBeforeUpload(e, 'p')}
                      onRemove={() => {
                        setPdfFileData([]);
                        setPdfUploadDone(false)
                      }}
                    >
                      <Button icon={<UploadOutlined />} style={{ width: '200px'}}>上傳教案紙 pdf</Button>
                    </Upload>
                  </div>
                </Form.Item>
              </Form>
              <Button 
                  type="dashed" 
                  icon={<SnippetsOutlined />} 
                  size='large' 
                  style={{ width: '850px'}}
                  onClick={ uploadClick } 
                >
                  確認上傳
                </Button>
            </Card>
          </div>
        )
      }
      <Footer/>
    </>
  );
}

export default UploadCurriculum;
