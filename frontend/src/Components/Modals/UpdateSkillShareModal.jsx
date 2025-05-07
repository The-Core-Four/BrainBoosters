import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Upload, Select, Row, Col, message } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import SkillShareService from "../../Services/SkillShareService";
import UploadFileService from "../../Services/UploadFileService";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;
const uploader = new UploadFileService();

const UpdateSkillShareModal = () => {
  const snap = useSnapshot(state);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);

  useEffect(() => {
    if (snap.seletedSkillShareToUpdate) {
      form.setFieldsValue({
        mealDetails: snap.seletedSkillShareToUpdate.mealDetails,
        dietaryPreferences: snap.seletedSkillShareToUpdate.dietaryPreferences,
        ingredients: snap.seletedSkillShareToUpdate.ingredients,
      });

      // Load existing media files
      if (snap.seletedSkillShareToUpdate.mediaUrls && snap.seletedSkillShareToUpdate.mediaUrls.length > 0) {
        const existingFiles = snap.seletedSkillShareToUpdate.mediaUrls.map((url, index) => ({
          uid: `existing-${index}`,
          url: url,
          type: snap.seletedSkillShareToUpdate.mediaTypes ? 
                snap.seletedSkillShareToUpdate.mediaTypes[index] : 
                url.includes('.mp4') ? 'video' : 'image',
          name: `Media ${index + 1}`
        }));
        setMediaFiles(existingFiles);
      }
    }
  }, [snap.seletedSkillShareToUpdate, form]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // Call the service to update the Skill Share
      await SkillShareService.updateSkillShare(
        snap.seletedSkillShareToUpdate.id,
        {
          ...snap.seletedSkillShareToUpdate,
          ...values,
          mediaUrls: mediaFiles.map(file => file.url),
          mediaTypes: mediaFiles.map(file => file.type)
        }
      );
      
      state.SkillShares = await SkillShareService.getAllSkillShares();
      
      // Reset the form and close the modal on success
      form.resetFields();
      setMediaFiles([]);
      state.updateSkillShareOpened = false;
      state.seletedSkillShareToUpdate = null;

      // Show success message
      message.success("Skill Share updated successfully!");
    } catch (error) {
      console.error("Error updating Skill Share:", error);
      
      // Show error message
      message.error("Failed to update Skill Share. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (mediaFiles.length >= 3) {
      message.warning("You can only upload up to 3 media files.");
      return false; // Prevent upload if already at 3 files
    }

    setUploadingMedia(true);
    try {
      const fileType = file.type.split("/")[0];
      
      // Validate video duration if it's a video
      if (fileType === "video") {
        const isValid = await validateVideoDuration(file);
        if (!isValid) {
          message.error("Video must be 30 seconds or less.");
          setUploadingMedia(false);
          return false;
        }
      }
      
      const url = await uploader.uploadFile(file, "posts");
      
      setMediaFiles(prev => [...prev, {
        uid: Date.now(),
        url: url,
        type: fileType,
        name: file.name
      }]);
      
      // Show success message after successful upload
      message.success(`${file.name} uploaded successfully.`);
    } catch (error) {
      console.error("Error uploading file:", error);
      
      // Show error message for file upload failure
      message.error("Failed to upload the file. Please try again.");
    } finally {
      setUploadingMedia(false);
    }
    
    return false; // Prevent default upload behavior
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
        <p>Media Files ({mediaFiles.length}/3):</p>
        <Row gutter={[16, 16]}>
          {mediaFiles.map(file => (
            <Col key={file.uid} span={8}>
              <div style={{ position: 'relative' }}>
                {file.type === 'image' ? (
                  <img 
                    src={file.url} 
                    alt={file.name}
                    style={{ width: '100%', height: 120, objectFit: 'cover' }}
                  />
                ) : (
                  <video 
                    src={file.url} 
                    controls
                    style={{ width: '100%', height: 120, objectFit: 'cover' }}
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
                    background: 'rgba(255, 255, 255, 0.7)'
                  }}
                />
              </div>
            </Col>
          ))}
        </Row>
      </>
    );
  };
  return (
    <Modal
      open={snap.updateSkillShareOpened}
      footer={null}
      centered
      width={550}
      onCancel={() => {
        state.updateSkillShareOpened = false;
        state.seletedSkillShareToUpdate = null;
      }}
      bodyStyle={{
        padding: 24,
        borderRadius: 12,
        background: '#f9fafb',
      }}
      style={{
        borderRadius: 16,
        overflow: 'hidden',
      }}
      title={
        <div style={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 8 }}>
          <h2 style={{ margin: 0, fontSize: 20, color: '#333' }}>Update Your Skill</h2>
          <p style={{ margin: 0, fontSize: 14, color: '#888' }}>
            Edit your description and media to inspire others.
          </p>
        </div>
      }
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="mealDetails"
          label={<span style={{ fontWeight: 500 }}>Description</span>}
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <Input.TextArea
            placeholder="Describe your skills or updates..."
            rows={4}
            style={{
              borderRadius: 8,
              padding: 12,
              fontSize: 15,
              borderColor: '#ddd',
            }}
          />
        </Form.Item>
  
        <div
          style={{
            background: '#fff',
            padding: 16,
            borderRadius: 12,
            marginBottom: 16,
            border: '1px dashed #ddd',
            textAlign: 'center',
            cursor: mediaFiles.length >= 3 ? 'not-allowed' : 'pointer',
          }}
        >
          <Form.Item
            label={<span style={{ fontWeight: 500 }}>Upload Media (max 3 files, 30s video)</span>}
            rules={[{ required: mediaFiles.length === 0, message: 'Please upload at least one media file' }]}
          >
            <Upload
              accept="image/*,video/*"
              beforeUpload={handleFileUpload}
              showUploadList={false}
              disabled={mediaFiles.length >= 3 || uploadingMedia}
            >
              <Button
                icon={<UploadOutlined />}
                disabled={mediaFiles.length >= 3 || uploadingMedia}
                style={{ borderRadius: 8 }}
              >
                Upload Media
              </Button>
            </Upload>
          </Form.Item>
  
          {uploadingMedia && (
            <p style={{ marginTop: 8, color: '#ff6b35', fontStyle: 'italic' }}>
              Media is uploading, please wait...
            </p>
          )}
        </div>
  
        {mediaFiles.length > 0 && renderMediaPreview()}
  
        <Form.Item style={{ marginTop: 24 }}>
          <Button
  type="primary"
  htmlType="submit"
  loading={loading}
  disabled={mediaFiles.length === 0 || uploadingMedia}
  style={{
    background: '#3b82f6', // nice blue
    borderColor: '#3b82f6',
    width: '100%',
    height: 44,
    fontSize: 16,
    borderRadius: 8,
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)', // matching blue shadow
  }}
>
  {loading ? 'Updating...' : 'Update Skill Share'}
</Button>

        </Form.Item>
      </Form>
    </Modal>
  );
  
};

export default UpdateSkillShareModal;