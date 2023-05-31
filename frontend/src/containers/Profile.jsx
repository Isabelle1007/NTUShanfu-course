import './Profile.css'
import { useState, useEffect, useContext } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";
import { api } from '../utils/api'

import { Card, Form, Spin, Button, Image, Avatar, Anchor, Col, Row } from 'antd';
import { LoadingOutlined, EditOutlined, HeartOutlined, EllipsisOutlined } from '@ant-design/icons';
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
  const [myCurricula, setMyCurricula] = useState([]);
  const [favCurricula, setFavCurricula] = useState([]);

  useEffect(() => {
    checkLogIn();
  }, []);

  useEffect(() => {
    showCurricula();
  }, [userInfo.name]);

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

  const showCurricula = async () => {
    setLoading(true);
    function fetchProducts() {
      return api.getCurriculaByKeyword(userInfo.name);
    }

    fetchProducts().then((json) => {
      if(json.data){
        setMyCurricula((prev) => [...prev, ...json.data]);
      }
      setLoading(false);
    });

  };

  const handleEditProfile = async () => {
    console.log('Click 編輯個人資料')
  };

  const AvatarWithText = ({ src, text, count }) => (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
       <div style={{display: 'flex', alignItems: 'center'}}>
        {[...Array(count)].map((_, index) => (
          <Avatar key={index} src={src} style={{ marginLeft: '8px', marginRight: '8px' }} />
        ))}
       </div>
      <span>{text}</span>
    </div>
  );

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
                      title: '個人資訊',
                    },
                    {
                      key: 'myCurriculum',
                      href: '#curri',
                      title: '我的教案紙',
                    },
                    {
                      key: 'myFavorite',
                      href: '#favorite',
                      title: '我的收藏',
                    },
                  ]}
                />
              </div>
            </Col>
            <Col span={23}>
              <div className="profile__sec" id="profile">
                <div className='image__container'>
                  <Image
                    width={200}
                    height={200}
                    src={userInfo.picture_url}
                  />
                </div>
                <div className='profile__container'>
                  <Card
                    title={`個人資訊`}
                    bordered={true}
                    style={{
                      width: 900,
                    }}
                  >
                    <Form
                      className="custom-form-p"
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
              <div className="curricula__sec" id="curri">
                <p style={{marginTop: '30px', fontSize: '32px', marginLeft: '50px'}}>我的教案紙</p>
                <div className="curriculum__con">
                {
                  myCurricula.map((curriculum) => (
                    <a
                      className="curriculum"
                      key={curriculum.id}
                      href={`${api.hostname_fe}/curriculum?id=${curriculum.id}`}
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
                              avatar={<AvatarWithText src="https://doc-file-uploads.s3.ap-northeast-1.amazonaws.com/image/default-pic.png" text={curriculum.author.join(' ')} count={curriculum.author.length}/>}
                              title={curriculum.title}
                              description={`${curriculum.home} / ${curriculum.semester} / ${curriculum.type}`}
                          />
                      </Card>
                    </a>
                  ))
                }
                </div>
              </div>
              <div className="favorite__sec" id="favorite">
                <p style={{marginTop: '30px', fontSize: '32px', marginLeft: '50px'}}>我的收藏</p>
                {
                  favCurricula.length === 0 ? (<p style={{alignSelf: 'center', fontSize: 20}}>尚未收藏任何教案紙</p>) : (<></>)
                }
                <div className="favorite__con">
                {
                  favCurricula.map((curriculum) => (
                    <a
                      className="curriculum"
                      key={curriculum.id}
                      href={`${api.hostname_fe}/curriculum?id=${curriculum.id}`}
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
                              avatar={<AvatarWithText src="https://doc-file-uploads.s3.ap-northeast-1.amazonaws.com/image/default-pic.png" text={curriculum.author.join(' ')} count={curriculum.author.length}/>}
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
