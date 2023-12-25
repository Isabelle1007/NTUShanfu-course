import { useState, useContext } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";

import { Card, Button, Radio, Form, Input, Select, DatePicker } from 'antd';
const { Option } = Select;
import Swal from 'sweetalert2'

import { api } from '../utils/api'

import './SignUp.css'

const SignUp = () => {

  const { colors, semesters } = useContext(FilterContext);

  const [form] = Form.useForm();

  const [ formValues, setFormValues ] = useState({
    'name': '',
    'email': '',
    'password': '',
    "picture_url": '',
    "home": "",
    "group": "",
    "join_semester": "",
    "gender": "",
    "birthday": "",
    "department": "",
    "student_id": "",
  });

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
      'birthday': correctDate,
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
      <Card
        title={<span className="custom-card-title-signup">註冊新帳號</span>}
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
          scrollToFirstError
        >
           <Form.Item
            name="name"
            label={<span className="custom-label-signup">姓名</span>}
            tooltip="請填寫真實姓名"
            rules={[
              {
                required: true,
                message: '請輸入姓名',
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
            label={<span className="custom-label-signup">信箱</span>}
            rules={[
              {
                type: 'email',
                message: '電子信箱格式不符',
              },
              {
                required: true,
                message: '請輸入電子信箱',
              },
            ]}
          >
            <Input 
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="custom-label-signup">密碼</span>}
            rules={[
              {
                required: true,
                message: '請輸入密碼',
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
            label={<span className="custom-label-signup">確認密碼</span>}
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: '請再次輸入密碼',
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
            name="home"
            label={<span className="custom-label-signup">家別</span>}
            rules={[
              {
                required: false,
                whitespace: true,
              },
            ]}
          >
            <Radio.Group 
              value={formValues['home']}
              onChange={(e) => handleInputChange('home', e.target.value)}
            >
              <Radio value="1"><span className="custom-option-signup">加拿</span></Radio>
              <Radio value="2"><span className="custom-option-signup">新武</span></Radio>
              <Radio value="3"><span className="custom-option-signup">霧鹿</span></Radio>
              <Radio value="4"><span className="custom-option-signup">利稻</span></Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="group"
            label={<span className="custom-label-signup">功能組</span>}
            rules={[
              {
                required: false,
                whitespace: true,
              },
            ]}
          >
            <Radio.Group 
              value={formValues['group']}
              onChange={(e) => handleInputChange('group', e.target.value)}
            >
              <Radio value="2"><span className="custom-option-signup">志工</span></Radio>
              <Radio value="3"><span className="custom-option-signup">公關</span></Radio>
              <Radio value="4"><span className="custom-option-signup">教案</span></Radio>
              <Radio value="5"><span className="custom-option-signup">財務</span></Radio>
              <Radio value="6"><span className="custom-option-signup">文書</span></Radio>
              <Radio value="7"><span className="custom-option-signup">平課</span></Radio>
              <Radio value="1"><span className="custom-option-signup">無</span></Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="semester"
            label={<span className="custom-label-signup">入團期別</span>}
            rules={[
              {
                required: false,
                whitespace: true,
              },
            ]}
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
            name="gender"
            label={<span className="custom-label-signup">生理性別</span>}
            rules={[
              {
                required: false,
                whitespace: true,
              },
            ]}
          >
            <Radio.Group 
              value={formValues['gender']}
              onChange={(e) => handleInputChange('gender', e.target.value)}
            >
              <Radio value="M"><span className="custom-option-signup">男</span></Radio>
              <Radio value="F"><span className="custom-option-signup">女</span></Radio>
            </Radio.Group>
          </Form.Item>

          {/* <Form.Item
            name="birthday"
            label="生日"
            rules={[
              {
                required: false,
                whitespace: true,
              },
            ]}
          >
            <DatePicker 
              style={{ width: '100%'}} 
              onChange={handleDatePickerChange}
              placeholder='請選擇日期'
            />
          </Form.Item> */}

          <Form.Item
            name="department"
            label={<span className="custom-label-signup">系級</span>}
            rules={[
              {
                required: false,
                whitespace: true,
              },
            ]}
          >
            <Input 
              onChange={(e) => handleInputChange('department', e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="student_id"
            label={<span className="custom-label-signup">學號</span>}
            rules={[
              {
                required: false,
                whitespace: true,
              },
            ]}
          >
            <Input 
              onChange={(e) => handleInputChange('student_id', e.target.value)}
            />
          </Form.Item>

          <Button 
            type="primary" 
            size="large"
            htmlType="submit"
            style={{
              color: colors.colorWhite,
              backgroundColor: colors.colorPrimary,
              width: '100%',
              marginTop: '10px',
                marginBottom: '20px'
            }}
            onClick={onSubmit}
          >註冊</Button>

          <Button 
            type="link"
            size="large"
          ><a href={`${api.app_url}/login`} target="_self" rel="noreferrer">已有帳號？</a></Button>
        </Form>
        </Card>
      </div>
      <Footer/>
    </>
  );
}

export default SignUp;
