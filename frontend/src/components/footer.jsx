import { useState, useEffect, useContext } from 'react';

import { FacebookOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { FilterContext } from "../App";

import './footer.css' 
const Footer = () => {

    const { colors } = useContext(FilterContext);

    const handleFacebookButtonClick = () => {
        window.open('https://www.facebook.com/ntuShanFu', '_blank');
      };

    return (
        <div className='footer'>
            <div className='footer__container'>
                <Button 
                    shape="square" 
                    icon={<FacebookOutlined />} 
                    size='middle'
                    style={{
                        color: colors.colorWhite,
                        backgroundColor: '#000000',
                        border: 'solid 1px colors.colorWhite', 
                        margin: '0px 10px' // u r d l
                    }}
                    onClick={handleFacebookButtonClick}
                />
                <p style = {{ margin: '0px 10px' }}>© Copyright NTU SHANFU. All Rights Reserved</p>
            </div>
        </div>
    );
}
export default Footer;