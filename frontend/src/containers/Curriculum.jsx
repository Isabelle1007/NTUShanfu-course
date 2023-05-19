import { useContext, useEffect, useState } from "react";
import { FilterContext } from "../App";
import Header from "../components/header";
import Footer from "../components/footer";

import {  List } from 'antd';

import { api } from '../utils/api'

import './Curriculum.css';

const data = [
  {
    title: '教案名稱',
    key: 'title'
  },
  {
    title: '期數：',
    key: 'semester'
  },
  {
    title: '家別：',
    key: 'home'
  },
  {
    title: '科目類別：',
    key: 'type'
  },
  {
    title: '撰寫者：',
    key: 'author'
  },
  {
    title: '撰寫日期：',
    key: 'created_at'
  },
];

const Curriculum = () => {

  const { colors } = useContext(FilterContext);
  const { curriculum, setCurriculum } = useState([]);
  const id = new URLSearchParams(location.search).get('id');

  useEffect(() => {
    api.getCurriculumByID(id).then((json) => {
      if(json.data){
        setCurriculum(json.data);
      }
    }, []);
  })

  return (
    <>
      <Header/>
      {id && <p>ID: {id}</p>}
      <div className="curriculum__container">
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                // avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${index}`} />}
                title={item.title}
                // description={curriculum[item.key]}
                description="fake description"
              />
            </List.Item>
          )}
        />
      </div>
      <Footer/>
    </>
  );
}

export default Curriculum;
