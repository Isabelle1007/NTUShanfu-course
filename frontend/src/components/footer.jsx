import { useState, useEffect, useContext } from 'react';

import { FilterContext } from "../App";

const Footer = () => {

    const { colors } = useContext(FilterContext);

    return (
        <div>
            <h1>Footer</h1>
        </div>
    );
}
export default Footer;