import { useContext } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";

const Curriculum = () => {

  const { colors } = useContext(FilterContext);
  const id = new URLSearchParams(location.search).get('id');
  return (
    <>
      <Header/>
      <h2>This is Curriculum page</h2>
      {id && <p>ID: {id}</p>}
      <Footer/>
    </>
  );
}

export default Curriculum;
