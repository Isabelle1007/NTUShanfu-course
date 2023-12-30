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
    "department": "",
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

    if(!isFormValuesComplete){
      Swal.fire({
        title: 'Error!',
        text: '請填入完整個人資訊',
        icon: 'error',
        confirmButtonText: 'OK',
        allowOutsideClick: false 
      })
      return
    }

    Swal.fire({
      title: 'Warning!',
      text: '確定完成編輯？',
      icon: 'warning',
      confirmButtonText: '確認編輯',
      showCancelButton: true,
      cancelButtonText: '取消',
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
                text: '個資編輯失敗',
                icon: 'error',
                confirmButtonText: 'OK',
                allowOutsideClick: false 
              })
            }else{
              Swal.fire({
                title: 'Success!',
                text: '個資編輯成功',
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

  const backToProfile = () => {
    Swal.fire({
      title: 'Warning!',
      text: '確定取消編輯？所有更動將不會保存',
      icon: 'warning',
      confirmButtonText: '確定取消',
      showCancelButton: true,
      cancelButtonText: '繼續編輯',
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
        handleInputChange("department", json.data.department)
      }
    });
    }, []
  );

  return (
    <>
      <Header/>
      <div className="editProfile__container">
      <Card
        title={<span className="custom-card-title-editProfile">編輯個人資料</span>}
        bordered={true}
        style={{
          width: 900,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Form
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 27 }}
          layout="horizontal"
          style={{
            width: 700,
          }}
        >
           <Form.Item
            label={<span className="custom-label-editProfile">姓名</span>}
            tooltip="請填寫真實姓名"
          >
            <Input 
              value={formValues['name']}  
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label={<span className="custom-label-editProfile">家別</span>}
          >
            <Radio.Group 
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
            label={<span className="custom-label-editProfile">功能組</span>}
          >
            <Radio.Group 
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
            label={<span className="custom-label-editProfile">入團期別</span>}
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
            label={<span className="custom-label-editProfile">生理性別</span>}
          >
            <Radio.Group 
              value={formValues['gender']}
              onChange={(e) => handleInputChange('gender', e.target.value)}
            >
              <Radio value="男"><span className="custom-option-editProfile">男</span></Radio>
              <Radio value="女"><span className="custom-option-editProfile">女</span></Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label={<span className="custom-label-editProfile">系級</span>}
          >
            <Input 
              value={formValues['department']} 
              onChange={(e) => handleInputChange('department', e.target.value)}
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
          >完成編輯</Button>

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
          >取消編輯</Button>

        </Form>
        </Card>
      </div>
      <Footer/>
    </>
  );
}

export default EditProfile;
