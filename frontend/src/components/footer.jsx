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
            <Button 
                shape="square" 
                icon={<FacebookOutlined />} 
                size="large"
                style={{
                    color: colors.colorWhite,
                    backgroundColor: colors.colorPrimary,
                    border: 'solid 1px colors.colorWhite', 
                    margin: '0px 10px' // u r d l
                }}
                onClick={handleFacebookButtonClick}
            />
            <p style = {{ margin: '0px 10px' }}>© Copyright NTU SHANFU. All Rights Reserved</p>
        </div>
    );
}
export default Footer;