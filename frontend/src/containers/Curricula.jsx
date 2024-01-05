import { useState, useEffect, useContext } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";
import CurriculumCard from "../components/curriculum_card";

import { Avatar, Card, Divider, Spin, Empty } from 'antd';
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

      function fetchCurricula() {
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

      fetchCurricula().then((json) => {
        if(json.data){
          setCurricula((prev) => [...prev, ...json.data]);
        }
        isFetching = true;
        setLoading(false);
      });
    });
    intersectionObserver.observe(document.querySelector('.waypoint'));
  }, []);

  return (
    <>
          {
            loading ? ( <Spin indicator={antIcon} size="large"/>):(
              curricula.length === 0 ? (
                <Empty />
              ):(
                <div className="curricula__container">
                  {
                    curricula.map((curriculum) => (
                      < CurriculumCard curriculum={curriculum} key={curriculum.id} />
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
