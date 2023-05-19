import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './containers/Home'
import Curricula from './containers/Curricula'
import Curriculum from './containers/Curriculum'
import UploadCurriculum from './containers/UploadCurriculum'
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
  const [homes, setHomes] = useState([]);
  const [types, setTypes] = useState([]);
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    // console.log('useEffect in App.jsx')
  }, [])
  
  return (
    <FilterContext.Provider 
      value={{
        loading, setLoading, colors, homes, setHomes, types, setTypes, semesters, setSemesters
      }}
    > 
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/curricula/all" element={<Curricula/>} />
          <Route exact path="/curricula/*" element={<Curricula/>} />
          <Route exact path="/curriculum/*" element={<Curriculum />} />
          <Route exact path="/curriculum/upload" element={<UploadCurriculum />} />
          <Route exact path="/profile" element={<Profile/>} />
          <Route exact path="/login" element={<LogIn/>} />
        </Routes>
      </BrowserRouter>
    </FilterContext.Provider>
  )
}

export default App
