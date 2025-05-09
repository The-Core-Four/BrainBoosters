import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Space, Typography, message } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import LearningProgressService from "../../Services/LearningProgressService";

const { TextArea } = Input;
const { Title } = Typography;

// Theme colors from your existing component
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

const EditLearningProgressModal = () => {
  const snap = useSnapshot(state);
  const selectedPlan = snap.selectedLearningProgress;
  const [updateLoading, setUpdateLoading] = useState(false);
  const [form] = Form.useForm();

  // Reset form fields when selected plan changes
  useEffect(() => {
    if (selectedPlan && form) {
      form.setFieldsValue({
        planName: selectedPlan.planName,
        description: selectedPlan.description,
        routines: selectedPlan.routines,
        goal: selectedPlan.goal,
      });
    }
  }, [selectedPlan, form]);

  const updateLearningProgress = async (values) => {
    try {
      setUpdateLoading(true);
      // Prepare data for update
      const body = { 
        ...values, 
        userId: snap.currentUser?.uid,
        lastUpdated: new Date().toISOString().split('T')[0],
        // Preserve existing values for fields we're not updating
        category: selectedPlan.category,
        completedItems: selectedPlan.completedItems,
        totalItems: selectedPlan.totalItems
      };
      
      await LearningProgressService.updateLearningProgress(selectedPlan.id, body);
      
      // Update the state without page refresh
      const updatedPlans = await LearningProgressService.getAllLearningProgresss();
      state.LearningProgresss = updatedPlans;
      
      // Update the selected plan in state with new values
      const updatedPlan = updatedPlans.find(plan => plan.id === selectedPlan.id);
      if (updatedPlan) {
        state.selectedLearningProgress = updatedPlan;
      }
      
      // Close the modal
      state.editLearningProgressOpened = false;
      
      // Success message
      message.success("Learning Progress updated successfully!");
    } catch (error) {
      console.error("Failed to update Learning Progress:", error);
      
      // Error message
      message.error("Failed to update Learning Progress. Please try again.");
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <Modal
    // Modal title with styled heading
      title={<Title level={4} style={{ color: themeColors.textPrimary }}>Edit Learning Plan</Title>}
      open={snap.editLearningProgressOpened}
      onCancel={() => {
        state.editLearningProgressOpened = false;
        form.resetFields();
      }}
      footer={null}
      destroyOnClose={true}
      width={600}
    > <Form
    form={form}
    layout="vertical"
    onFinish={updateLearningProgress} // Function to handle form submission

    // Set initial values based on selected plan (if available)
    initialValues={{
      planName: selectedPlan?.planName || "",
      description: selectedPlan?.description || "",
      routines: selectedPlan?.routines || "",
      goal: selectedPlan?.goal || "",
    }}
  >
    {/* Plan Name Input (Required) */}
    <Form.Item
      name="planName"
      label="Plan Name"
      rules={[{ required: true, message: "Please enter a plan name" }]}
    >
      <Input 
        placeholder="Enter plan name" 
        style={{ borderRadius: 8 }}
      />
    </Form.Item>

    {/* Description Text Area */}
    <Form.Item
      name="description"
      label="Description"
    >
      <TextArea 
        placeholder="Describe your learning plan" 
        autoSize={{ minRows: 3, maxRows: 6 }}
        style={{ borderRadius: 8 }}
      />
    </Form.Item>

    {/* Routines / Skills Input */}
    <Form.Item
      name="routines"
      label="Skills to Learn (comma separated)"
    >
      <Input 
        placeholder="e.g. React, JavaScript, UI Design" 
        style={{ borderRadius: 8 }}
      />
    </Form.Item>

    {/* Tutorials and Resources Text Area */}
    <Form.Item
      name="goal"
      label="Tutorials & Resources"
    >
      <TextArea 
        placeholder="List tutorials or resources for this plan" 
        autoSize={{ minRows: 2, maxRows: 4 }}
        style={{ borderRadius: 8 }}
      />
    </Form.Item>

    {/* Action Buttons: Cancel & Submit */}
    <Form.Item style={{ marginTop: 16 }}>
      <Space style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button 
          onClick={() => {
            state.editLearningProgressOpened = false;
            form.resetFields();
          }}
          style={{ 
            borderRadius: 8, 
            borderColor: themeColors.primary,
          }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={updateLoading}
              style={{
                background: themeColors.primary,
                borderColor: themeColors.primary,
                borderRadius: 8,
                boxShadow: "0 2px 8px rgba(255, 107, 53, 0.2)"
              }}
            >
              Update Plan
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditLearningProgressModal;