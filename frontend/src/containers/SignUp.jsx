import { useState, useContext } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";

import { Button, Radio, Form, Input, Select } from 'antd';
const { Option } = Select;
import Swal from 'sweetalert2'

import { api } from '../utils/api'

import './SignUp.css'

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

  const { colors } = useContext(FilterContext);

  const [form] = Form.useForm();

  const [ formValues, setFormValues ] = useState({
    'name': '',
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
      let signUpInfo = formValues
      signUpInfo.role = "member"
      api.signUp(signUpInfo).then((json) => {
          if(json.code === "000"){
            Swal.fire({
              title: 'Success!',
              text: '註冊成功',
              icon: 'success',
              confirmButtonText: 'OK',
              allowOutsideClick: false 
            }).then((result) => {
              if (result.isConfirmed){
                window.location.href = '/login';
              }
            })
          }else{
            Swal.fire({
              title: 'Error!',
              text: '註冊失敗',
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
      <div className="signup__container">
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          style={{
            maxWidth: 900,
          }}
          scrollToFirstError
        >
           <Form.Item
            name="name"
            label="姓名"
            tooltip="請填寫真實姓名"
            rules={[
              {
                required: true,
                message: 'Please input your name!',
                whitespace: true,
              },
            ]}
          >
            <Input 
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="信箱"
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
            label="密碼"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password 
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="確認密碼"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button 
              type="primary" 
              htmlType="submit"
              style={{
                color: colors.colorWhite,
                backgroundColor: colors.colorPrimary,
                width: '100%'
              }}
              onClick={onSubmit}
            >註冊</Button>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button 
              type="link"
            ><a href={`${api.hostname_fe}/login`} target="_self" rel="noreferrer">已有帳號？</a></Button>
          </Form.Item>

        </Form>
      </div>
      <Footer/>
    </>
  );
}

export default LogIn;
