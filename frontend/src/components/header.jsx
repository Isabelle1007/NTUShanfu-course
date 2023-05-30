import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Menu, Input, Button, Drawer } from 'antd';
import { FileTextOutlined, HomeOutlined, TagsOutlined, FieldTimeOutlined, UserOutlined, HeartOutlined, IdcardOutlined, CloudUploadOutlined, DesktopOutlined, SettingOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2'

import { FilterContext } from "../App";

import { api } from '../utils/api'

import './header.css' 

function getItem(label, key, icon) {
    return {
      label,
      key,
      icon
    };
}

const Header = () => {

    const { colors, homes, setHomes, types, setTypes, semesters, setSemesters, isLogin, setIsLogin } = useContext(FilterContext);

    const [inputValue, setInputValue] = useState('');

    const [open, setOpen] = useState(false);

    const [admin, setAdmin] = useState(false);

    const [userID, setUserID] = useState(1)

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    }

    const checkLogIn = async () => {
        const jwtToken = window.localStorage.getItem('jwtToken');
        if(jwtToken) 
            setIsLogin(true)
        else
            setIsLogin(false)
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
        checkLogIn();
        getHomes();
        getTypes();
        getSemester();
        }, []
    );

    useEffect(() => {
        checkLogIn();
        api.getUserInfo().then((json) => {
            if(json.code === "000") console.log(json)
            else console.log('not logged in')
        })
        }, [isLogin]
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

    const handleLogIn = () => {
        if(isLogin){
            // window.location.href = `/logout`
            Swal.fire({
                title: 'Are You Sure?',
                text: '登出帳號嗎',
                icon: 'warning',
                confirmButtonText: '登出',
                showCancelButton: true,
                cancelButtonText: '取消',
                allowOutsideClick: true 
              }).then((result) => {
                if(result.isConfirmed){
                  localStorage.removeItem('jwtToken');

                }
                window.location.href = `/`
              })

        } 
        else window.location.href = `/login`
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
                    type="ghost"
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
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start'}} >
                        <Button 
                            className='userMenu__btn'
                            type="ghost"
                            size="large"
                            icon={<UserOutlined />} 
                            onClick={ handleLogIn }
                        >{isLogin ? "登出" : "註冊/登入"}</Button>
                    
                        <Button 
                            className='userMenu__btn'
                            type="ghost"
                            size="large"
                            icon={<IdcardOutlined />} 
                            onClick={ () => window.location.href = `/profile?id=${userID}`}
                        >個人頁面</Button>

                        <Button 
                            className='userMenu__btn'
                            type="ghost"
                            size="large"
                            icon={<HeartOutlined />} 
                        >我的收藏</Button>

                        <Button 
                            className='userMenu__btn'
                            type="ghost"
                            size="large"
                            icon={<CloudUploadOutlined />} 
                            onClick={ () => window.location.href = `/curriculum/upload`}
                        >上傳教案</Button>

                        <Button 
                            className='userMenu__btn'
                            type="ghost"
                            size="large"
                            icon={<DesktopOutlined />} 
                        >後台管理</Button>

                        <Button 
                            className='userMenu__btn'
                            type="ghost"
                            size="large"
                            icon={<SettingOutlined />} 
                        >設定</Button>
                    </div>

                </Drawer>
            </div>
        </div>
    );
}
export default Header;