import './Profile.css'
import { useState, useEffect, useContext } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";
import CurriculumCard from "../components/curriculum_card";

import { api } from '../utils/api'

import { Card, Form, Spin, Button, Image, Anchor, Col, Row, Space, message, Upload, Empty } from 'antd';
import { LoadingOutlined, EditOutlined, HeartOutlined, EllipsisOutlined, FileTextOutlined, IdcardOutlined, UploadOutlined, FileImageOutlined} from '@ant-design/icons';
const { Meta } = Card;
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

  const { colors, loading, setLoading, userInfo } = useContext(FilterContext);
  const [ myCurricula, setMyCurricula] = useState([]);
  const [ pictureExist, setPictureExist ] = useState(false);
  const [ pictureURL, setPictureURL ] = useState('');
  const [ favCurricula ] = useState([]);

  useEffect(() => {
    checkLogIn();
    setPictureExist(false);
  }, []);

  useEffect(() => {
    showCurricula();
  }, [userInfo.name]);

  const text_login_first = `
    <div>
      <span>請先登入</span><br>
      <span>Please log in first</span>
    </div>
  `
  const checkLogIn = async () => {
    setLoading(true);
    const jwtToken = window.localStorage.getItem('jwtToken');
    if(jwtToken){
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }else{
      Swal.fire({
        title: 'Opps!', 
        html: text_login_first, 
        icon: 'error'
      }).then((result) => {
          if (result.isConfirmed) {
              window.location.href = '/login';
          }
      });
      setLoading(false);
      return;
    }
  };

  const showCurricula = async () => {
    setLoading(true);
    function fetchProducts() {
      return api.getCurriculumByUserID(userInfo.id)
    }

    fetchProducts().then((json) => {
      if(json.data){
        setMyCurricula((prev) => [...prev, ...json.data]);
      }
      setLoading(false);
    });

  };

  const handleBeforeUpload = (file) => {
    const valid = file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg';
    if (!valid) {
      message.error(`${file.name} is not a png or jpeg file`);
    }
    setPictureURL(file);
    return false;
  };

  const handleUpload = async (info) => {
    if (info.fileList.length > 0) {
      setPictureExist(true)      
    } else {
      setPictureExist(false)
    }
  };

  const confirmUpload = async () => {
    const formData = new FormData();
    formData.append('file', pictureURL);
    formData.append('name', userInfo.name);
    formData.append('format', pictureURL.type.split('/')[1]);
    formData.append('user_email', userInfo.email);
    setLoading(true);
    const text_uploadimg_fail = `
      <div>
        <span>上傳圖片失敗！</span><br>
        <span>Failed to upload image!</span>
      </div>
    `
    try {
      const uploadNewPic = await api.postFile(formData, 'i');
      if(uploadNewPic.code === '000'){
        setLoading(false);
        Swal.fire({
          title: 'Success!',
          text: ' 圖片更新成功',
          icon: 'success',
          confirmButtonText: 'OK',
          allowOutsideClick: false 
        }).then((result) => {
          if(result.isConfirmed){
            setPictureExist(false);
            window.location.href = '/myProfile';
          }
        })
      }else{
        setLoading(false);
        Swal.fire({
          title: 'Opps!', 
          html: text_uploadimg_fail, 
          icon: 'error'
        }).then((result) => {
          if (result.isConfirmed) {
              window.location.href = '/myProfile';
          }
        });
        return;
      }
    }catch(error){
      console.log(error);
      message.error('上傳失敗');
      return;
    }
  };


  const handleEditProfile = async () => {
      window.location.href = '/myProfile/edit';
  };

  return (
    <div>
      <Header/>
      {
        loading ? ( 
        <Spin indicator={antIcon} size="large"/>
        ) : (
          <Row>
            <Col 
              span={1}
            >
              <div
                className="fixed-anchor"
              >
                <Anchor
                  className="custom-anchor"
                  items={[
                    {
                      key: 'myProfile',
                      href: '#profile',
                      title: '個人資訊 Personal Information',
                    },
                    {
                      key: 'myCurriculum',
                      href: '#curri',
                      title: '我的教案 My Courses',
                    },
                    {
                      key: 'myFavorite',
                      href: '#favorite',
                      title: '我的收藏 My Favorite',
                    },
                  ]}
                />
              </div>
            </Col>
            <Col span={23}>
              <div className="profile__sec" id="profile">
                <div className="image__sec">
                  <div className='image__container'>
                    <Image
                      width={200}
                      height={200}
                      style={{borderRadius: '100%'}}
                      src={userInfo.picture_url}
                    />
                  </div>
                    <Upload 
                      beforeUpload={handleBeforeUpload}
                      onChange={handleUpload}
                      accept=".png, .jpeg, .jpg"
                      maxCount={1}
                    >
                      <Button 
                        icon={<FileImageOutlined />}
                        style={{
                          color: colors.colorPrimary,
                          marginTop: '15px',
                          width: '100%',
                        }}
                      >更換新頭貼 Change Picture</Button>
                    </Upload>
                  {pictureExist? 
                    <Button
                      icon={<UploadOutlined />} 
                      style={{ 
                        color: colors.colorPrimary,
                        marginTop: '15px',
                        height: '32px',
                        marginLeft: '3px',
                      }}
                      onClick={ confirmUpload } 
                    > 確認上傳新頭貼 Upload</Button>: 
                    (<></>)
                  }
                </div>
                <div className='profile__container'>
                  <Card
                    title={
                      <Space>
                        <IdcardOutlined style={{ fontSize: '24px', marginTop: '5px' }}/>
                        <span className="custom-card-title-profile">個人資訊 Personal Information</span>
                      </Space>
                    }
                    bordered={true}
                    style={{
                      width: 700,
                      padding: '10px 50px',
                    }}
                  >
                    <Form
                      className="custom-form-p"
                      labelCol={{ span: 8 }}
                      labelAlign="left"
                      layout="horizontal"
                      style={{
                        maxWidth: 600,
                      }}
                    >
                      <Form.Item label="姓名 Name" >
                        <div className='input' >{userInfo.name}</div>
                      </Form.Item>
                      <Form.Item label="性別 Gender" >
                        <div className='input' >{userInfo.gender === 'M'? '男' : '女'}</div>
                      </Form.Item>
                      <Form.Item label="系級 Grade" >
                        <div className='input' >{userInfo.department}</div>
                      </Form.Item>
                      <Form.Item label="入團期別 Semester">
                        <div className='input'>{userInfo.join_semester}</div>
                      </Form.Item>
                      <Form.Item label="家別 Division">
                        <div className='input' >{userInfo.home}</div>
                      </Form.Item>
                      <Form.Item label="功能組 Group">
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
                  />
                </div>
              </div>
              <div className="curricula__sec" id="curri">
                <Space style={{ marginTop: '20px', fontSize: '28px', marginLeft: '20px' }}>
                  <FileTextOutlined />
                  <p>我的教案 My Courses</p>
                </Space>
                {
                  myCurricula.length === 0 ? (<Empty style={{alignSelf: 'center'}}/>) : (<></>)
                }
                <div className="curriculum__con">
                {
                  myCurricula.map((curriculum) => (
                    < CurriculumCard curriculum={curriculum} key={curriculum.id} />
                  ))
                }
                </div>
              </div>
              <div className="favorite__sec" id="favorite">
              <Space style={{ marginTop: '20px', fontSize: '28px', marginLeft: '20px' }}>
                  <HeartOutlined />
                  <p>我的收藏 My Favorite</p>
                </Space>
                {
                  favCurricula.length === 0 ? (<Empty style={{alignSelf: 'center'}}/>) : (<></>)
                }
                <div className="favorite__con">
                {
                  favCurricula.map((curriculum) => (
                    <a
                      className="curriculum"
                      key={curriculum.id}
                      href={`${api.app_url}/curriculum?id=${curriculum.id}`}
                    >
                      <Card
                        cover={
                          <img
                              alt="picture_example"
                              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                          />
                        }
                        actions={[
                            <HeartOutlined key="favorite"/>,
                            <EllipsisOutlined key="ellipsis" />
                        ]}
                      >
                          <Meta
                              avatar={<AvatarWithText array={curriculum.author}/>}
                              title={curriculum.title}
                              description={`${curriculum.home} / ${curriculum.semester} / ${curriculum.type}`}
                            /> 
                      </Card>
                    </a>
                  ))
                }
                </div>
              </div>
            </Col>
          </Row>
        )
    }
    <Footer/>
  </div>
);
}

export default Profile;
