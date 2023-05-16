import { useContext } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";

const Search = () => {

  const { colors } = useContext(FilterContext);

  return (
    <>
      <Header/>
      <h2>This is Search page</h2>
      <Footer/>
    </>
  );
}

export default Search;
