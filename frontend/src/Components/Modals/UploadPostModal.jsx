import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Upload } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import PostService from "../../Services/PostService";
import UploadFileService from "../../Services/UploadFileService";
import { UploadOutlined } from "@ant-design/icons";

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

const uploader = new UploadFileService();
const UploadPostModal = () => {
  const snap = useSnapshot(state);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const selectedPost = snap.selectedPost;
  const [fileType, setFileType] = useState("image");
  const [image, setImage] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    setImage(selectedPost?.mediaLink);
    setFileType(selectedPost.mediaType);
    form.setFieldsValue({
      contentDescription: selectedPost?.contentDescription,
    });
  }, [snap.selectedPost]);

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      const body = {
        contentDescription: values.contentDescription,
        mediaLink: image,
        mediaType: fileType,
      };
      await PostService.updatePost(selectedPost.id, body);
      state.posts = await PostService.getPosts();
      state.updatePostModalOpened = false; // Close the modal after update
    } catch (error) {
      console.error("Failed to update post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (info) => {
    if (info.file) {
      setImageUploading(true);
      const fileType = info.file.type.split("/")[0];
      setFileType(fileType);
      const url = await uploader.uploadFile(
        info.fileList[0].originFileObj,
        "posts"
      );
      setImage(url);
    } else if (info.file.status === "removed") {
    }
    setImageUploading(false);
  };

  return (
    <Modal
      open={snap.updatePostModalOpened}
      onCancel={() => {
        state.updatePostModalOpened = false;
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => (state.updatePostModalOpened = false)}
          style={{ borderRadius: 8, borderColor: themeColors.primary, }}
        >
          Cancel
        </Button>,
        <Button
          disabled={imageUploading}
          key="update"
          type="primary"
          loading={loading}
          onClick={form.submit}
          style={{
            background: themeColors.primary,
            borderColor: themeColors.primary,
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(255, 107, 53, 0.2)"
          }}
        >
          Update
        </Button>,
      ]}
    >
      <h1>Update Post</h1>
      <Form
        form={form}
        initialValues={{ contentDescription: selectedPost.contentDescription }}
        onFinish={handleUpdate}
      >
        <Form.Item
          name="contentDescription"
          label="Content Description"
          rules={[
            { required: true, message: "Please enter content description" },
          ]}
        >
          <Input.TextArea />
        </Form.Item>
        {!imageUploading && (
          <Form.Item
            name="mediaLink"
            label="Media Link"
            rules={[{ required: true, message: "Please enter media link" }]}
          >
            <Upload
              accept="image/*,video/*"
              onChange={handleFileChange}
              showUploadList={false}
              beforeUpload={() => false}
              style={{ marginBottom: "1rem" }}
            >
              <Button icon={<UploadOutlined />}>Upload Media</Button>
            </Upload>
          </Form.Item>
        )}
      </Form>
      {imageUploading && <p>Please wait media is uploading</p>}
      {fileType === "image" && (
        <img src={image} style={{ maxHeight: 400 }} alt="Post" />
      )}
      {fileType === "video" && (
        <video controls src={image} style={{ maxHeight: 400, width: "100%" }} />
      )}
      <div style={{ height: 16 }} />
    </Modal>
  );
};

export default UploadPostModal;
