
import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Outlet } from "react-router-dom";
import {  Menu } from "lucide-react";
import "./header.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header>
        <nav ref={navRef}>
          <div className="logo-container">
            <NavLink to="/home" onClick={() => setMenuOpen(false)}>
              <div className="logo-text">CSV Analyzer</div>
            </NavLink>
          </div>

          <div className="nav-links-container">
            <div className={menuOpen ? "nav-links open" : "nav-links"}>
              <NavLink to="/sentimental" onClick={() => setMenuOpen(false)}>
                Sentimental
              </NavLink>
              <NavLink to="/clientes" onClick={() => setMenuOpen(false)}>
                5 Min
              </NavLink>
            </div>
          </div>

           <div className="nav-right">

            <button
              className="burger-btn"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <Menu className={menuOpen ? "menu-icon open" : "menu-icon"} />
            </button>
          </div>
        </nav>
      </header>
      <div className="main-content">
        <Outlet />
      </div>
    </>
  );
};

export default Navbar;