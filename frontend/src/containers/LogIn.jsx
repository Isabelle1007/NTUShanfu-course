import { useState, useContext } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";

import { Button, Form, Input } from 'antd';
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

  const { colors } = useContext(FilterContext);

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
                window.location.href = `/`;
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
          >
            <Input.Password 
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
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
            >登入</Button>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button 
              type="link"
            ><a href={`${api.hostname_fe}/signup`} target="_self" rel="noreferrer">尚未註冊？</a></Button>
          </Form.Item>
        </Form>
        
      </div>
      <Footer/>
    </>
  );
}

export default LogIn;
