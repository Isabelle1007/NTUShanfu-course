import './EditProfile.css'
import { useState, useEffect, useContext } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";

import { Card, Button, Radio, Form, Input, Select } from 'antd';
import { CheckCircleOutlined, CloseSquareOutlined } from '@ant-design/icons';
const { Option } = Select;
import Swal from 'sweetalert2'

import { api } from '../utils/api'

const EditProfile = () => {

  const { semesters } = useContext(FilterContext);

  const [ formValues, setFormValues ] = useState({
    'name': '',
    "home": "",
    "group": "",
    "join_semester": "",
    "gender": "",
    "major": "",
  });

  const handleInputChange = (fieldName, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  const onSubmit = async () => {

    // input data check
    let isFormValuesComplete = true;
    const keys = Object.keys(formValues);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = formValues[key];

      if (value.length === 0) {
        isFormValuesComplete = false;
        break;
      }
    }

    const text_info_missing = `
    <div>
      <span>請填入完整個人資訊</span><br>
      <span>Please fill in all information</span>
    </div>
  `
    if(!isFormValuesComplete){
      Swal.fire({
        title: 'Error!',
        html: text_info_missing,
        icon: 'error',
        confirmButtonText: 'OK',
        allowOutsideClick: false 
      })
      return
    }

    const text_finish_edit = `
      <div>
        <span>確定完成編輯？</span><br>
        <span>Finished editing?</span>
      </div>
    `
    const text_edit_fail = `
      <div>
        <span>個資編輯失敗</span><br>
        <span>Failed to edit personal information</span>
      </div>
    `
    const text_edit_success = `
      <div>
        <span>個資編輯成功</span><br>
        <span>Successfully Edited</span>
      </div>
    `
    Swal.fire({
      title: 'Warning!',
      html: text_finish_edit,
      icon: 'warning',
      confirmButtonText: '確認編輯 Confirm Edit',
      showCancelButton: true,
      cancelButtonText: '取消 Cancel',
      allowOutsideClick: false 
    }).then((result) => {
      if(result.isConfirmed){
        try {
          const jwtToken = window.localStorage.getItem('jwtToken');
          api.putUserProfile(jwtToken, formValues)
          .then((json) => {
            if (json.code != '000'){
              Swal.fire({
                title: 'Error!',
                html: text_edit_fail,
                icon: 'error',
                confirmButtonText: 'OK',
                allowOutsideClick: false 
              })
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
                  window.location.href = '/myProfile'
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
    
  };

  const cancel_edit = `
    <div>
      <span>確定取消編輯？所有更動將不會保存</span><br>
      <span>Sure to cancel edit? Changes will not be saved</span>
    </div>
  `
  const backToProfile = () => {
    Swal.fire({
      title: 'Warning!',
      html: cancel_edit,
      icon: 'warning',
      confirmButtonText: '確定取消 Confirm Cancel',
      showCancelButton: true,
      cancelButtonText: '繼續編輯 Keep Editing',
      allowOutsideClick: false 
    }).then((result) => {
      if(result.isConfirmed)
        window.location.href = '/myProfile'
    })
  }

  useEffect(() => {
    const jwtToken = window.localStorage.getItem('jwtToken');
    api.getUserInfo(jwtToken).then((json) => {
      if(json.data){
        handleInputChange("name", json.data.name)
        handleInputChange("home", json.data.home)
        handleInputChange("group", json.data.group)
        handleInputChange("join_semester", json.data.join_semester)
        handleInputChange("gender", json.data.gender === "M"? "男" : "女")
        handleInputChange("major", json.data.major)
      }
    });
    }, []
  );

  return (
    <>
      <Header/>
      <div className="editProfile__container">
      <Card
        title={<span className="custom-card-title-editProfile">編輯個人資料 Edit Personal Information</span>}
        bordered={true}
        style={{
          width: 1000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Form
          labelCol={{ span: 8 }}
          labelAlign='left'
          layout="horizontal"
          style={{
            width: 800,
          }}
        >
           <Form.Item
            label={<span className="custom-label-editProfile">姓名 Name</span>}
            tooltip="請填寫真實姓名 Please fill in your real name"
          >
            <Input 
              value={formValues['name']}  
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label={<span className="custom-label-editProfile">家別 Division</span>}
          >
            <Radio.Group 
              className="custom-radio-group"
              value={formValues['home']}
              onChange={(e) => handleInputChange('home', e.target.value)}
            >
              <Radio value="加拿"><span className="custom-option-editProfile">加拿</span></Radio>
              <Radio value="新武"><span className="custom-option-editProfile">新武</span></Radio>
              <Radio value="霧鹿"><span className="custom-option-editProfile">霧鹿</span></Radio>
              <Radio value="利稻"><span className="custom-option-editProfile">利稻</span></Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label={<span className="custom-label-editProfile">功能組 Group</span>}
          >
            <Radio.Group 
              className="custom-radio-group"
              value={formValues['group']}
              onChange={(e) => handleInputChange('group', e.target.value)}
            >
              <Radio value="志工"><span className="custom-option-editProfile">志工</span></Radio>
              <Radio value="公關"><span className="custom-option-editProfile">公關</span></Radio>
              <Radio value="教案"><span className="custom-option-editProfile">教案</span></Radio>
              <Radio value="財務"><span className="custom-option-editProfile">財務</span></Radio>
              <Radio value="文書"><span className="custom-option-editProfile">文書</span></Radio>
              <Radio value="平課"><span className="custom-option-editProfile">平課</span></Radio>
              <Radio value="無"><span className="custom-option-editProfile">無</span></Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label={<span className="custom-label-editProfile">入團期別 Semester</span>}
          >
             <Select
                value={formValues['join_semester']} 
                onChange={(value) => handleInputChange('join_semester', value)}
              >
                {
                  semesters.map((s) => (
                    <Select.Option value={s.key} onChange={(value) => handleInputChange('join_semester', value)}>{s.key} </Select.Option>
                  ))
                }
              </Select>
          </Form.Item>

          <Form.Item
            label={<span className="custom-label-editProfile">生理性別 Gender</span>}
          >
            <Radio.Group 
              className="custom-radio-group"
              value={formValues['gender']}
              onChange={(e) => handleInputChange('gender', e.target.value)}
            >
              <Radio value="男"><span className="custom-option-editProfile">男</span></Radio>
              <Radio value="女"><span className="custom-option-editProfile">女</span></Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label={<span className="custom-label-editProfile">系級 Grade</span>}
          >
            <Input 
              value={formValues['major']} 
              onChange={(e) => handleInputChange('major', e.target.value)}
            />
          </Form.Item>

          <Button 
            type="dashed"
            size="large"
            htmlType="submit"
            icon={<CheckCircleOutlined />} 
            style={{
              width: '100%',
              marginTop: '10px',
            }}
            onClick={onSubmit}
          >完成編輯 Confirm Edit</Button>

          <Button 
            type="dashed"
            size="large"
            htmlType="submit"
            icon={<CloseSquareOutlined />} 
            style={{
              width: '100%',
              marginTop: '10px',
              marginBottom: '20px'
            }}
            onClick={backToProfile}
          >取消編輯 Cancel Edit</Button>

        </Form>
        </Card>
      </div>
      <Footer/>
    </>
  );
}

export default EditProfile;
