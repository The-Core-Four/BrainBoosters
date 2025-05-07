import React, { useState } from "react";
import { Modal, Form, Input, Button, Row, Col, Typography, Space, Divider, Tooltip } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import SkillShareService from "../../Services/SkillShareService";
import UploadFileService from "../../Services/UploadFileService";
import { 
  UploadOutlined, 
  DeleteOutlined, 
  InboxOutlined,
  InfoCircleOutlined,
  ShareAltOutlined,
  FileImageOutlined
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const uploader = new UploadFileService();

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

const CreateSkillShareModal = () => {
  const snap = useSnapshot(state);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Call the service to create the Skill Share
      await SkillShareService.createSkillShare({
        ...values,
        userId: snap.currentUser?.uid,
        mediaUrls: mediaFiles.map(file => file.url),
        mediaTypes: mediaFiles.map(file => file.type)
      });
      state.SkillShares = await SkillShareService.getAllSkillShares();
      
      // Reset the form and close the modal on success
      form.resetFields();
      setMediaFiles([]);
      state.createSkillShareOpened = false;
    } catch (error) {
      console.error("Error creating Skill Share:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputChange = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Check if adding these files would exceed the limit
    if (mediaFiles.length + files.length > 3) {
      alert(`You can only upload up to 3 files in total. You've selected ${files.length} files but can only add ${3 - mediaFiles.length} more.`);
      // Reset the file input
      e.target.value = null;
      return;
    }
    
    setUploadingMedia(true);
    
    try {
      // Process all files in parallel
      const uploadPromises = files.map(async (file) => {
        const fileType = file.type.split("/")[0];
        
        // Validate video duration if it's a video
        if (fileType === "video") {
          const isValid = await validateVideoDuration(file);
          if (!isValid) {
            alert(`Video "${file.name}" must be 30 seconds or less`);
            return null;
          }
        }
        
        const url = await uploader.uploadFile(file, "posts");
        
        return {
          uid: Date.now() + Math.random().toString(36).substring(2, 9),
          url: url,
          type: fileType,
          name: file.name
        };
      });
      
      const results = await Promise.all(uploadPromises);
      const validResults = results.filter(result => result !== null);
      
      setMediaFiles(prev => [...prev, ...validResults]);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploadingMedia(false);
      // Reset the file input
      e.target.value = null;
    }
  };

  const validateVideoDuration = (file) => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      video.onloadedmetadata = function() {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration <= 30);
      };
      
      video.src = URL.createObjectURL(file);
    });
  };

  const removeMediaFile = (uid) => {
    setMediaFiles(prev => prev.filter(file => file.uid !== uid));
  };

  const renderMediaPreview = () => {
    return (
      <>
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          marginBottom: 12, 
          color: themeColors.primary,
          fontWeight: 600
        }}>
          <FileImageOutlined style={{ marginRight: 8 }} />
          <span>Uploaded Media Files ({mediaFiles.length}/3)</span>
        </div>
        <Row gutter={[16, 16]}>
          {mediaFiles.map(file => (
            <Col key={file.uid} span={8}>
              <div style={{ position: 'relative' }}>
                {file.type === 'image' ? (
                  <img 
                    src={file.url} 
                    alt={file.name}
                    style={{ 
                      width: '100%', 
                      height: 120, 
                      objectFit: 'cover', 
                      borderRadius: 8,
                      border: `1px solid ${themeColors.border}`
                    }}
                  />
                ) : (
                  <video 
                    src={file.url} 
                    controls
                    style={{ 
                      width: '100%', 
                      height: 120, 
                      objectFit: 'cover', 
                      borderRadius: 8,
                      border: `1px solid ${themeColors.border}`
                    }}
                  />
                )}
                <Button 
                  type="text" 
                  danger 
                  icon={<DeleteOutlined />} 
                  onClick={() => removeMediaFile(file.uid)}
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    right: 0,
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 8
                  }}
                />
              </div>
            </Col>
          ))}
        </Row>
      </>
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (uploadingMedia || mediaFiles.length >= 3) return;
    
    const files = Array.from(e.dataTransfer.files);
    
    // Check if adding these files would exceed the limit
    if (mediaFiles.length + files.length > 3) {
      alert(`You can only upload up to 3 files in total. You've dropped ${files.length} files but can only add ${3 - mediaFiles.length} more.`);
      return;
    }
    
    setUploadingMedia(true);
    
    try {
      // Process all files in parallel
      const uploadPromises = files.map(async (file) => {
        // Check if file is image or video
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          alert(`File "${file.name}" is not an image or video.`);
          return null;
        }
        
        const fileType = file.type.split("/")[0];
        
        // Validate video duration if it's a video
        if (fileType === "video") {
          const isValid = await validateVideoDuration(file);
          if (!isValid) {
            alert(`Video "${file.name}" must be 30 seconds or less`);
            return null;
          }
        }
        
        const url = await uploader.uploadFile(file, "posts");
        
        return {
          uid: Date.now() + Math.random().toString(36).substring(2, 9),
          url: url,
          type: fileType,
          name: file.name
        };
      });
      
      const results = await Promise.all(uploadPromises);
      const validResults = results.filter(result => result !== null);
      
      setMediaFiles(prev => [...prev, ...validResults]);
    } catch (error) {
      console.error("Error uploading files:", error);
    } finally {
      setUploadingMedia(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setMediaFiles([]);
    state.createSkillShareOpened = false;
  };

  return (
    <Modal
      title={
        <div style={{
          borderBottom: `3px solid ${themeColors.secondary}`,
          paddingBottom: 12,
          marginBottom: 24,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start"
        }}>
          <Title level={3} style={{
            margin: 0,
            color: themeColors.textPrimary,
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            Share Your Skills
          </Title>
          <Text type="secondary" style={{
            fontSize: '0.9rem',
            marginTop: 8,
            color: themeColors.textSecondary
          }}>
            Show your expertise and inspire the community with your skills
          </Text>
        </div>
      }

      footer={null}
      open={snap.createSkillShareOpened}
      onCancel={handleCancel}
      width={600}
      centered
      destroyOnClose
      bodyStyle={{
        padding: "32px",
        background: themeColors.cardBg,
        borderRadius: 16,
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
        maxHeight: '80vh',
        overflowY: 'auto',
      }}

      style={{
        borderRadius: 16,
        overflow: "hidden"
      }}
    >

      <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark="optional">
        
        {/* Skill Description Input */}
        <Form.Item
          name="mealDetails"
          label={
            <div style={{
              display: "flex",
              alignItems: "center",
              fontSize: "1rem",
              fontWeight: 500,
              color: themeColors.textPrimary
            }}>

              <ShareAltOutlined style={{
                marginRight: 12,
                color: themeColors.primary,
                fontSize: '1.25rem'
              }} />

              Skill Description
              <Tooltip title="Share detailed information about your skills or techniques">
                <InfoCircleOutlined style={{
                  marginLeft: 8,
                  color: themeColors.textSecondary,
                  fontSize: '1rem'
                }} />
                
              </Tooltip>
            </div>
          }
          rules={[{ required: true, message: "Please share details about your skills" }]}
        >
          <Input.TextArea
            placeholder="Describe your skills, techniques, or areas of expertise in detail"
            rows={5}
            style={{
              borderRadius: 10,
              borderColor: themeColors.border,
              padding: "12px",
              fontSize: "16px",
              resize: "vertical",
              transition: "all 0.3s ease",
              background: themeColors.inputBg,
              boxShadow: `0 4px 8px rgba(0, 0, 0, 0.05)`
            }}
          />
        </Form.Item>
  
        {/* Media Upload Section */}
        <div style={{
          background: themeColors.surface,
          padding: "24px",
          borderRadius: 16,
          marginBottom: 24,
          marginTop: 24,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
        }}>
          <Form.Item
            label={
              <div style={{
                display: "flex",
                alignItems: "center",
                fontSize: "1rem",
                fontWeight: 500,
                color: themeColors.textPrimary
              }}>
                <UploadOutlined style={{
                  marginRight: 12,
                  color: themeColors.secondary,
                  fontSize: '1.25rem'
                }} />
                Media Upload
                <Tooltip title="Upload up to 3 photos or videos (max 30 sec) to showcase your skills">
                  <InfoCircleOutlined style={{
                    marginLeft: 8,
                    color: themeColors.textSecondary,
                    fontSize: '1rem'
                  }} />
                </Tooltip>
              </div>
            }
            rules={[{ required: mediaFiles.length === 0, message: "Please upload at least one media file" }]}
          >
            <div
              style={{
                border: `2px dashed ${themeColors.border}`,
                borderRadius: '16px',
                padding: '24px',
                textAlign: 'center',
                background: themeColors.background,
                cursor: mediaFiles.length >= 3 ? 'not-allowed' : 'pointer',
                position: 'relative',
                transition: "all 0.3s ease",
                boxShadow: mediaFiles.length > 0 ? `0 4px 12px rgba(71, 118, 230, 0.2)` : "none"
              }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <p><InboxOutlined style={{ fontSize: '48px', color: themeColors.primary }} /></p>
              <p style={{ margin: '8px 0', color: themeColors.textPrimary }}>
                Click or drag files here to upload
              </p>
              <p style={{ color: themeColors.textSecondary }}>
                {mediaFiles.length >= 3 ?
                  "Maximum files reached" :
                  `You can upload up to ${3 - mediaFiles.length} files (images/videos).`}
              </p>
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileInputChange}
                disabled={mediaFiles.length >= 3 || uploadingMedia}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0,
                  cursor: mediaFiles.length >= 3 ? 'not-allowed' : 'pointer'
                }}
              />
            </div>
            {uploadingMedia && (
              <p style={{
                color: themeColors.secondary,
                marginTop: 8,
                fontStyle: 'italic',
                textAlign: 'center'
              }}>
                Media is uploading, please wait...
              </p>
            )}
          </Form.Item>
  
          {mediaFiles.length > 0 && renderMediaPreview()}
        </div>
  
        {/* Divider */}
        <Divider style={{
          margin: "24px 0",
          borderColor: themeColors.border,
          borderWidth: "1px"
        }} />
  
        {/* Action Buttons */}
        <Form.Item style={{ marginBottom: 0 }}>
          <Space style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleCancel}
              style={{
                borderRadius: 12,
                borderColor: themeColors.border,
                height: "45px",
                padding: "0 20px",
                background: themeColors.surface,
                color: themeColors.textPrimary,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={mediaFiles.length === 0 || uploadingMedia}
              style={{
                background: themeColors.gradient,
                borderColor: themeColors.primary,
                borderRadius: 12,
                height: "45px",
                padding: "0 24px",
                boxShadow: "0 4px 12px rgba(71, 118, 230, 0.3)",
                transition: "all 0.3s ease",
                fontWeight: "600",
                textTransform: "uppercase"
              }}
            >
              {loading ? "Sharing..." : "Share Skill"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
  
  
};

export default CreateSkillShareModal;