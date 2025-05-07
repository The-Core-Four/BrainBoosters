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
          borderRadius: 20,
          overflow: "hidden",
          marginBottom: 28,
          boxShadow: "0 12px 30px rgba(90, 155, 255, 0.2)",
          border: `1px solid ${themeColors.border}`,
          background: `linear-gradient(135deg, ${themeColors.cardBg}, ${themeColors.cardBgSecondary || "#f5f7fa"})`,
          transition: "box-shadow 0.4s ease, transform 0.4s ease",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          transform: "translateY(0)",
          cursor: "pointer",
        }}
      >

        {/* Card Header */}
        <div style={{
          background: themeColors.gradient,
          padding: "20px 24px",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative Circles */}
          <div
            style={{
              position: "absolute",
              right: -40,
              top: -40,
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.12)",
              zIndex: 1
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 20,
              bottom: -50,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.1)",
              zIndex: 1
            }}
          />
          {/* Title and Date */}
          <Row justify="space-between" align="middle" style={{ position: "relative", zIndex: 2 }}>
            <Col>
              <Title level={4} style={{ margin: 0, color: "white", fontWeight: 600 }}>
                Skill Sharing Post
              </Title>
            </Col>
            <Col>
              <Text style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: 14 }}>
                {new Date(plan.createdAt || Date.now()).toLocaleDateString()}
              </Text>
            </Col>
          </Row>
        </div>
        {/* Media Section */}
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
              height: 180,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: themeColors.surface,
              color: themeColors.textSecondary,
              fontSize: 16,
              fontStyle: "italic",
            }}>
              No media available
            </div>
          )}
        </div>

        {/* Post Content */}
        <div style={{ padding: "20px 24px" }}>
          <Paragraph
            style={{
              fontSize: 15,
              marginBottom: 16,
              whiteSpace: "pre-line",
              color: themeColors.textPrimary,
              lineHeight: 1.6,
            }}
          >
            <InfoCircleOutlined style={{ marginRight: 8, color: themeColors.primary }} />
            <strong>Description:</strong> {plan.mealDetails}
          </Paragraph>

          {/* Actions */}
          <Row justify="space-between" align="middle" style={{ marginTop: 20 }}>
            <Col>
              <Space size="large">
                <Button
                  type="text"
                  icon={liked ? <HeartFilled style={{ color: themeColors.danger }} /> : <HeartOutlined />}
                  onClick={() => setLiked(!liked)}
                  style={{
                    color: liked ? themeColors.danger : themeColors.textSecondary,
                    fontWeight: liked ? 600 : 400
                  }}
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
                  onClick={() => {
                    if (navigator.share) {
                      navigator
                        .share({
                          title: "Check this out!",
                          text: "I'm sharing my skill on this cool platform",
                          url: window.location.href,
                        })
                        .then(() => console.log("Shared successfully"))
                        .catch((error) => console.log("Error sharing", error));
                    } else {
                      alert("Sharing not supported on this browser");
                    }
                  }}
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
                      borderRadius: 10,
                      boxShadow: "0 4px 10px rgba(0, 123, 255, 0.25)",
                      fontWeight: 600,
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => {
                      deletePlan();
                      alert('✅ Your post has been deleted!');
                    }}
                    loading={deleteLoading}
                    danger
                    icon={<DeleteOutlined />}
                    style={{
                      borderRadius: '10px',
                      fontWeight: 600,
                      backgroundColor: '#ff4d4f',
                      border: 'none',
                      color: '#fff',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                      transition: 'transform 0.2s ease',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
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
            style={{ width: "100%", objectFit: "cover" }}
          />
        ) : (
          <video
            src={previewMedia.url}
            controls
            style={{ width: "100%", objectFit: "cover" }}
            autoPlay
          />
        )}
      </Modal>

    </>
  );
};

export default SkillShareCard;