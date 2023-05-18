import { useContext } from "react";
import { useNavigate } from 'react-router-dom';

import { FilterContext } from "../App";

import Header from "../components/header";
import Footer from "../components/footer";

import { Button } from 'antd';

const Home = () => {

  const { colors } = useContext(FilterContext);

  const navigate = useNavigate();
  const navTo = (path) => {
      navigate(path); 
  }

  return (
    <>
      <Header/>
      <h2>This is Home page</h2>
      <Button 
          shape="square" 
          size="large"
          style={{
              color: colors.colorWhite,
              backgroundColor: colors.colorPrimary,
              border: 'solid 1px colors.colorWhite', 
              margin: '0px 10px' // u r d l
          }}
          onClick={ () => navTo('/curricula')}
      >查看所有教案紙</Button>
      <Footer/>
    </>
  );
}

export default Home;
