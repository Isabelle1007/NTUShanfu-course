import { Avatar, Card } from 'antd';
const { Meta } = Card;
import { HeartOutlined, EllipsisOutlined } from '@ant-design/icons';

import { api } from '../utils/api'

import './curriculum_card.css' 
const CurriculumCard = ( { curriculum } ) => {

    const AvatarWithText = ({ array }) => (
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
           <div style={{display: 'flex', alignItems: 'center'}}>
            {
              array.map((user, index) => (
                <div key={index} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  <Avatar src={user.picture_url} style={{ marginLeft: '8px', marginRight: '8px' }} />
                  <span style={{fontSize:'12px'}}>{user.name}</span>
                </div>
              ))
            }
           </div>
        </div>
      );

    if (!curriculum) return null; // Add a check for undefined curriculum
      
    const pic = curriculum.pic_url;
    return (
        <a
            className="curriculum"
            key={curriculum.id}
            href={`${api.app_url}/curriculum?id=${curriculum.id}`}
        >
            <Card
            cover={
                <img
                    alt="picture_example"
                    src= {curriculum.pic_url || "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"}
                />
            }
            // actions={[
            //     <HeartOutlined key="favorite"/>,
            //     <EllipsisOutlined key="ellipsis" />
            // ]}
            >
            <Meta
                avatar={<AvatarWithText array={curriculum.author}/>}
                title={`${curriculum.home} / ${curriculum.semester} / ${curriculum.type}`}
                description={curriculum.title}
            /> 
            </Card>
        </a>
    );
}
export default CurriculumCard;