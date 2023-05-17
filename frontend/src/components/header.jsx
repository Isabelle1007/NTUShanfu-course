import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Menu } from 'antd';
import { HomeOutlined, TagsOutlined, FieldTimeOutlined } from '@ant-design/icons';

import { FilterContext } from "../App";

import { api } from '../utils/api'

import './header.css' 

const Header = () => {

    const { colors } = useContext(FilterContext);

    const [homes, setHomes] = useState([]);
    const [types, setTypes] = useState([]);
    const [semesters, setSemesters] = useState([]);

    const [inputValue, setInputValue] = useState('');
    const [isLogin, setIsLogin] = useState(false);

    const getHomes = async () => {
        try {
            api.getAllHomes().then((json) => {
                const list = json.data.home_name_list;
                const transformedHomes = list.map((home) => ({
                    label: (
                        <a href={`${api.hostname_fe}/curricula/home/${home}`} target="_self" rel="noreferrer">{home}</a>
                    ),
                    key: `${home}`
                }));
                setHomes(transformedHomes);
            })
        } catch (err) {
            console.log(err)
        }
    }

    const getTypes = async () => {
        try {
            api.getAllTypes().then((json) => {
                const list = json.data.type_name_list;
                const transformedTypes = list.map((type) => ({
                    label: (
                        <a href={`${api.hostname_fe}/curricula/type/${type}`} target="_self" rel="noreferrer">{type}</a>
                    ),
                    key: `${type}`
                }));
                setTypes(transformedTypes)
            })
        } catch (err) {
            console.log(err)
        }
    }

    const getSemester = () => {
        const list = []
        for(var i = 23; i > 17; i--){
            const s1 = `${i}冬`
            list.push(s1)
            const s2 = `${i}夏`
            list.push(s2)
        }
        const transformedSemesters = list.map((s) => ({
            label: (
                <a href={`${api.hostname_fe}/curricula/semester/${s}`} target="_self" rel="noreferrer">{s}</a>
            ),
            key: `${s}`
        }));
        setSemesters(transformedSemesters)
    }

    useEffect(() => {
        getHomes();
        getTypes();
        getSemester();
        }, []
    );

    const [current, setCurrent] = useState();
    const items = [
        {
          label: '依家別尋找',
          key: 'home',
          icon: <HomeOutlined />,
          children: homes
        },
        {
            label: '依類別尋找',
            key: 'type',
            icon: <TagsOutlined />,
            children: types
        },
        {
            label: '依期數尋找',
            key: 'semester',
            icon: <FieldTimeOutlined />,
            children: semesters
        },
    ]

    const navigate = useNavigate();

    const refresh = () => {
        navigate('/'); 
    }

    // const navTo = (path) => {
    //     navigate(path);
    // }

    const onClick = (e) => {
        console.log('click ', e);
        setCurrent(e.key);
    };

    return (
        <div className="header">
            <div className='left_div'>
                <a className="header__logo" onClick={() => refresh()} />
                <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} className='menu'/>
            </div>
            <div className='right_div'>
                <input
                    className="header__search-input"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            navigate('/search');
                        }
                    }}
                    onChange={(e) => setInputValue(e.target.value)}
                    value={inputValue}
                />
                <div className="header__links">
                    <a className="header__link" onClick={ isLogin ? () => navToOtherPage('/profile') : () => navToOtherPage('/login')}>
                        <div className="header__link-icon-profile"/>
                    </a>
                </div>
            </div>
        </div>
        
    );
}
export default Header;