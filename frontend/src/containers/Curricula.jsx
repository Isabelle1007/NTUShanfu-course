import { useState, useEffect, useContext } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";

import { api } from '../utils/api'

import './Curricula.css'

function ShowCurrirula() {

  const [curricula, setCurricula] = useState([]);

  useEffect(() => {

    let isFetching = false;

    const intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].intersectionRatio <= 0) return;

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

      isFetching = true;

      fetchProducts().then((json) => {
        if(json.data){
          setCurricula((prev) => [...prev, ...json.data]);
        }
        isFetching = true;
      });
    });
    intersectionObserver.observe(document.querySelector('.waypoint'));
  }, []);

  return (
    <>
      <div className="curricula">
        {
          curricula.length === 0 ? (
            <p>尚無教案紙</p>
          ):(
              curricula.map((curriculum) => (
                <a
                  className="curriculum"
                  key={curriculum.id}
                  href={`${api.hostname_fe}/curriculum?id=${curriculum.id}`}
                >
                  {/* <img src={curriculum.xxx} className="product__image" /> */}
                  <div className="curriculum__title">{curriculum.title}</div>
                  <div className="curriculum__price">期數：{curriculum.semester}</div>
                  <div className="curriculum__price">家別：{curriculum.home}</div>
                  <div className="curriculum__price">類別：{curriculum.type}</div>
                </a>
              ))
          )
        }
      </div>
      <div className="waypoint"></div>
      </>
  );
}

const Curricula = () => {

  const { colors } = useContext(FilterContext);
  
  return (
    <>
      <Header />
      <ShowCurrirula />
      <Footer />
    </>
  );
};

export default Curricula;
