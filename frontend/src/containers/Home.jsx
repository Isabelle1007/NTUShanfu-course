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
      title: '首頁 Home Page',
      description: (
        <div>
          <span>點擊左上角 NTU Shanfu 之 logo 即可回到平台首頁，瀏覽社團照片及觀看導覽。</span><br/>
          <span>Click on the NTU Shanfu logo in the top left corner to return to the platform's homepage, where you can browse club photos and view a tour.</span>  
        </div>
      )
    },
    {
      title: '所有教案 All Courses',
      description: (
        <div>
          <span>點擊查看平台上所有教案，每份教案將會以卡片呈現，圖為教案紙內關鍵字生成之文字雲。點擊每張卡片即可進入預覽教案紙及查看其基本資訊。</span><br/>
          <span>Click to view all the courses on the platform. Each course will be presented in a card format, with the image showing a word cloud generated from keywords in the curriculum paper. Click on each card to preview the curriculum paper and view its basic information.</span>  
        </div>
      ),
      cover: (
        <img
          alt="ref1"
          src={ref1Image}
        />
      ),
      // target: () => ref1.current,
    },
    {
      title: '期數/家別/科別 semester/division/subject',
      description: (
        <div>
          <span>若欲依據不同分類項目篩選教案，可分別點擊期數/家別/科別來尋找</span><br/>
          <span>If you want to filter the courses based on different categories, you can click on 期數/家別/科別 (semester/division/subject) respectively to search.</span>  
        </div>
      ),
      cover: (
        <img
          alt="ref2"
          src={ref2Image}
        />
      ),
      // target: () => ref2.current,
    },
    {
      title: '搜尋關鍵字 Search keywords',
      description: (
        <div>
          <span>輸入關鍵字尋找相關教案，搜尋標的除了教案基本資訊，也包含教案紙內所有文字，如呈現在教案卡片上之關鍵字。</span><br/>
          <span>Enter keywords to find relevant courses. The search targets not only the basic information of the course but also includes all text within the curriculum papers, such as the keywords displayed on the course cards.</span>
        </div>
      ),
      cover: (
        <img
          alt="ref3"
          src={ref3Image}
        />
      ),
      // target: () => ref3.current,
    },
    {
      title: '登入 Log in (登出 Log Out)',
      description: (
        <div>
          <span>點擊後依照指示進行登入（若為登入狀態下點擊則進行登出），若為新用戶，在登入頁面也可跳轉至註冊頁面。登入後即可查看個人檔案、上傳自己的教案以及下載他人教案紙。</span><br/>
          <span>After clicking, follow the instructions to log in (if you are already logged in, clicking will log you out). If you are a new user, you can also navigate to the registration page from the login page. Once logged in, you can view your personal profile, upload your own courses, and download others' curriculum papers.</span>
        </div>
      ),
      cover: (
        <img
          alt="ref4"
          src={ref4Image}
        />
      ),
      // target: () => ref4.current,
    },
    {
      title: '更多功能 More Functions',
      description: (
        <div>
          <span>點擊此符號展開使用者選單，查看更多登入後的用戶功能。</span><br/>
          <span>Click on this icon to expand the user menu and view more functions available to users after logging in.</span>
        </div>
      ),
      cover: (
        <img
          alt="ref5"
          src={ref5Image}
        />
      ),
      // target: () => ref5.current,
    },
    {
      title: '個人頁面 Personal Page',
      description: (
        <div>
          <span>查看個人頁面，包含頭像、家別、入團期數等基本資料以及所有上傳之教案。</span><br/>
          <span>View the personal page, which includes basic information such as avatar, division, enrollment semester, and all uploaded courses.</span>
        </div>
      ),
      cover: (
        <img
          alt="ref6"
          src={ref6Image}
        />
      ),
      // target: () => ref6.current,
    },
    {
      title: '上傳教案 Upload Courses',
      description: (
        <div>
          <span>上傳教案至平台，依照指示輸入教案基本資訊、並上傳 word 及 pdf 兩種格式之教案紙。</span><br/>
          <span>Upload courses to the platform, following the instructions to enter the basic information of the course and upload the curriculum papers in both Word and PDF formats.</span>
        </div>
      ),
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
                  tooltip="導覽 Tour"
                  icon={
                    <span id="tour-icon-wrapper">
                      <QuestionCircleOutlined style={{ fontSize: '3em' }}/>
                    </span>
                  }
                  style={{
                    backgroundColor: colors.colorPrimary,
                    height: '100px',
                    width: '100px',
                    bottom: '200px',
                    right: '70px',
                    fontSize: '100px',
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
