import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './containers/Home'
import Main from './containers/Main'
import Search from './containers/Search'
import Profile from './containers/Profile'
import LogIn from './containers/LogIn'

import './App.css'

const colors = {
  colorPrimary: '#FF8702',  //orange
  colorGray: '#979797', 
  colorGreen: '#A2B8B1',
  colorBrown: '#B19A82',
  colorLightOrange: '#C48E67',
  colorCoralRed: '#BA8B80',
  colorWhite: '#FFFFFF'
}

export const FilterContext = React.createContext();

function App() {

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log('useEffect in App.jsx')
  }, [])
  
  return (
    <FilterContext.Provider 
      value={{
        loading, setLoading, colors
      }}
    > 
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/curricula/home/:home" element={<Main/>} />
          <Route exact path="/curricula/type/:type" element={<Main/>} />
          <Route exact path="/curricula/semester/:semester" element={<Main/>} />
          <Route exact path="/curricula/search/:keyword" element={<Search/>} />
          <Route exact path="/profile" element={<Profile/>} />
          <Route exact path="/login" element={<LogIn/>} />
        </Routes>
      </BrowserRouter>
    </FilterContext.Provider>
  )
}

export default App
