import { useState, useEffect, useRef } from "react";

import Header from "../components/header";
import Footer from "../components/footer";

import { Spin, Carousel, Image, Button, Tour } from 'antd';

import { S3Client, ListObjectsCommand } from "@aws-sdk/client-s3";
import { LoadingOutlined } from '@ant-design/icons';

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

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageUrls, setImageUrls] = useState([]);

  const steps = [
    {
      title: '所有教案紙',
      description: '查看平台上所有教案紙',
      target: () => ref1.current,
    },
    {
      title: '期數',
      description: '依據期數篩選教案紙',
      target: () => ref2.current,
    },
    {
      title: '家別',
      description: '依據各家篩選教案紙',
      target: () => ref3.current,
    },
    {
      title: '科別',
      description: '依據科目篩選教案紙',
      target: () => ref4.current,
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
          <Header ref1={ref1} ref2={ref2} ref3={ref3} ref4={ref4}/>
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
                {/* <Button type="primary" onClick={() => setOpen(true)}>
                  Begin Tour
                </Button> */}
              </div>
            )
          }
          <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
          <Footer/>
    </>
  );
}

export default Home;
