import { useContext } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";

const LogIn = () => {

  const { colors } = useContext(FilterContext);

  return (
    <>
      <Header/>
      <h2>This is LogIn page</h2>
      <Footer/>
    </>
  );
}

export default LogIn;
