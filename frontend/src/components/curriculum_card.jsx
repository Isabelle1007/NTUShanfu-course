import { useState, useEffect, useContext } from 'react';

import { HeartOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
const { Meta } = Card;

import { FilterContext } from "../App";

import './curriculum_card.css'

const Curriculum = ({id}) => {

    const { colors } = useContext(FilterContext);

    return (
        <div className='curriculum'>
            <Card
                style={{
                    width: 300,
                }}
                cover={
                <img
                    alt="picture_example"
                    src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                />
                }
                actions={[
                    <HeartOutlined key="favorite" />,
                    <EllipsisOutlined key="ellipsis" />,
                ]}
            >
                <Meta
                    avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
                    title="Card title"
                    description="This is the description"
                />
            </Card>
        </div>
    );
}
export default Curriculum;