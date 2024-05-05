import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const NavBar = ({ token, adminId }) => {

    const navigate = useNavigate();


    const handleAds= () => {
        navigate(`/adminViewAllAds`);
      };
      const handleAdsSlider= () => {
        navigate(`/adminSliderAds`);
      };
      
    const handleSllers= () => {

      navigate(`/adminViewUsers`);

    };
    const handleAdmin= () => {

      navigate(`/adminPage`);

    };

    const handleHome = () => {
      navigate(`/adminDashboard`);
    }
    const handleLogOutSlider = () => {       
          // Clear token from session storage
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('adminId')
      
          // Redirect the user to the login page or any other appropriate page
          window.location.href = '/'; // Redirect to the login page       
    }
    

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      
      <div className="container-fluid d-flex">

        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav mr-auto">
          <li className="nav-item hover-zoom">
              <a
                className="nav-link active"
                aria-current="page"
                href="#"
              >
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleHome}
                  > DashBoard

                </button>

              </a>
            </li>
            <li className="nav-item hover-zoom">
              <a
                className="nav-link active"
                aria-current="page"
                href="#"
              >
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleAds}
                  > All Ads

                </button>

              </a>
            </li>
            <li className="nav-item hover-zoom">
              <a
                className="nav-link active"
                aria-current="page"
                href="#"
              >
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleAdsSlider}
                  >  Slider Ads

                </button>

              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                <button type="button" className="btn btn-warning text-dark text-light text-decoration-none fs-6 font-weight-bold" onClick={handleSllers}>
                    Show Sellers
                </button>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                <button type="button" className="btn btn-warning text-dark text-light text-decoration-none fs-6 font-weight-bold" onClick={handleAdmin}>
                    Admin
                </button>
              </a>
            </li>
          </ul>
        </div>          
        <div className='d-flex justify-content-end'>
                <button
                  type="button" className="btn btn-warning " onClick={handleLogOutSlider}>  Log out
                </button>      
          </div>
      </div>
    </nav>
  );
}

export default NavBar