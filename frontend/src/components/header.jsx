import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// import { Col,Row } from 'antd';
import { Menu } from 'antd';

import { FilterContext } from "../App";
// import logo from '../images/NTUShanfu_primary.png';
// import searchIcon from '../images/search.png';
// import memberIcon from '../images/member.png'

import { getAllHomes, getAllTypes } from '../axios'

import './header.css' 

const Header = () => {

    const { colors } = useContext(FilterContext);

    const [homes, setHomes] = useState(["加拿", "新武", "霧鹿", "利稻", "電光"]);
    const [types, setTypes] = useState(["自然", "社會", "藝文", "英文", "晨讀", "數學", "國文", "文健站", "綜合", "活動", "線上課輔", "其他"]);
    const [inputValue, setInputValue] = useState('');
    const [isLogin, setIsLogin] = useState(false);

    const navigate = useNavigate();

    const refresh = () => {
        navigate('/'); 
    }

    const navToOtherPage = (path) => {
        navigate(path); 
    }

    const getHomes = async () => {
        try {
            let response = getAllHomes();
            console.log(response)
            setHomes(response.home_name_list)
        } catch (err) {
            console.log(err)
        }
    }

    const getTypes = async () => {
        try {
            let response = getAllTypes();
            console.log(response)
            setTypes(response.type_name_list)
        } catch (err) {
            console.log(err)
        }
    }

    // useEffect(() => {
    //     getHomes();
    //     getTypes();
    //     }, []
    // );

    return (
        <div className="header">
            <a className="header__logo" onClick={() => refresh()} />
            <Menu mode="horizontal">
                <Menu.SubMenu key="SubMenu1" title="依家別尋找" className='menu__home'>
                    {
                        homes.map((h, id) => (
                            <>
                            <Menu.Item key={`home${id}`}>
                                {h}
                            </Menu.Item>
                            </>
                        ))
                    }
                </Menu.SubMenu>
                <Menu.SubMenu key="SubMenu2" title="依類別尋找" className='menu__type'>
                    {
                        types.map((t, id) => (
                            <>
                            <Menu.Item key={`type${id}`}>
                                {t}
                            </Menu.Item>
                            </>
                        ))
                    }
                </Menu.SubMenu>
            </Menu>
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
        
    );
}
export default Header;