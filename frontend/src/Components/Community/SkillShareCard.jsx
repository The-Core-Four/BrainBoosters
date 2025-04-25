import React, { useState } from "react";
import { Card, Carousel, Button, Row, Col, Typography, Modal, Space } from "antd";
import { useSnapshot } from "valtio";
import { UploadOutlined } from "@ant-design/icons";
import state from "../../Utils/Store";
import { 
  EditOutlined, 
  DeleteOutlined, 
  ExpandOutlined,
  ShareAltOutlined,
  InfoCircleOutlined, 
  HeartOutlined,
  HeartFilled,
  MessageOutlined
} from "@ant-design/icons";
import SkillShareService from "../../Services/SkillShareService";

const { Title, Text, Paragraph } = Typography;

// Theme colors
const themeColors = {
  primary: "#4776E6", // Vibrant blue - energizing for brain/cognition
  secondary: "#8E54E9", // Rich purple - associated with creativity and wisdom
  accent: "#00BFFF", // Electric blue for highlights and focus elements
  background: "#F0F5FF", // Light blue-tinted white for a clean, focused look
  surface: "#E6EEFF", // Subtle blue tint for content areas
  cardBg: "#FFFFFF", // Crisp white for cards and content blocks
  textPrimary: "#2A3B52", // Dark blue-gray for readability and focus
  textSecondary: "#5D7599", // Medium blue-gray for secondary information
  border: "rgba(71, 118, 230, 0.15)", // Subtle blue-tinted border
  hover: "#3A65C0", // Darker blue for hover states
  danger: "#FF5252", // Clear red for warnings
  success: "#22C55E", // Fresh green for success messages
  gradient: "linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)", // Blue to purple gradient for dynamic elements
};

