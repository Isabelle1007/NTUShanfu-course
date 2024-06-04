import React, { useState, useRef } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Home from './containers/Home'
import Curricula from './containers/Curricula'
import Curriculum from './containers/Curriculum'
import UploadCurriculum from './containers/UploadCurriculum'
import Profile from './containers/Profile'
import SignUp from './containers/SignUp'
import LogIn from './containers/LogIn'
import EditCurriculum from './containers/EditCurriculum'
import EditProfile from './containers/EditProfile' 

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
  const [subjects, setSubjects] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [isLogin, setIsLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userInfo, setUserInfo] = useState({
    "id": "",
    "name": "",
    "account": "",
    "role": "",
    "home": "",
    "group": "",
    "join_semester": "",
    "gender": "",
    "birthday": "",
    "major": "",
    "picture_url": "",
    "email": "",
  });

  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  
  return (
    <FilterContext.Provider 
      value={{
        loading, setLoading, colors, homes, setHomes, subjects, setSubjects, semesters, setSemesters, 
        isLogin, setIsLogin, isAdmin, setIsAdmin, userInfo, setUserInfo, ref1, ref2, ref3, ref4
      }}
    > 
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/" element={<Curricula/>} />
          <Route exact path="/curricula/all" element={<Curricula/>} />
          <Route exact path="/curricula/*" element={<Curricula/>} />
          <Route exact path="/curriculum/*" element={<Curriculum />} />
          <Route exact path="/curriculum/edit/*" element={<EditCurriculum />} />
          <Route exact path="/curriculum/upload" element={<UploadCurriculum />} />
          <Route exact path="/myProfile" element={<Profile/>} />
          <Route exact path="/myProfile/edit" element={<EditProfile/>} />
          <Route exact path="/signup" element={<SignUp/>} />
          <Route exact path="/login" element={<LogIn/>} />
        </Routes>
      </BrowserRouter>
    </FilterContext.Provider>
  )
}

export default App
