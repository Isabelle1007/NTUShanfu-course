import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './containers/Home'
import Curricula from './containers/Curricula'
import Curriculum from './containers/Curriculum'
import UploadCurriculum from './containers/UploadCurriculum'
import Profile from './containers/Profile'
import SignUp from './containers/SignUp'
import SignIn from './containers/SignIn'

import './App.css'

const colors = {
  colorPrimary: '#FAAC58', // Orange
  colorSecondary: '#F7BE81', // Light Orange
  colorDarkOrange: '#C48E67',
  colorGray: '#979797', 
  colorGreen: '#A2B8B1',
  colorBrown: '#B19A82',
  colorCoralRed: '#BA8B80',
  colorWhite: '#FFFFFF',
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
          <Route exact path="/signup" element={<SignUp/>} />
          <Route exact path="/signin" element={<SignIn/>} />
        </Routes>
      </BrowserRouter>
    </FilterContext.Provider>
  )
}

export default App
