import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthModal from "../Modals/AuthModal";

const Header = () => {
  const navigate = useNavigate();
  const [isAuthModalOpened, setIsAuthModalOpened] = useState(false);
  
  return (
    <header className="header">
      <nav>
        <div className="nav__header">
          <div className="nav__logomain">
            <Link to="#">
              <img src="/assets/brainboosters.svg" alt="logo" />
            </Link>
          </div>
          <div className="nav__menu__btn" id="menu-btn">
            <span>
              <i className="ri-menu-line"></i>
            </span>
          </div>
        </div>
        <ul className="nav__links" id="nav-links">
          <li className="link">
            <Link to="/">Contact Us</Link>
          </li>
          <li className="link">
            <Link to="#browse-courses">Discover Courses</Link>
          </li>
          <li className="link">
            <Link
              to="/community"
              onClick={() => {
                if (!localStorage.getItem("userId")) {
                  setIsAuthModalOpened(true); // Open the authentication modal if not logged in
                }
              }}
            >
              Become a Mentor
            </Link>
          </li>
          <li className="link">
            <button
              onClick={() => {
                if (localStorage.getItem("userId")) {
                  navigate("/community"); // Navigate to the community page
                } else {
                  setIsAuthModalOpened(true); // Open the authentication modal
                }
              }}
              className="btn"
            >
              Join Brain Boosters
            </button>
          </li>
        </ul>
      </nav>
      <div className="section__container header__container" id="home">
        <div>
          <img src="/assets/brainboostershd.svg" alt="header" />
        </div>
        <div className="header__content">
          <h4>Boost Your Mind &</h4>
          <h1 className="section__header">Enhance Your Cognitive Abilities with Brain Boosters!</h1>
          <p>
            Explore a range of cognitive enhancement techniques, from memory training to problem-solving, critical thinking to mindfulness. Join Brain Boosters and connect with a community of mind enthusiasts and cognitive experts.
          </p>
          <div className="header__btn">
            <button
              onClick={() => {
                if (localStorage.getItem("userId")) {
                  navigate("/community"); // Navigate to the community page
                } else {
                  setIsAuthModalOpened(true); // Open the authentication modal
                }
              }}
              className="btn"
            >
              Start Boosting Today
            </button>
          </div>
        </div>
      </div>
      <AuthModal
        onClose={() => {
          setIsAuthModalOpened(false);
        }}
        isOpen={isAuthModalOpened}
      />
    </header>
  );
};

export default Header;