import { useContext } from "react";
import { useParams } from 'react-router-dom';
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";

const Search = () => {

  const { colors } = useContext(FilterContext);
  const searchKeyword = useParams().keyword;
  return (
    <>
      <Header/>
      <h2>This is Search page</h2>
      {searchKeyword && <p>Keyword: {searchKeyword}</p>}
      <Footer/>
    </>
  );
}

export default Search;
