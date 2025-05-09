import React, { useState, useEffect } from "react";
import {
  Modal,
  Switch,
  Input,
  Button,
  Upload,
  message,
  Form,
  Divider,
  Avatar,
  Tooltip,
  Space,
} from "antd";
import {
  UploadOutlined,
  UserOutlined,
  EditOutlined,
  LockOutlined,
  UnlockOutlined,
  LogoutOutlined,
  ProfileOutlined,
  AimOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import UploadFileService from "../../Services/UploadFileService";
import UserService from "../../Services/UserService";
import { useNavigate } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";

const { TextArea } = Input;
const uploader = new UploadFileService();
const genAI = new GoogleGenerativeAI("AIzaSyBf7I5bOeT6Tk4I8OsGQhOUgQcVmdgzxRc");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const UserProfileModal = () => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [uploadUserLoading, setUploadUserLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState({ bio: false, goal: false });
  const navigate = useNavigate();

  const getUserData = () => {
    if (snap.currentUser) return snap.currentUser;
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      state.currentUser = parsedUser;
      return parsedUser;
    }
    return {
      username: "",
      biography: "",
      fitnessGoals: "",
      profileVisibility: false,
      image: "",
      uid: "",
    };
  };

  const [updatedUser, setUpdatedUser] = useState(getUserData());

  useEffect(() => {
    const userData = getUserData();
    setUpdatedUser(userData);
    form.setFieldsValue({
      username: userData.username,
      biography: userData.biography,
      fitnessGoals: userData.fitnessGoals,
      profileVisibility: userData.profileVisibility,
      image: userData.image,
    });
  }, [snap.currentUser, form]);

  const closeModal = () => {
    state.profileModalOpend = false;
  };

  const handleUpdate = async (values) => {
    try {
      setUpdateLoading(true);
      const updatedUserData = {
        ...updatedUser,
        biography: values.biography,
        fitnessGoals: values.fitnessGoals,
        profileVisibility: values.profileVisibility,
      };
      await UserService.updateUserPrifile(updatedUserData);
      state.currentUser = updatedUserData;
      localStorage.setItem("currentUser", JSON.stringify(updatedUserData));
      closeModal();
      message.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      message.error("Profile update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    state.currentUser = null;
    navigate("/");
    message.success("Logged out successfully");
  };

  const handleFileChange = async (info) => {
    if (info.file) {
      try {
        setUploadUserLoading(true);
        const url = await uploader.uploadFile(
          info.fileList[0].originFileObj,
          "userImages"
        );
        const updatedUserData = { ...updatedUser, image: url };
        setUpdatedUser(updatedUserData);
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          parsedUser.image = url;
          localStorage.setItem("currentUser", JSON.stringify(parsedUser));
          state.currentUser = parsedUser;
        }
        form.setFieldValue("image", url);
        message.success("Image uploaded successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
        message.error("Failed to upload image");
      } finally {
        setUploadUserLoading(false);
      }
    }
  };

  const generateSuggestion = async (type) => {
    try {
      setAiLoading((prev) => ({ ...prev, [type]: true }));
      const prompt =
        type === "bio"
          ? `Write a short professional biography for a person named ${updatedUser.username}.`
          : `Suggest skill development goals for a person named ${updatedUser.username} who wants to improve themselves.`;
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      form.setFieldValue(type === "bio" ? "biography" : "fitnessGoals", text);
    } catch (error) {
      console.error("AI suggestion error:", error);
      message.error("Failed to generate suggestion.");
    } finally {
      setAiLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  return (
    <Modal
      title={
        <div style={{ textAlign: "center", padding: "12px 0 0" }}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>My Profile</h2>
        </div>
      }
      open={snap.profileModalOpend}
      onCancel={closeModal}
      footer={null}
      width={500}
      centered
      bodyStyle={{ padding: "12px 20px", maxHeight: "600px", overflowY: "auto" }}
      style={{ borderRadius: "12px", overflow: "hidden" }}
    >
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "16px 0",
            padding: "16px",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <Avatar
            size={100}
            src={updatedUser.image}
            icon={!updatedUser.image && <UserOutlined />}
          />
          <Form.Item name="image" style={{ marginTop: "16px", marginBottom: 0 }}>
            <Upload
              accept="image/*"
              onChange={handleFileChange}
              showUploadList={false}
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button
                icon={<UploadOutlined />}
                loading={uploadUserLoading}
                type="primary"
                ghost
              >
                {updatedUser.image ? "Change Photo" : "Upload Photo"}
              </Button>
            </Upload>
          </Form.Item>
        </div>

        <Divider plain>Profile Information</Divider>

        <Form.Item
          name="username"
          label={
            <Space>
              <UserOutlined />
              <span>Username</span>
            </Space>
          }
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name="biography"
          label={
            <Space>
              <ProfileOutlined />
              <span>Biography</span>
            </Space>
          }
          rules={[{ required: true, message: "Please enter your biography" }]}
        >
          <TextArea
            placeholder="Tell others about yourself"
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </Form.Item>
        <Button
          icon={<BulbOutlined />}
          onClick={() => generateSuggestion("bio")}
          loading={aiLoading.bio}
          block
          style={{ marginBottom: 12 }}
        >
          Suggest Biography with AI
        </Button>

        <Form.Item
          name="fitnessGoals"
          label={
            <Space>
              <AimOutlined />
              <span>Skill Goals</span>
            </Space>
          }
          rules={[{ required: true, message: "Please enter your skill goals" }]}
        >
          <TextArea
            placeholder="What skills do you want to achieve?"
            autoSize={{ minRows: 2, maxRows: 4 }}
          />
        </Form.Item>
        <Button
          icon={<BulbOutlined />}
          onClick={() => generateSuggestion("goal")}
          loading={aiLoading.goal}
          block
        >
          Suggest Skill Goals with AI
        </Button>

        <Form.Item
          name="profileVisibility"
          label={
            <Space>
              {updatedUser.profileVisibility ? <UnlockOutlined /> : <LockOutlined />}
              <span>Profile Visibility</span>
            </Space>
          }
          valuePropName="checked"
        >
          <Switch checkedChildren="Public" unCheckedChildren="Private" />
        </Form.Item>

        <Divider />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 16px",
            borderTop: "1px solid #f0f0f0",
          }}
        >
          <Tooltip title="Log out of your account">
            <Button icon={<LogoutOutlined />} danger onClick={handleLogout}>
              Log Out
            </Button>
          </Tooltip>
          <Space>
            <Button onClick={closeModal}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<EditOutlined />}
              loading={updateLoading}
            >
              Update Profile
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default UserProfileModal;
