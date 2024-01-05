import { useState, useEffect, useContext } from 'react';

import { Menu, Input, Button, Drawer } from 'antd';
import { FileTextOutlined, HomeOutlined, TagsOutlined, CalendarOutlined, UserOutlined, HeartOutlined, IdcardOutlined, CloudUploadOutlined, DesktopOutlined, SettingOutlined, DoubleLeftOutlined } from '@ant-design/icons';
import Swal from 'sweetalert2'

import { FilterContext } from "../App";

import { api } from '../utils/api'

import './header.css' 

const Header = ({ ref1, ref2, ref3, ref4 }) => {

    const { colors, homes, setHomes, types, setTypes, semesters, setSemesters, isLogin, setIsLogin, isAdmin, setIsAdmin, setUserInfo } = useContext(FilterContext);

    const [inputValue, setInputValue] = useState('');

    const [open, setOpen] = useState(false);

    const [userID, setUserID] = useState(1)

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
                        <a href={`${api.app_url}/curricula?home=${home}`} target="_self" rel="noreferrer">{home}</a>
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
                        <a href={`${api.app_url}/curricula?type=${type}`} target="_self" rel="noreferrer">{type}</a>
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
        for(var i = 24; i > 17; i--){
            const s1 = `${i}夏`
            list.push(s1)
            const s2 = `${i}冬`
            list.push(s2)
        }
        const transformedSemesters = list.map((s) => ({
            label: (
                <a href={`${api.app_url}/curricula?semester=${s}`} target="_self" rel="noreferrer">{s}</a>
            ),
            key: `${s}`
        }));
        setSemesters(transformedSemesters)
    }

    const checkLogIn = async () => {
        const jwtToken = window.localStorage.getItem('jwtToken');
        if(jwtToken){
            setIsLogin(true)
            api.getUserInfo(jwtToken).then((json) => {
                if(json.code === "000"){
                    
                    if(json.data.role === "admin") setIsAdmin(true)
                    else setIsAdmin(false)

                    const newInfo = {
                        "id": json.data.id,
                        "name": json.data.name,
                        "email": json.data.email,
                        "role": json.data.role,
                        "home": json.data.home,
                        "group": json.data.group,
                        "join_semester": json.data.join_semester,
                        "gender": json.data.gender,
                        "birthday": json.data.birthday,
                        "department": json.data.department,
                        "picture_url": json.data.picture_url
                    }
                    setUserInfo(newInfo)
                }
            })
        }   
        else{
            setIsLogin(false)
            setIsAdmin(false)
            setUserInfo({
                "id": "",
                "name": "",
                "email": "",
                "role": "",
                "home": "",
                "group": "",
                "join_semester": "",
                "gender": "",
                "birthday": "",
                "department": "",
                "picture_url": ""
            })
        }  
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
        }, [isLogin]
    );

    const [current, setCurrent] = useState();
    const items = [
        {
          label: (
            <a href={`${api.app_url}/curricula/all`} target="_self" rel="noreferrer">所有教案紙</a>
          ),
          key: 'all',
          icon: <FileTextOutlined/>,
          ref: ref1
        },
        {
            label: '期數',
            key: 'semester',
            icon: <CalendarOutlined />,
            children: semesters,
            ref: ref2
        },
        {
          label: '家別',
          key: 'home',
          icon: <HomeOutlined/>,
          children: homes,
          ref: ref3
        },
        {
            label: '科別',
            key: 'type',
            icon: <TagsOutlined />,
            children: types,
            ref: ref4
        }
    ]

    const refresh = () => {
        window.location.href = '/'
    }

    const onClick = (e) => {
        setCurrent(e.key);
    };

    const { Search } = Input;

    const onSearch = () => {
        window.location.href = `/curricula?keyword=${inputValue}`;
    }

    const handleLogIn = () => {
        if(isLogin){
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
                  window.location.href = `/curricula/all`
                }
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
                        fontSize: '18px'
                    }}
                    icon={<UserOutlined />} 
                    onClick={ handleLogIn }
                >{isLogin ? "登出" : "註冊/登入"}</Button>
                <Button 
                    icon={<DoubleLeftOutlined />}
                    type="ghost"
                    size="large"
                    style={{
                        color: colors.colorDarkOrange,
                        margin: '0px 20px 0px 0px',
                        fontSize: '18px'
                    }}
                    onClick={ showDrawer }
                ></Button>
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
                            type="text"
                            size="large"
                            icon={<IdcardOutlined />} 
                            onClick={ () => window.location.href = '/myProfile'}
                        >個人頁面</Button>

                        {/* <Button 
                            className='userMenu__btn'
                            type="text"
                            size="large"
                            icon={<HeartOutlined />} 
                            onClick={() => console.log('Click 我的收藏') }
                        >我的收藏</Button> */}

                        <Button 
                            className='userMenu__btn'
                            type="text"
                            size="large"
                            icon={<CloudUploadOutlined />} 
                            onClick={ () => window.location.href = `/curriculum/upload`}
                        >上傳教案</Button>

                        <Button 
                            className='userMenu__btn'
                            type="text"
                            size="large"
                            icon={<DesktopOutlined />} 
                            disabled={!isAdmin}
                            title={!isAdmin ? "屬於管理帳號權限" : ""}
                            onClick={() => console.log('Click 後台管理') }
                        >後台管理</Button>

                        {/* <Button 
                            className='userMenu__btn'
                            type="text"
                            size="large"
                            icon={<SettingOutlined />} 
                            onClick={() => console.log('Click 設定') }
                        >設定</Button> */}
                    </div>

                </Drawer>
            </div>
        </div>
    );
}
export default Header;