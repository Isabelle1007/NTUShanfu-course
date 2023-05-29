import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Menu, Input, Button, Drawer } from 'antd';
import { FileTextOutlined, HomeOutlined, TagsOutlined, FieldTimeOutlined, UserOutlined, HeartOutlined, IdcardOutlined, CloudUploadOutlined, DesktopOutlined, SettingOutlined } from '@ant-design/icons';

import { FilterContext } from "../App";

import { api } from '../utils/api'

import './header.css' 

function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
}

const items_user = [
    getItem(
      (
        <a href={`${api.hostname_fe}/signin`} target="_self" rel="noreferrer">註冊/登入</a>
      ), 
      '1', 
      <UserOutlined />
    ),
    getItem('個人頁面', '2', <IdcardOutlined />),
    getItem('我的收藏', '3', <HeartOutlined />),
    getItem(
        (
            <a href={`${api.hostname_fe}/curriculum/upload`} target="_self" rel="noreferrer">上傳教案</a>
        ), 
        '4',
        <CloudUploadOutlined />),
    getItem('後台管理', '5', <DesktopOutlined />),
    getItem('設定', '6', <SettingOutlined />),
]

const Header = () => {

    const { colors, homes, setHomes, types, setTypes, semesters, setSemesters } = useContext(FilterContext);

    const [inputValue, setInputValue] = useState('');
    const [isLogin, setIsLogin] = useState(false);

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    }

    const getHomes = async () => {
        try {
            api.getAllHomes().then((json) => {
                const list = json.data.home_name_list;
                const transformedHomes = list.map((home) => ({
                    label: (
                        <a href={`${api.hostname_fe}/curricula?home=${home}`} target="_self" rel="noreferrer">{home}</a>
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
                        <a href={`${api.hostname_fe}/curricula?type=${type}`} target="_self" rel="noreferrer">{type}</a>
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
            const s1 = `${i}夏`
            list.push(s1)
            const s2 = `${i}冬`
            list.push(s2)
        }
        const transformedSemesters = list.map((s) => ({
            label: (
                <a href={`${api.hostname_fe}/curricula?semester=${s}`} target="_self" rel="noreferrer">{s}</a>
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
          label: (
            <a href={`${api.hostname_fe}/curricula/all`} target="_self" rel="noreferrer">所有教案紙</a>
          ),
          key: 'all',
          icon: <FileTextOutlined/>,
        },
        {
          label: '家別',
          key: 'home',
          icon: <HomeOutlined/>,
          children: homes
        },
        {
            label: '科別',
            key: 'type',
            icon: <TagsOutlined />,
            children: types
        },
        {
            label: '期數',
            key: 'semester',
            icon: <FieldTimeOutlined />,
            children: semesters
        },
    ]

    const navigate = useNavigate();
    const navTo = (path) => {
        navigate(path); 
        window.location.reload();
    }

    const refresh = () => {
        navigate('/'); 
    }

    const onClick = (e) => {
        setCurrent(e.key);
    };

    const { Search } = Input;
    const onSearch = () => {
        navigate(`/curricula?keyword=${inputValue}`);
        window.location.reload();
    }

    return (
        <div className="header">
            <div className='left__div'>
                <a className="header__logo" onClick={() => refresh()} />
                <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} className='menu'/>
                <Search
                    placeholder="請輸入關鍵字搜尋..."
                    allowClear
                    size="large"
                    onChange={(e) => setInputValue(e.target.value)}
                    onSearch={onSearch}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onSearch();
                        }
                    }}
                    style={{
                        width: 300,
                        color: colors.colorDarkOrange,
                        margin: '0px 20px'
                    }}
                />
            </div>
            <div className='right__div'>
                <Button 
                    type="link"
                    size="large"
                    style={{
                        color: colors.colorDarkOrange,
                        margin: '0px 20px 0px 0px'
                    }}
                    onClick={ showDrawer }
                >使用者選單</Button>
                <Drawer
                    title="使用者選單"
                    placement='right'
                    closable={false}
                    onClose={onClose}
                    open={open}
                    key='right'
                >
                    <Menu
                        mode="inline"
                        style={{
                            marginTop: '-10px',
                        }}
                        items={items_user}
                    />
                </Drawer>
            </div>
        </div>
    );
}
export default Header;