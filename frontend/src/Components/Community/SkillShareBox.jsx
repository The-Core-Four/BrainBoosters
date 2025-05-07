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
      onClick={() => (state.createSkillShareOpened = true)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))",
        borderRadius: "20px",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        padding: "24px",
        marginBottom: "24px",
        boxShadow: isHovered
          ? "0 20px 50px rgba(0, 0, 0, 0.2)"
          : "0 8px 30px rgba(0, 0, 0, 0.1)",
        border: `1px solid rgba(255, 255, 255, ${isHovered ? 0.5 : 0.3})`,
        cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: isHovered ? "translateY(-8px) scale(1.03)" : "translateY(0) scale(1)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ripple Effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isHovered
            ? "radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, transparent 70%)"
            : "transparent",
          transition: "background 0.5s ease",
          zIndex: 0,
        }}
      />
  
      
      <div
        style={{
          position: "absolute",
          left: 20,
          bottom: -30,
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.15)",
          zIndex: 1,
          transition: "transform 0.6s ease",
          transform: isHovered ? "scale(1.5) translateX(20px)" : "scale(1)",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <img
          alt={snap.currentUser?.username || "Profile"}
          src={snap.currentUser?.image}
          style={{
            width: 52,
            height: 52,
            marginRight: 16,
            borderRadius: "50%",
            border: "2px solid white",
            boxShadow: isHovered
              ? "0 0 20px rgba(255, 255, 255, 0.6)"
              : "0 2px 10px rgba(0, 0, 0, 0.1)",
            transition: "box-shadow 0.4s ease, transform 0.3s ease",
            transform: isHovered ? "scale(1.15)" : "scale(1)",
          }}
        />
        <input
          type="text"
          placeholder={`✨ What skill are you sharing today, ${snap.currentUser?.username || "User"}?`}
          style={{
            flexGrow: 1,
            border: "none",
            padding: "16px 20px",
            borderRadius: "14px",
            fontSize: 16,
            color: themeColors.textPrimary,
            background: "rgba(243, 243, 244, 0.95)",
            boxShadow: isHovered
              ? "0 4px 15px rgba(0, 0, 0, 0.15)"
              : "0 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "box-shadow 0.4s ease, transform 0.3s ease",
            outline: "none",
            transform: isHovered ? "scale(1.04)" : "scale(1)",
          }}
          readOnly
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
  
  
};

export default SkillShareBox;