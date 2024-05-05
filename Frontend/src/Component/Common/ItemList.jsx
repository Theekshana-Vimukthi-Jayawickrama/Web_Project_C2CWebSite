import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/DartTheme.css';
import NavBar from './NavBar';
import Slider from './adsSlider';
import axios from 'axios';

const ITEMS_PER_PAGE = 12;

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [showNoResultsMessage, setShowNoResultsMessage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all'); 

  useEffect(() => {
    // Fetch items from the backend API
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/allItems/getAllItems');
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchItems();
  }, []);

  const [deviceTypes, setDeviceTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
    
      try {   
          const deviceTypesResponse = await axios.get('http://localhost:8080/api/v1/allItems/getDeviceType', {
            headers: {             
            }
          });  
          const deviceTypesArray = deviceTypesResponse.data;
          setDeviceTypes(deviceTypesArray); 
      } catch (error) {
        console.error('Error fetching device types and brands:', error.message);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);
};

// Filter items based on the selected filter
const filteredItems = items.filter(item => {
  return deviceTypes.some(deviceType => {
    if (deviceType.selected) { // deviceType has a 'selected' property
      return filter === deviceType.deviceType && item.deviceType === deviceType.deviceType;
    } else {
      return true;
    }
  });
});

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
  const cleanedTitle = item.title.toLowerCase().replace(/[^\w\s]/gi, ''); // Remove symbols
  const matchesSearch = searchVariations.some(variation => cleanedTitle.includes(variation));

  return deviceTypes.some(deviceType => {
    if (deviceType.selected) { 
      return filter === deviceType.deviceType && item.deviceType === deviceType.deviceType && matchesSearch;
    } else {
      return true && matchesSearch;
    }
  });
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
      const cleanedTitle = item.title.toLowerCase().replace(/[^\w\s]/gi, '')+ item.deviceType.toLowerCase().replace(/[^\w\s]/gi, ''); // Remove symbols
      const matchesSearch = ( cleanedTitle.includes(cleanedSearchTerm));

      return deviceTypes.some(deviceType => {
        if (deviceType.selected) { 
          return filter === deviceType.deviceType && item.deviceType === deviceType.deviceType && matchesSearch;
        } else {
          return true && matchesSearch;
        }
      });
      });

    setSearchResult(filteredItems);
    setShowNoResultsMessage(false);
  };

  const textStyle = {
    color: '#FFD700',
    fontWeight: 'bold',
    userSelect: 'none', // Add this line to disable text selection
  };

  // Calculate the index range for the current page
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = (searchResult.length > 0 ? searchResult : filteredItems).slice(indexOfFirstItem, indexOfLastItem);

  // Update page number
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <h1 className="no-focus-outline text-center fs-1 m-4">Wellcome to PCHUB.</h1>
      <div className='container'><NavBar /></div>
      

      <div className='container m-4'>
        <div className='d-flex m-4 '>

          <div className='input-group mb-3 '>
            <label htmlFor="search" className='d-none d-sm-block input-group-append mx-3' style={textStyle}>Search by name: </label>
            <input
            class="form-control rounded"
              placeholder="Search"
              aria-label="Search"
              type="text"
              id="search"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <button className="btn m-2 my-sm-0 btn-outline-secondary input-group-append mx-2" type="button" onClick={handleSearch} style={textStyle}>
              Search
            </button>
            <div className="mx-4">
            <select className="form-select" value={filter} onChange={handleFilterChange}>
                <option value="all">All Items</option>
                {deviceTypes.map((deviceType, index) => (
                  <option key={index} value={deviceType.deviceType}>{deviceType.deviceType}</option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>
    <div className='m-3'>
            {showNoResultsMessage && (
        <h4 style={textStyle}>No results found for "{searchTerm}".</h4>
      )}
    </div>

    <div className='container=fulid m-4'><Slider /></div>
        <div className='container-fluid  m-4 view overlay zoom rounded'>
          <div className='row px-2 mx-4'>
            
        {currentItems.map(item => (
            
              <div className='col-3 border border-light p-4 mx-4 my-2 zoom-opacity-effect' key={item.id} style={{backgroundColor: 'rgba(50, 50, 50, 0.4)'}}>                                                 
                <Link to={`/items/${item.id}`} className="text-light text-decoration-none ">                 
                  <div className='row '>
                    <div className='col-12'>
                      <img
                        className="no-border img-fluid img-thumbnail bg-image hover-zoom"
                        src={`data:${item.itemPhoto1.photoType};base64,${item.itemPhoto1.data}`}
                        style={{ width: '300px', maxHeight: '300px', cursor: 'pointer' }}
                        alt={item.title}
                      />
                    </div>
                  </div>
                  <div className='row'>
                    <div className='col-12  mr-4'>
                      <h2 className='text-center fs-1' style={textStyle}>{item.title}</h2>
                      <div className="fs-2 fw-light mt-4"><b>Price: Rs.{item.price}</b></div>
                      <div className="fs-4 fw-light mb-4">Place: {item.place}</div>
                      <p class="text-end fs-5">Post added date: {item.date}</p>
                      {item.lastModifyDate && (
                        <p class="text-end fs-6">Last Modification Date: {item.lastModifyDate}</p>
                      )}
                    </div>                    
                  </div>                 
                </Link>
              </div>                               
        ))}</div> </div>
      

      {/* Pagination */}
      <div className='container-fulid m-4'>
        <div className='row'>
        <div className='col-5'></div>
      <nav className='col-3'>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => paginate(currentPage - 1)}>
              Previous
            </button>
          </li>
          {[...Array(Math.ceil((searchResult.length > 0 ? searchResult : items).length / ITEMS_PER_PAGE)).keys()].map((number) => (
            <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => paginate(number + 1)}>
                {number + 1}
              </button>
            </li>
          ))}
          <li className={`page-item ${currentPage === Math.ceil((searchResult.length > 0 ? searchResult : items).length / ITEMS_PER_PAGE) ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => paginate(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
      <div className='col-4'></div>
      </div>
      </div>
    </>
  );
};

export default ItemList;
