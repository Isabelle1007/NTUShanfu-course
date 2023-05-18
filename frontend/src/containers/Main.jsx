import { useState, useContext } from "react";
import { useParams } from 'react-router-dom';
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";
import Curriculum from '../components/curriculum';

import './Main.css';

const Main = () => {

  const { colors } = useContext(FilterContext);
  const searchHome = useParams().home;
  const searchType = useParams().type;
  const searchSemester = useParams().semester;

  const [curricula, setCurricula] = useState([1,3,4, 8, 10]);

  return (
    <>
      <Header />
      <div className="main">
        {
          curricula?.map((c, id) => (
            <Curriculum key={`c${id}`} id={id} />
          ))
        }
      </div>
      <Footer />
    </>
  );
};

export default Main;