const SkillShareCard = ({ plan }) => {
  const snap = useSnapshot(state);
  const [deleteLoading, setIsDeleteLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewMedia, setPreviewMedia] = useState({ url: '', type: 'image' });
  const [liked, setLiked] = useState(false);
  
  const deletePlan = async () => {
    try {
      setIsDeleteLoading(true);
      await SkillShareService.deleteSkillShare(plan.id);
      state.SkillShares = await SkillShareService.getAllSkillShares();
    } catch (error) {
      console.error("Error deleting skill sharing post:", error);
    } finally {
      setIsDeleteLoading(false);
    }
  };
  
  const handlePreview = (url, type) => {
    setPreviewMedia({ url, type });
    setPreviewVisible(true);
  };
  
  const renderMediaItem = (url, type, index) => {
    return type === "image" ? (
      <div key={index} className="media-container" onClick={() => handlePreview(url, type)}>
        <img
          src={url}
          alt={`Media ${index + 1}`}
          style={{ 
            width: "100%", 
            height: 300, 
            objectFit: "cover", 
            borderRadius: 8,
            cursor: "pointer" 
          }}
        />
        <div className="media-overlay">
          <ExpandOutlined style={{ fontSize: 24, color: "white" }} />
        </div>
        <style jsx>{`
          .media-container {
            position: relative;
            overflow: hidden;
          }
          .media-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 123, 255, 0.3);
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .media-container:hover .media-overlay {
            opacity: 1;
          }
        `}</style>
      </div>
    ) : (
      <div key={index} className="media-container">
        <video
          src={url}
          controls
          style={{ 
            width: "100%", 
            height: 300, 
            objectFit: "cover", 
            borderRadius: 8 
          }}
        />
      </div>
    );
  };

  return (
    <>
      <Card
        style={{
          width: "100%",
          borderRadius: 12,
          overflow: "hidden",
          marginBottom: 16,
          boxShadow: "0 4px 12px rgba(90, 155, 255, 0.12)",
          border: `1px solid ${themeColors.border}`
        }}
        bodyStyle={{ padding: 0 }}
        bordered={false}
      >
        <div style={{
          background: themeColors.gradient,
          padding: "16px 20px",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          position: "relative",
          overflow: "hidden"
        }}>
          <div 
            style={{ 
              position: "absolute", 
              right: -30, 
              top: -30, 
              width: 120, 
              height: 120, 
              borderRadius: "50%", 
              background: "rgba(255,255,255,0.15)",
              zIndex: 1
            }} 
          />
          <div 
            style={{ 
              position: "absolute", 
              right: 20, 
              bottom: -40, 
              width: 80, 
              height: 80, 
              borderRadius: "50%", 
              background: "rgba(255,255,255,0.15)",
              zIndex: 1
            }} 
          />
          
          <Row justify="space-between" align="middle" style={{ position: "relative", zIndex: 2 }}>
            <Col>
              <Title level={4} style={{ margin: 0, color: "white" }}>
                Skill Sharing Post
              </Title>
            </Col>
            <Col>
              <Text style={{ color: "rgba(255, 255, 255, 0.8)" }}>
                {new Date(plan.createdAt || Date.now()).toLocaleDateString()}
              </Text>
            </Col>
          </Row>
        </div>
        
        <div style={{ padding: 0 }}>
          {plan.mediaUrls && plan.mediaUrls.length > 0 ? (
            <Carousel
              autoplay={false}
              dots={plan.mediaUrls.length > 1}
              style={{ marginBottom: 16 }}
            >
              {plan.mediaUrls.map((url, index) => (
                renderMediaItem(
                  url, 
                  plan.mediaTypes ? plan.mediaTypes[index] : "image",
                  index
                )
              ))}
            </Carousel>
          ) : (
            <div style={{ 
              height: 150, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              background: themeColors.surface,
              color: themeColors.textSecondary,
              fontSize: 16
            }}>
              No media available
            </div>
          )}
        </div>
        
        <div style={{ padding: "16px 24px", background: themeColors.cardBg }}>
          <Paragraph 
            style={{ 
              fontSize: 15, 
              marginBottom: 16,
              whiteSpace: "pre-line",
              color: themeColors.textPrimary
            }}
          >
            <InfoCircleOutlined style={{ marginRight: 6 }} />
            Description: {plan.mealDetails}
          </Paragraph>
          
          <Row justify="space-between" align="middle" style={{ marginTop: 16 }}>
            <Col>
              <Space size="large">
                <Button 
                  type="text" 
                  icon={liked ? <HeartFilled style={{ color: themeColors.danger }} /> : <HeartOutlined />}
                  onClick={() => setLiked(!liked)}
                  style={{ color: themeColors.textSecondary }}
                >
                  {liked ? "Liked" : "Like"}
                </Button>
                <Button 
                  type="text" 
                  icon={<MessageOutlined />}
                  style={{ color: themeColors.textSecondary }}
                >
                  Comment
                </Button>
                <Button 
                  type="text" 
                  icon={<ShareAltOutlined />}
                  style={{ color: themeColors.textSecondary }}
                >
                  Share
                </Button>
              </Space>
            </Col>
            
            {plan.userId === snap.currentUser?.uid && (
              <Col>
                <Space>
                  <Button
                    onClick={() => {
                      state.seletedSkillShareToUpdate = plan;
                      state.updateSkillShareOpened = true;
                    }}
                    type="primary"
                    icon={<EditOutlined />}
                    style={{ 
                      background: themeColors.primary, 
                      borderColor: themeColors.primary,
                      borderRadius: 8,
                      transition: "all 0.2s",
                      boxShadow: "0 2px 8px rgba(0, 123, 255, 0.2)"
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={deletePlan}
                    loading={deleteLoading}
                    danger
                    icon={<DeleteOutlined />}
                    style={{ 
                      borderRadius: 8,
                      transition: "all 0.2s"
                    }}
                  >
                    Delete
                  </Button>
                </Space>
              </Col>
            )}
          </Row>
        </div>
      </Card>
      
      <Modal
        visible={previewVisible}
        title="Media Preview"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
        width={800}
        centered
        bodyStyle={{ padding: 0 }}
      >
        {previewMedia.type === "image" ? (
          <img
            alt="Preview"
            src={previewMedia.url}
            style={{ width: "100%" }}
          />
        ) : (
          <video
            src={previewMedia.url}
            controls
            style={{ width: "100%" }}
            autoPlay
          />
        )}
      </Modal>
    </>
  );
};

export default SkillShareCard;