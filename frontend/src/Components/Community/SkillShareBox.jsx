import React, { useState } from "react";
import state from "../../Utils/Store";
import { useSnapshot } from "valtio";

// Theme colors (matching the previous component)
const themeColors = {
  primary: "#4776E6", // Vibrant blue - energizing for brain/cognition
  secondary: "#8E54E9", // Rich purple - associated with creativity and wisdom
  accent: "#00BFFF", // Electric blue for highlights and focus elements
  background: "#F0F5FF", // Light blue-tinted white for a clean, focused look
  surface: "#E6EEFF", // Subtle blue tint for content areas
  cardBg: "#FFFFFF", 
  textPrimary: "#2A3B52", 
  textSecondary: "#5D7599", 
  border: "rgba(71, 118, 230, 0.15)", 
  hover: "#3A65C0", 
  danger: "#FF5252", 
  success: "#22C55E", 
  gradient: "linear-gradient(135deg, #4776E6 0%, #8E54E9 100%)", 
};
const SkillShareBox = () => {
  const snap = useSnapshot(state);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="my_post"
      onClick={() => {
        state.createSkillShareOpened = true;
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: themeColors.gradient,
        padding: "20px 24px",
        borderRadius: "16px",
        boxShadow: isHovered 
        ? "0 12px 30px rgba(90, 155, 255, 0.25)"
        : "0 6px 18px rgba(0, 0, 0, 0.08)",
        marginBottom: "24px",
        color: "white",
        cursor: "pointer",
        transition: "all 0.35s ease",
        transform: isHovered ? "translateY(-5px) scale(1.02)" : "translateY(0) scale(1)",
        border: `1px solid ${isHovered ? "rgba(255, 255, 255, 0.25)" : "transparent"}`,
        position: "relative",
        overflow: "hidden",
        backdropFilter: "blur(4px)", // a little smoothness
      }}
    >
      {/* Decorative circles matching the LearningProgressCard style */}
      <div
    style={{
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: isHovered 
        ? "radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)"
        : "transparent",
      transition: "background 0.4s ease",
      zIndex: 0,
    }}
  />
      
      <div 
        style={{ 
          position: "absolute", 
          left: 10, 
          bottom: -30, 
          width: 60, 
          height: 60, 
          borderRadius: "50%", 
          background: "rgba(255,255,255,0.15)",
          zIndex: 1,
          transition: "transform 0.5s ease-in-out",
          transform: isHovered ? "scale(1.2) translateX(10px)" : "scale(1)"
        }} 
      />

      <div
        className="post_top"
        style={{ 
          display: "flex", 
          alignItems: "center", 
          position: "relative", 
          zIndex: 2 
        }}
      >
        <img
          alt={snap.currentUser?.username || "Profile"}
          src={snap.currentUser?.image}
          style={{
            width: "45px",
            height: "45px",
            marginRight: "15px",
            borderRadius: "50%",
            border: "2px solid rgba(255, 255, 255, 0.7)",
            transition: "transform 0.3s ease",
            transform: isHovered ? "scale(1.05)" : "scale(1)",
            boxShadow: isHovered ? "0 2px 10px rgba(0, 0, 0, 0.1)" : "none"
          }}
        />
        <input
          type="text"
          placeholder={`What skill are you sharing today, ${snap.currentUser?.username || "User"}?`}
          style={{
            flexGrow: 1,
            border: "none",
            padding: "12px 16px",
            borderRadius: "8px",
            color: themeColors.textPrimary,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            fontSize: "14px",
            transition: "all 0.3s ease",
            boxShadow: isHovered ? "0 4px 12px rgba(0, 0, 0, 0.08)" : "0 2px 6px rgba(0, 0, 0, 0.04)",
            outline: "none"
          }}
          readOnly // Making input read-only since the whole component is clickable
          onClick={(e) => e.stopPropagation()} // Preventing input click from propagating
        />
      </div>
    </div>
  );
};

export default SkillShareBox;