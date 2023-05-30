import './Profile.css'
import { useState, useEffect, useContext } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";
import { api } from '../utils/api'

import { Card, Form, Spin, Button, Image } from 'antd';
import { LoadingOutlined, EditOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2'

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 48,
    }}
    spin
  />
);

const Profile = () => {

  const { colors, loading, setLoading, userInfo, setUserInfo } = useContext(FilterContext);

  useEffect(() => {
    checkLogIn();
  }, []);

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

  const handleEditProfile = async () => {
    console.log('Click 編輯個人資料')
  };

  return (
    <>
      <Header/>
      {
        loading ? ( <Spin indicator={antIcon} size="large"/>) : (
          <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
            <div className='image__container'>
              <Image
                width={200}
                height={200}
                src={userInfo.picture_url}
              />
            </div>
            <div className='profile__container'>
              <Card
                title={`社員資訊`}
                bordered={true}
                style={{
                  width: 900,
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
                  <Form.Item label="姓名" >
                    <div className='input' >{userInfo.name}</div>
                  </Form.Item>
                  <Form.Item label="性別" >
                    <div className='input' >{userInfo.gender === 'M'? '男' : '女'}</div>
                  </Form.Item>
                  <Form.Item label="系級" >
                    <div className='input' >{userInfo.department}</div>
                  </Form.Item>
                  <Form.Item label="入團期別">
                    <div className='input'>{userInfo.join_semester}</div>
                  </Form.Item>
                  <Form.Item label="家別">
                    <div className='input' >{userInfo.home}</div>
                  </Form.Item>
                  <Form.Item label="功能組">
                    <div className='input' >{userInfo.group}</div>
                  </Form.Item>
                </Form>
              </Card>
              
              <Button 
                type="dashed" 
                shape="circle"
                icon={<EditOutlined />} 
                size='large' 
                style={{
                  color: colors.colorPrimary,
                  alignSelf: 'end',
                  marginTop: '-60px',
                  marginRight: '20px'
                }}
                onClick={ handleEditProfile } 
                disabled
              />
            </div>
          </div>
        )
      }
      <Footer/>
    </>
  );
}

export default Profile;
