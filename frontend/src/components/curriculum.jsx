import { useState, useEffect, useContext } from 'react';

import { FacebookOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { FilterContext } from "../App";

import './curriculum.css' 
const Curriculum = ({id}) => {

    const { colors } = useContext(FilterContext);

    return (
        <div className='curriculum'>
            <p>This is a curriculum</p>
        </div>
    );
}
export default Curriculum;