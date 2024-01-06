import { useState, useEffect, useContext } from "react";

import Header from "../components/header";
import Footer from "../components/footer";
import ref1Image from '../images/ref1.png';
import ref2Image from '../images/ref2.png';
import ref3Image from '../images/ref3.png';
import ref4Image from '../images/ref4.png';
import ref5Image from '../images/ref5.png';
import ref6Image from '../images/ref6.png';
import ref7Image from '../images/ref7.png';

import { FilterContext } from "../App";

import { Spin, Carousel, Image, Tour, FloatButton } from 'antd';

import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";
import { LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import "./Home.css";

const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 48,
    }}
    spin
  />
);

const Home = () => {

  const { colors } = useContext(FilterContext);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState([]);

  const steps = [
    {
      title: '所有教案紙',
      description: '查看平台上所有教案紙',
      cover: (
        <img
          alt="ref1"
          src={ref1Image}
        />
      ),
      // target: () => ref1.current,
    },
    {
      title: '期數/家別/科別',
      description: '依據不同分類項目篩選教案紙',
      cover: (
        <img
          alt="ref2"
          src={ref2Image}
        />
      ),
      // target: () => ref2.current,
    },
    {
      title: '搜尋關鍵字',
      description: '輸入關鍵字尋找相關教案',
      cover: (
        <img
          alt="ref3"
          src={ref3Image}
        />
      ),
      // target: () => ref3.current,
    },
    {
      title: '登入/註冊',
      description: '登入會員後即可查看個人檔案及上傳教案',
      cover: (
        <img
          alt="ref4"
          src={ref4Image}
        />
      ),
      // target: () => ref4.current,
    },
    {
      title: '更多功能',
      description: '展開使用者選單',
      cover: (
        <img
          alt="ref5"
          src={ref5Image}
        />
      ),
      // target: () => ref5.current,
    },
    {
      title: '個人頁面',
      description: '查看頭像、基本資料以及所有上傳及收藏之教案',
      cover: (
        <img
          alt="ref6"
          src={ref6Image}
        />
      ),
      // target: () => ref6.current,
    },
    {
      title: '上傳教案',
      description: '上傳新教案紙',
      cover: (
        <img
          alt="ref7"
          src={ref7Image}
        />
      ),
      // target: () => ref7.current,
    }
  ];

  useEffect(() => {
    const fetchImageUrls = async () => {

      const s3Client = new S3Client({ 
        region: 'ap-northeast-1',
        credentials: {
          accessKeyId: "AKIA4HQT7FC5HWVKMB7E",
          secretAccessKey: "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",
        }
      });
  
      const command = new ListObjectsCommand({
        Bucket: "doc-file-uploads",
        Prefix: "cover-photo/"
      });
  
      try {
        const data = await s3Client.send(command);
        const folderPath = command.input.Prefix;
        const urls = data.Contents
          .filter(object => object.Key !== folderPath) // Filter out the folder path
          .map(object => 
            `https://doc-file-uploads.s3.ap-northeast-1.amazonaws.com/${object.Key}`
          );
        setImageUrls(urls);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchImageUrls();
  }, []);
  

  return (
      <>
          <Header/>
          {
            loading ? ( <Spin indicator={antIcon} size="large"/>):(
              <div className="carousel-container">
                <Carousel autoplay autoplaySpeed={2500}>
                  {imageUrls.map(url => (
                    <div key={url}>
                      <Image width={700} src={url} />
                    </div>
                  ))}
                </Carousel>
                <FloatButton 
                  tooltip="導覽"
                  icon={
                    <span id="tour-icon-wrapper">
                      <QuestionCircleOutlined style={{ fontSize: '2em' }}/>
                    </span>
                  }
                  style={{
                    backgroundColor: colors.colorPrimary,
                    height: '80px',
                    width: '80px',
                    bottom: '150px',
                    right: '70px',
                    fontSize: '75px'
                  }}
                  onClick={() => setOpen(true)} 
                />
              </div>
            )
          }
          <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
          <Footer/>
          </>
  );
}

export default Home;
