import { useState, useEffect, useContext } from "react";
// import { useParams } from 'react-router-dom';
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2'

import { api } from '../utils/api'

import './Profile.css'

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 48,
    }}
    spin
  />
);

const Profile = () => {

  const { colors, loading, setLoading, setIsAdmin, userInfo, setUserInfo } = useContext(FilterContext);
  const userID = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    setLoading(true)
    const jwtToken = window.localStorage.getItem('jwtToken');
    if(jwtToken){
      if(userInfo.id === -1){
        api.getUserInfo(jwtToken).then((json) => {
          if(json.code === "000"){
              if(json.data.role === "admin") setIsAdmin(true)
              else setIsAdmin(false)
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
              setLoading(false)
          }
        })
      }
    }else{
      Swal.fire('Opps!', '請先登入!', 'error').then((result) => {
          if (result.isConfirmed) {
              window.location.href = '/login';
          }
      });
      setLoading(false)
      return;
    }
  },[]);

  return (
    <>
      <Header/>
      {
        loading ? ( <Spin indicator={antIcon} size="large"/>) : (
          <h2>This is Profile page, for user: {userInfo.id}</h2>
        )
      }
      
      
      <Footer/>
    </>
  );
}

export default Profile;
