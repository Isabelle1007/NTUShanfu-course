import { useContext } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";

import './SignUp.css'

import { AutoComplete, Button, Radio, Cascader, Checkbox, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { useState } from 'react';
const { Option } = Select;

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
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <>
      <Header/>
      <div className="signup__container">
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
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
            <Input />
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
            <Input.Password />
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
            <Input />
          </Form.Item>

          <Form.Item 
            name="gender"
            label="生理性別"
            rules={[
              {
                required: true,
                // message: 'Please select gender!',
              },
            ]}
          >
            <Radio.Group 
              style={{ marginLeft: '-70px' }} 
            >
              <Radio value="加拿"> 男 </Radio>
              <Radio value="新武"> 女 </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="phone"
            label="手機號碼"
            rules={[
              {
                required: false,
                message: 'Please input your phone number!',
              },
            ]}
          >
            <Input
              style={{ width: '100%' }}
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
            >註冊</Button>
          </Form.Item>

        </Form>
      </div>
      <Footer/>
    </>
  );
}

export default LogIn;
