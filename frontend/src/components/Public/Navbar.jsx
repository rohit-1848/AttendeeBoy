import React, { useState, useEffect } from "react";
import { FaSearch, FaCalendarAlt, FaComments, FaUser, FaSignOutAlt, FaHome, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../../css/Navbar.css";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Server logout successful");
      } else {
        console.warn("Server logout failed, falling back to client-side cleanup:", await response.text());
      }
    } catch (error) {
      console.error("Error calling logout endpoint:", error);
    }

    localStorage.removeItem("token");
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    navigate("/");
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      {/* Left Section - Logo & Brand Name */}
      <div className="navbar-left">
        <img src={logo} alt="SafeSpace Logo" className="logo" />
        <Link to="/home" className="brand-name">
          AttendeeBoy
        </Link>
      </div>

      {/* Mobile Menu Toggle (Hamburger) */}
      <div className="navbar-toggle" onClick={toggleMobileMenu}>
        <FaBars />
      </div>

      {/* Right Section - Navigation Links */}
      <div className={`navbar-right ${isMobileMenuOpen ? "active" : ""}`}>
        <Link to="/home" className="nav-link">
          <FaHome /> Home
        </Link>

        <Link to="/profile" className="nav-link">
          <FaUser /> Profile
        </Link>
        <a onClick={handleLogout} className="nav-link">
          <FaSignOutAlt /> Logout
        </a>
      </div>
    </nav>
  );
};

export default Navbar;