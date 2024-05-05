import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/DartTheme.css';
import NavBar from './NavBar';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import image1 from "../assests/image1.png"
import axios from 'axios';

const ITEMS_PER_PAGE = 5;

const AdminDashborad = () => {
  const token =  sessionStorage.getItem('token');
  const adminId = sessionStorage.getItem('adminId')
  const navigate = useNavigate();
  
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [showNoResultsMessage, setShowNoResultsMessage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
    useEffect(() => {
      // Fetch items from the backend API
      const fetchItems = async () => {
          const BearerToken = token;
        try {
          const response = await fetch(`http://localhost:8080/api/v1/admin/getAllItems`, {
              headers: {
                'Authorization': `Bearer ${BearerToken}`,
                'Content-Type': 'application/json',
              },
            });
          const data = await response.json();
          setItems(data);
        } catch (error) {
          console.error('Error fetching items:', error);
        }
      };

  
      fetchItems();
    }, []);

    
    useEffect(() => {
      const fetchName = async () => {
        const BearerToken = token;
        try {
          const response = await axios.get(`http://localhost:8080/api/v1/auth/getName/${adminId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
            const data = await response.json();
            
            setName(response.data.name); 
          if (response.ok) {
            

           
          } else {
            console.error('Error fetching user name:', response.statusText);
          }
        } catch (error) {
          console.error('Error during fetch:', error.message);
        }
      };
      fetchName();
    }, []);

    const handleDevices= () => {
      navigate(`/devices`);
    };

    const handleBrands= () => {
      navigate(`/brands`);
    };
    
    const handleProfile= () => {
      navigate(`/adminAllDetails/?id=${adminId}`);
    };
  
    const generateSearchVariations = (term) => {
      const variations = [];
      const cleanedTerm = term.replace(/[^\w\s]/gi, ''); // Remove symbols
  
      // Original term
      variations.push(cleanedTerm);
  
      // Remove spaces
      variations.push(cleanedTerm.replace(/\s/g, ''));
  
      // Split by spaces and join without spaces
      variations.push(cleanedTerm.split(/\s/).join(''));
  
      return variations;
    };
  
    const handleSearch = () => {
      // Reset to the first page when a new search is performed
      setCurrentPage(1);
  
      // Generate search term variations
      const searchVariations = generateSearchVariations(searchTerm.toLowerCase());
  
      // Filter items based on the cleaned search term
      const filteredItems = items.filter(item => {
        const cleanedTitle = item.title.toLowerCase().replace(/[^\w\s]/gi, '') + item.deviceType.toLowerCase().replace(/[^\w\s]/gi, '') + item.id; // Remove symbols
        return searchVariations.some(variation => cleanedTitle.includes(variation));
      });
  
      setSearchResult(filteredItems);
  
      // Update the state to show the message only if no results are found and the search button is clicked
      setShowNoResultsMessage(filteredItems.length === 0 && searchTerm !== '');
    };
  
  
    const handleInputChange = (e) => {
      const newSearchTerm = e.target.value;
      setSearchTerm(newSearchTerm);
  
      // Automatic filtering as the user types
      const cleanedSearchTerm = newSearchTerm.replace(/[^\w\s]/gi, ''); // Remove symbols
      const filteredItems = items.filter(item => {
        const cleanedTitle = item.title.toLowerCase().replace(/[^\w\s]/gi, ''); // Remove symbols
        return cleanedTitle.includes(cleanedSearchTerm);
      });
  
      setSearchResult(filteredItems);
      setShowNoResultsMessage(false);
    };
  
    const textStyle = {
      color: '#FFD700',
      fontWeight: 'bold',
      userSelect: 'none',
    };
  
    // Calculate the index range for the current page
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = (searchResult.length > 0 ? searchResult : items).slice(indexOfFirstItem, indexOfLastItem);
  
    // Update page number
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  
  
    return (
      <> 
        <div className="no-focus-outline text-center m-4 fs-1">Wellcome .</div>
        <h1 className="no-focus-outline text-center m-4">{name}</h1>
       <center><div className='container my-4'> <NavBar/></div></center>
        <div>
          <br/><br/>
          <div className='container-fluid m-4'>
            <div className='row'>
              <div className='col-lg-5 col-md-12 m-4'>
                    <div className='fs-4 text-center my-4'  style={textStyle}>
                        <b>Users</b>
                    </div>
                    <div className='fs-5'  style={textStyle}>
                    This dedicated space serves as the dynamic hub for all user-centric endeavors, a versatile realm designed to cater to a myriad of tasks and activities centered around our valued participants.
                    </div>
              </div>
              <div className='col-lg-5 col-md-12 '>
                <center><img src = {image1}  style={{ height: '500px' }} /></center>
              </div>

            </div>

            <div className='row'>
      <div className='col-lg-4 col-md-5 col-sm-12 '>
        <center><button className='btn' onClick={handleDevices}>   
          <div className="square-container1 rounded hover-effect">
              <p className="text-inside fs-4 text-light"><b>Devices</b></p>
          </div>
        </button></center>
      </div>
      <div className='col-lg-3 col-md-4 col-sm-12'>
        <center><button className='btn' onClick={handleBrands}>   
          <div className="square-container rounded hover-effect">
              <p className="text-inside fs-4 text-light">Brands</p>
          </div>
        </button></center>
      </div> 
      <div className='col-lg-4 col-md-6 col-sm-12'>
        <center><button className='btn' onClick={handleProfile}>   
          <div className="square-container2 rounded hover-effect">
              <p className="text-inside fs-4 text-light">Admin Profile</p>
          </div>
        </button></center>
      </div> 
      </div>

          </div>
        </div>
      </>
    );
}

export default AdminDashborad