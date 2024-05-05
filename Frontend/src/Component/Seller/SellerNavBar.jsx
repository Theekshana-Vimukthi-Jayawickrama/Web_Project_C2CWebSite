import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const SellerNavBar = () => {
    const navigate = useNavigate();
    
  const token =  sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId')

    const handleAddItem = () => {

        navigate(`/addItemForm`);
      
      };
      const handleLogOutSlider = () => {       
        // Clear token from session storage
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('adminId')
    
        // Redirect the user to the login page or any other appropriate page
        window.location.href = '/'; // Redirect to the login page       
  }

  const handleDashBoard = () =>{
    navigate('/sellerHome')
  }

  return (
  <>
    <nav className="navbar navbar-expand-lg ">
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <div className="navbar-nav mx-2">
            <div className="nav-item hover-zoom mx-2">
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleDashBoard}
                  >DashBoard
                </button>          
            </div>
            <div className="nav-item hover-zoom">
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={handleAddItem}
                  >Add New Item

                </button>
           
            </div>
          </div>
        </div>      
        <div className='d-flex justify-content-end mx-2'>
            <button
                  type="button" className="btn btn-warning " onClick={handleLogOutSlider}>  Log out
            </button>      
      </div>
      </div>

    </nav>
    
    </>
  );
};

export default SellerNavBar;
