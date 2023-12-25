import { useState, useContext } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";

import { Button, Form, Input, Card } from 'antd';
import Swal from 'sweetalert2'

import { api } from '../utils/api'

import './LogIn.css'

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const LogIn = () => {

  const { colors, userInfo, setUserInfo } = useContext(FilterContext);

  const [form] = Form.useForm();

  const [ formValues, setFormValues ] = useState({
    'email': '',
    'password': ''
  });

  const handleInputChange = (fieldName, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldName]: value,
    }));
  };

  const onSubmit = async () => {
    try {
      let signIpInfo = formValues
      api.login(signIpInfo).then((json) => {
          if(json.code === "000"){
            Swal.fire({
              title: 'Success!',
              text: '登入成功',
              icon: 'success',
              confirmButtonText: 'OK',
              allowOutsideClick: false 
            }).then((result) => {
              if (result.isConfirmed){
                const jwtToken = json.data.access_token;
                window.localStorage.setItem('jwtToken', jwtToken);
                if(jwtToken){
                    // setIsLogin(true)
                    api.getUserInfo(jwtToken).then((json) => {
                        if(json.code === "000"){
                            const newInfo = {
                                "id": json.data.id,
                                "name": json.data.name,
                                "email": json.data.email,
                                "role": json.data.role,
                                "home": json.data.home,
                                "group": json.data.group,
                                "join_semester": json.data.join_semester,
                                "gender": json.data.gender,
                                "birthday": json.data.birthday,
                                "department": json.data.department,
                                "picture_url": json.data.picture_url
                            }
                            setUserInfo(newInfo)
                        }
                    })
                } 
                window.location.href = `/myProfile`;
              }
            })
          }else{
            Swal.fire({
              title: 'Error!',
              text: '登入失敗',
              icon: 'error',
              confirmButtonText: 'OK',
              allowOutsideClick: false 
            })
          }
      })
    }catch (err) {
        console.log(err)
    }
  };

  return (
    <>
      <Header/>
      <div className="login__container">
      <Card
        title={<span className="custom-card-title-login">登入</span>}
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
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 28 }}
          layout="horizontal"
          form={form}
          style={{
            width: 700,
          }}
          scrollToFirstError
        >

          <Form.Item
            name="email"
            label={<span className="custom-label-login">信箱</span>}
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input 
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="custom-label-login">密碼</span>}
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password 
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
          </Form.Item>

          <Button 
              type="primary" 
              htmlType="submit"
              size="large"
              style={{
                color: colors.colorWhite,
                backgroundColor: colors.colorPrimary,
                width: '100%',
                marginTop: '10px',
                marginBottom: '20px'
              }}
              onClick={onSubmit}
          >登入</Button>

          <Button 
              type="link"
              size="large"
            ><a href={`${api.hostname_fe}/signup`} target="_self" rel="noreferrer">尚未註冊？</a></Button>
        </Form>
        </Card>
      </div>
      <Footer/>
    </>
  );
}

export default LogIn;
