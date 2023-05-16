import { useContext } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";

const Home = () => {

  const { colors } = useContext(FilterContext);

  return (
    <>
      <Header/>
      <h2>This is Home page</h2>
      <Footer/>
    </>
  );
}

export default Home;
