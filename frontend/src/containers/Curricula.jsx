import { useState, useEffect, useContext } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";

import { Avatar, Card, Divider, Spin } from 'antd';
const { Meta } = Card;
import { HeartOutlined, EllipsisOutlined, LoadingOutlined } from '@ant-design/icons';

import { api } from '../utils/api'

import './Curricula.css'

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 48,
    }}
    spin
  />
);

function ShowCurrirula() {

  const [curricula, setCurricula] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    let isFetching = false;
    const intersectionObserver = new IntersectionObserver(() => {
      if (isFetching) return;

      const home = new URLSearchParams(location.search).get('home');
      const type = new URLSearchParams(location.search).get('type');
      const semester = new URLSearchParams(location.search).get('semester');
      const keyword = new URLSearchParams(location.search).get('keyword');

      function fetchProducts() {
        if (home) {
          return api.getCurriculaByHome(home);
        }
        if (type) {
          return api.getCurriculaByType(type);
        }
        if (semester) {
          return api.getCurriculaBySemester(semester);
        }
        if (keyword) {
          return api.getCurriculaByKeyword(keyword);
        }
        return api.getAllCurricula();
      }

      fetchProducts().then((json) => {
        if(json.data){
          setCurricula((prev) => [...prev, ...json.data]);
        }
        isFetching = true;
        setLoading(false);
      });
    });
    intersectionObserver.observe(document.querySelector('.waypoint'));
  }, []);
  
  const AvatarWithText = ({ array }) => (
    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
       <div style={{display: 'flex', alignItems: 'center'}}>
        {
          array.map((user, index) => (
            <div key={index} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <Avatar src={user.picture_url} style={{ marginLeft: '8px', marginRight: '8px' }} />
              <span style={{fontSize:'12px'}}>{user.name}</span>
            </div>
          ))
        }
       </div>
    </div>
  );

  return (
    <>
          {
            loading ? ( <Spin indicator={antIcon} size="large"/>):(
              curricula.length === 0 ? (
                <p style={{fontSize: '24px'}}>尚無教案紙</p>
              ):(
                <div className="curricula__container">
                  {
                    curricula.map((curriculum) => (
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
                              avatar={<AvatarWithText array={curriculum.author}/>}
                              title={curriculum.title}
                              description={`${curriculum.home} / ${curriculum.semester} / ${curriculum.type}`}
                            /> 
                          </Card>
                        </a>
                    ))
                  }
                  </div>
              )
            )
          }
        <div className="waypoint"></div>
      </>
  );
}

const Curricula = () => {

  const { colors } = useContext(FilterContext);
  
  return (
    <>
      <Header/>
      <ShowCurrirula />
      <Footer/>
    </>
  );
};

export default Curricula;
