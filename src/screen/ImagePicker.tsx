import React, { useState } from "react";
import { Input, Checkbox, Button, Row, Col, message, Space, Image, Empty } from "antd";
import api from "../apis/http";
import { appUrls } from "../apis/urls";
interface ImagePick {
  id: number;
  image_url: string;
  description: string;
}

const ImagePicker = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [crawlQuery, setCrawlQuery] = useState("");
  const [selectedImages, setSelectedImages] = useState<(string | number)[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImagePick[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [loadingPushImg, setLoadingPushImg] = useState(false);
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const handleCrawl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCrawlQuery(e.target.value);
  };

  const handleSelectImage = (checkedValues: (string | number)[]) => {
    setSelectedImages(checkedValues);
  };

  const handleSave = async () => {
    if (selectedImages.length === 0) {
      message.warning("Vui lòng chọn ít nhất một hình ảnh để lưu.");
      return;
    }
    const imagesToSave = selectedImages.map((id) => 
      filteredImages[id as any]
    );
    try {
      setLoadingPushImg(true)
      const res = await api.post(
        `${appUrls.dataURL}/crawl/push-image`, {
          listImage: imagesToSave
        }
      );
      console.log(res.data);
    } catch (error: any) {
      const errorMessage = error.response.data.detail || 'An error occurred';
      console.error("Error fetching data:", errorMessage);
      message.error(errorMessage);
    } finally {
      setLoadingPushImg(false);
    }
      
    console.log("Filtered images to save:", imagesToSave);
    message.success("Lưu ảnh thành công!");
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedImages([]);
    } else {
      const allImageIds = filteredImages.map((image) => image.id);
      setSelectedImages(allImageIds);
    }
    setSelectAll(!selectAll);
  };
  const handleFetchSearch = async () => {
    setLoading(true);
    try {
      const res = await api.post(
        `${appUrls.dataURL}/crawl/google-image`, {
            query: searchQuery
        }
      );
      setFilteredImages(res.data);
    } catch (error: any) {
      const errorMessage = error.response.data.detail || 'An error occurred';
      console.error("Error fetching data:", errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchCrawl = async () => {
    setLoading(true);
    try {
      const res = await api.post(
        `${appUrls.dataURL}/crawl/crawl-image`, {
            query: crawlQuery
        }
      );
      if(res.data) {
        setFilteredImages(res.data);
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || 'An error occurred';
      console.error("Error fetching data:", errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <div style={{ width: "100%", margin: "20px auto" }}>
      <Space>
        
      <Space direction="horizontal">
        <Input
          placeholder="Tìm kiếm hình ảnh..."
          value={searchQuery}
          onChange={handleSearch}
        />
        <Button onClick={handleFetchSearch} loading={loading}>
          Google Search
        </Button>
      </Space>
      <Space direction="horizontal">
        <Input
          placeholder="URL Query"
          value={crawlQuery}
          onChange={handleCrawl}
        />
        <Button onClick={handleFetchCrawl} loading={loading}>
          Crawl Search
        </Button>
      </Space>
      </Space>
      <Button
        type="primary"
        onClick={handleSelectAll}
        style={{ marginTop: "20px", marginBottom: "20px", width: "100%" }}
      >
        {selectAll ? "Bỏ chọn tất cả" : "Chọn tất cả"}
      </Button>

      <Row gutter={[16, 16]}>
        {filteredImages ? (filteredImages.map((item) => (
          <Col span={4} key={item.id}>
            <Checkbox 
              value={item.image_url}
              checked={selectedImages.includes(item.id)}
              onChange={(e) =>
                handleSelectImage(
                  e.target.checked
                    ? [...selectedImages, item.id]
                    : selectedImages.filter((id) => id !== item.id)
                )
              }
            >
              <div style={{ textAlign: "center" }}>
                <Image
                  src={item.image_url}
                  alt={item.description}
                  style={{ width: "150px", height: "150px", objectFit: "cover", marginBottom: "8px" }}
                />
                <div>{item.description}</div>
              </div>
            </Checkbox>
          </Col>
        ))) : (<Empty description="no data"/>)}
      </Row>

      <Button
        type="primary"
        onClick={handleSave}
        style={{ marginTop: "20px", width: "100%" }}
        loading={loadingPushImg}
      >
        Lưu ảnh đã chọn
      </Button>
    </div>
  );
};

export default ImagePicker;
