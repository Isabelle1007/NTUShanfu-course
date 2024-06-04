import './EditCurriculum.css';
import { useContext, useEffect, useState } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";
import { api } from '../utils/api'

import { Card, Button, DatePicker, Form, Input, Radio, Select, Spin } from 'antd';
import { CheckCircleOutlined, LoadingOutlined, CloseSquareOutlined, DeleteOutlined } from '@ant-design/icons';

import Swal from 'sweetalert2'

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 48,
    }}
    spin
  />
);

const EditCurriculum = () => {

  const { colors, semesters, subjects } = useContext(FilterContext);

  const id = new URLSearchParams(location.search).get('id');

  const [ nameList, setNameList ] = useState([]);

  const [ loading, setLoading ] = useState(false);

  const [ formValues, setFormValues ] = useState({
    'title': '',
    'author': [],
    'semester': '',
    'home': '',
    'subject': '',
    'last_update': '',
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

  const editedClick = async () => {
    // input data check
    let isFormValuesComplete = true;
    const keys = Object.keys(formValues);

    for (let i = 0; i < keys.length; i++) {
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

    const text_missing_data = `
      <div>
        <span>請填入教案紙完整資訊</span><br>
        <span>Please fill in all the information</span>
      </div>
    `
    const text_confirm_edit = `
      <div>
        <span>確定完成編輯？</span><br>
        <span>Sure to confirm edit?</span>
      </div>
    `
    const text_edit_fail = `
      <div>
        <span>教案編輯失敗</span><br>
        <span>Failed to edit the course</span>
      </div>
    `
    const text_edit_success = `
      <div>
        <span>教案編輯成功</span><br>
        <span>Successfully Edited</span>
      </div>
    `
    if(!isFormValuesComplete){
      Swal.fire({
        title: 'Error!',
        html: text_missing_data,
        icon: 'error',
        confirmButtonText: 'OK',
        allowOutsideClick: false 
      })
      setLoading(false)
      return
    }

    Swal.fire({
      title: 'Warning!',
      html: text_confirm_edit,
      icon: 'warning',
      confirmButtonText: '確認編輯 Confirm Edit',
      showCancelButton: true,
      cancelButtonText: '取消 Cancel',
      allowOutsideClick: false 
    }).then((result) => {
      if(result.isConfirmed){
        setLoading(true)
        try {
          const jwtToken = window.localStorage.getItem('jwtToken');
          api.putCurriculum(jwtToken, id, formValues)
          .then((json) => {
            if (json.code != '000'){
              Swal.fire({
                title: 'Error!',
                html: text_edit_fail,
                icon: 'error',
                confirmButtonText: 'OK',
                allowOutsideClick: false 
              })
              setLoading(false)
            }else{
              Swal.fire({
                title: 'Success!',
                html: text_edit_success,
                icon: 'success',
                confirmButtonText: 'OK',
                allowOutsideClick: false 
              }).then((result) => {
                if(result.isConfirmed){
                  setFormValues({})
                  setLoading(false)
                  window.location.href = `/curriculum?id=${id}`
                }
              })
            }
          })
          .catch((err) => console.log(err));
        } catch (error) {
          console.log(error);
          return;
        }
      }
    }) 
  }

  const cancel_edit = `
    <div>
      <span>確定取消編輯？所有更動將不會保存</span><br>
      <span>Sure to cancel edit? Changes will not be saved</span>
    </div>
  `
  const backClick = async () => {
    Swal.fire({
      title: 'Warning!',
      html: cancel_edit,
      icon: 'warning',
      confirmButtonText: '確定取消 Confirm Cencel',
      showCancelButton: true,
      cancelButtonText: '繼續編輯 Keep Editing',
      allowOutsideClick: false 
    }).then((result) => {
      if(result.isConfirmed)
        window.location.href = `/curriculum?id=${id}`
    })
    
  }

  const text_delete = `
    <div>
      <span>確定刪除教案？將無法復原</span><br>
      <span>Sure to delete the course? Cannot be undone</span>
    </div>
  `
  const text_delete_failed = `
    <div>
      <span>教案刪除失敗</span><br>
      <span>Failed to delete the course</span>
    </div>
  `
  const text_delete_success = `
    <div>
      <span>教案已成功刪除</span><br>
      <span>Successfully Deleted</span>
    </div>
  `
  const handleDelete = async () => {
    Swal.fire({
      title: 'Warning!',
      html: text_delete,
      icon: 'warning',
      confirmButtonText: '確定刪除 Confirm Delete',
      showCancelButton: true,
      cancelButtonText: '取消 Cencel',
      allowOutsideClick: false 
    }).then((result) => {
      if(result.isConfirmed)
        try {
          const jwtToken = window.localStorage.getItem('jwtToken');
          api.deleteCurriculum(jwtToken, id)
          .then((json) => {
            if(json.code != '000'){
              Swal.fire({
                title: 'Error!',
                html: text_delete_failed,
                icon: 'error',
                confirmButtonText: 'OK',
                allowOutsideClick: false 
              })
              setLoading(false)
            }else{
              Swal.fire({
                title: 'Success!',
                html: text_delete_success,
                icon: 'success',
                confirmButtonText: 'OK',
                allowOutsideClick: false 
              }).then((result) => {
                if(result.isConfirmed){
                  setFormValues({})
                  setLoading(false)
                  window.location.href = `/curricula/all`
                }
              })
            }
          })
          .catch((err) => console.log(err));
        } catch (error) {
          console.log(error);
          return;
        }
    })
  }
  
  useEffect(() => {
    api.getCurriculumByID(id).then((json) => {
      if(json.data){
        handleInputChange("title", json.data.title)
        handleInputChange("author", json.data.author)
        handleInputChange("home", json.data.home)
        handleInputChange("semester", json.data.semester)
        handleInputChange("subject", json.data.subject)
      }
    });
    getUsers();
    }, []
  );

  return (
    <>
      <Header/>
      {
        loading ? <Spin indicator={antIcon} size="large"/> : (
          <div className='edit__container'>
            <Card
              title="編輯教案 Edit Course"  
              bordered={true}
              style={{
                width: 1000
              }}
            >
              <Form
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                layout="horizontal"
                labelAlign="left"
                style={{
                  maxWidth: 800,
                  padding: '10px 20px',
                }}
              >
                <Form.Item label={<span className="custom-label-upload">教案名稱 Title</span>}>
                  <Input 
                    className='input__box' 
                    value={formValues['title']} 
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                </Form.Item>
                <Form.Item label={<span className="custom-label-upload">作者 Author</span>}>
                  <Select
                    mode="multiple"
                    size='middle'
                    value={formValues['author']}
                    onChange={(e) => handleInputChange('author', e)}
                    style={{ width: '600px'}}
                    options={nameList}
                  />        
                </Form.Item>
                <Form.Item label={<span className="custom-label-upload">家別 Division</span>}>
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
                <Form.Item label={<span className="custom-label-upload">期數 Semester</span>}>
                  <div style={{display: 'flex', flexDirection:'row', width: '240px'}}>
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
                <Form.Item label={<span className="custom-label-upload">科別 Subject</span>}>
                  <div style={{display: 'flex', flexDirection:'row', width: '240px'}}>
                    <Select 
                      value={formValues['subject']}
                      onChange={(value) => handleInputChange('subject', value)}
                    >
                      {
                        subjects.map((t) => (
                          <Select.Option value={t.key} onChange={(value) => handleInputChange('subject', value)}>{t.key}</Select.Option>
                        ))
                      }
                    </Select>
                  </div>
                </Form.Item>
                <Form.Item 
                  label={<span className="custom-label-upload">最後編輯日 Last Update</span>}
                >
                  <DatePicker 
                    // defaultValue={moment(formValues['last_update'])}
                    style={{ 
                      width: '240px',
                      display: 'flex',
                      justifyContent: 'flex-start'
                    }}
                    onChange={handleDatePickerChange}
                    placeholder='請選擇日期'
                  />
                </Form.Item>
              </Form>
            </Card>
            <Button 
              type="dashed" 
              shape="circle"
              icon={<DeleteOutlined />} 
              size='large' 
              style={{
                color: 'red',
                alignSelf: 'end',
                marginTop: '-60px',
                marginRight: '-10px'
              }}
              onClick={ handleDelete } 
            />
            <div style={{display: 'flex', justifyContent:'space-between', alignItems: 'center', marginTop: '30px', width: '1000px'}}>
                <Button 
                  type="dashed" 
                  icon={<CloseSquareOutlined />} 
                  size='large' 
                  style={{ width: '490px'}}
                  onClick={ backClick } 
                >
                  取消編輯 Cancel
                </Button>
                <Button 
                  type="dashed" 
                  icon={<CheckCircleOutlined />} 
                  size='large' 
                  style={{ width: '490px'}}
                  onClick={ editedClick } 
                >
                  完成編輯 Confirm
                </Button>
              </div>
          </div>
        )
      }
      <Footer/>
    </>
  );
}

export default EditCurriculum;
