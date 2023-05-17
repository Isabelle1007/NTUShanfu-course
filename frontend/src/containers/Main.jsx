import { useContext } from "react";
import { useParams } from 'react-router-dom';
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";

const Main = () => {

  const { colors } = useContext(FilterContext);
  const searchHome = useParams().home;
  const searchType = useParams().type;
  const searchSemester = useParams().semester;

  return (
    <>
      <Header />
      <h2>This is Main page</h2>
      {searchHome && <p>Home: {searchHome}</p>}
      {searchType && <p>Type: {searchType}</p>}
      {searchSemester && <p>semester: {searchSemester}</p>}
      <Footer />
    </>
  );
};

export default Main;
