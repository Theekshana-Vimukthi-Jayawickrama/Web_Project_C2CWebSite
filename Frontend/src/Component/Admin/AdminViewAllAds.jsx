import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/DartTheme.css';
import NavBar from './NavBar';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const ITEMS_PER_PAGE = 5;

const AdminViewAllAds = () => {
    const token =  sessionStorage.getItem('token');
    const adminId = sessionStorage.getItem('adminId')
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reason, setReason] = useState('');
    
    const [items, setItems] = useState([]);
    const [name, setName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showNoResultsMessage, setShowNoResultsMessage] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filter, setFilter] = useState('all'); // Default filter is 'all'

    // Define textStyle object
    const textStyle = {
        color: '#FFD700',
        fontWeight: 'bold',
        userSelect: 'none',
    };

    const closeModal = () => {
        setIsModalOpen(false);
      };
    
      const modalStyle = {
        content: {
          width: '50%', 
          top: isModalOpen ? '50%' : '-100%', 
          left: '50%',
          transform: 'translate(-50%, -50%)',
          transition: 'top 0.3s ease-in-out', 
          zIndex: 2000, 
          border: '10px solid #FFD700',
          opacity:0.75,
          fontWeight: 'bold',
          borderRadius: '10px',
          padding: '20px',
          position: 'relative',
          
        },
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          transition: 'background-color 0.3s ease-in-out', 
        },
      };

      const handleDelete = async (itemId) => {
        const token = token;
        const userId =adminId;
        try {
          const response = await fetch(`http://localhost:8080/api/v1/admin/deleteItem/${itemId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },body: JSON.stringify({reason,userId})
          });
    
          if (response.status == 200) {
            console.log('Delete operation successful');
              setTimeout(() => {
                window.location.reload();
              }, 1000);    
              alert('Delete operation successful') 
          } else {
            console.error('Delete operation failed');
            alert('Delete operation failed')
          }
        } catch (error) {
          console.error('Error during delete operation', error);
          alert('Error during delete operation')
        }
      };
    

    useEffect(() => {
        // Fetch items from the backend API
        const fetchItems = async () => {
           
          try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/getAllItems`, {
                headers: {
                  'Authorization': `Bearer ${token}`,
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
          // Fetch user name or any other data if needed
        };
    
        fetchName();
    }, [token,adminId]);

    const handleSearch = () => {
        // Reset to the first page when a new search is performed
        setCurrentPage(1);
    
        // Generate search term variations
        const searchVariations = generateSearchVariations(searchTerm.toLowerCase());
    
        // Filter items based on the cleaned search term
        const filteredItems = items.filter(item => {
        const cleanedTitle = item.title.toLowerCase().replace(/[^\w\s]/gi, '') + item.deviceType.toLowerCase().replace(/[^\w\s]/gi, '') + item.id; // Remove symbols
        const matchesSearch = searchVariations.some(variation => cleanedTitle.includes(variation));

            if (filter === 'active') {
                return item.status === true && matchesSearch;
            } else if (filter === 'pending') {
                return item.status !== true && matchesSearch;
            } else {
                return matchesSearch; // 'all' filter, return all items that match the search query
            }

        });
    
        setSearchResult(filteredItems);  
        // Update the state to show the message only if no results are found and the search button is clicked
        setShowNoResultsMessage(filteredItems.length === 0 && searchTerm !== '');
    };
    const handleChange = (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        setReason(event.target.value)
    
      };


    const handleInputChange = (e) => {
        const newSearchTerm = e.target.value;
        setSearchTerm(newSearchTerm);
    
        // Automatic filtering as the user types
        const cleanedSearchTerm = newSearchTerm.replace(/[^\w\s]/gi, ''); // Remove symbols
        const filteredItems = items.filter(item => {
          const cleanedTitle = item.title.toLowerCase().replace(/[^\w\s]/gi, ''); // Remove symbols
        const matchesSearch = ( cleanedTitle.includes(cleanedSearchTerm));

        if (filter === 'active') {
            return item.status === true && matchesSearch;
        } else if (filter === 'pending') {
            return item.status !== true && matchesSearch;
        } else {
            return matchesSearch; // 'all' filter, return all items that match the search query
        }
        });

        setSearchResult(filteredItems);
        setShowNoResultsMessage(false);
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

    const handleFilterChange = (event) => {
        const selectedFilter = event.target.value;
        setFilter(selectedFilter);
    };

    // Filter items based on the selected filter
    const filteredItems = items.filter(item => {
        if (filter === 'active') {
            return item.status === true;
        } else if (filter === 'pending') {
            return item.status !== true;
        } else {
            return true; 
        }
    });
    const handleButtonClick = () => {
        setIsModalOpen(true);
      };
    

    // Calculate the index range for the current page
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = (searchResult.length > 0 ? searchResult : filteredItems).slice(indexOfFirstItem, indexOfLastItem);

    // Update page number
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
        <div className='container my-4'> <NavBar token={token} adminId={adminId}/> </div>


            {/* Search input */}
            <div className='container m-4'>
                <div className='d-flex m-4 '>
                    <div className='input-group mb-3 '>
                        <label htmlFor="search" className='d-none d-sm-block input-group-append mx-3' style={textStyle}>Search by name: </label>
                        <input
                            className="form-control rounded"
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
                                    {/* Dropdown menu for selecting filter */}
                        <div className="mx-4">
                            <select className="form-select" value={filter} onChange={handleFilterChange}>
                                <option value="all">All Ads</option>
                                <option value="active">Active Ads</option>
                                <option value="pending">Pending Ads</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            {/* No results message */}
            <div className='m-3'>
                {showNoResultsMessage && (
                    <h4 style={textStyle}>No results found for "{searchTerm}".</h4>
                )}
            </div>
            {/* Display items based on the filteredItems */}

                {/* Display items based on the filteredItems */}
                
        <div className='container-fluid m-4 view overlay zoom' >
            <div className='row m-4'>
                {currentItems.length !== 0 ? currentItems.map(item => (                
                                <div className='col-lg-5 border border-light m-4' key={item.id}>
                                     <Link to={`/adminItems/${item.id}`} className="text-light text-decoration-none">
                                        <div className='row '>                  
                                                <div className='col-6 '>
                                                  <h2 className=' fs-2' style={textStyle}>{item.title}</h2>
                                                    <img
                                                      className="no-border img-fluid img-thumbnail bg-image hover-zoom"
                                                      src={`data:${item.itemPhoto1.photoType};base64,${item.itemPhoto1.data}`}
                                                      style={{height : '100px'}}
                                                      alt={item.title}
                                                    />
                                                    <div className='fs-3 fw-light mb-1' style={textStyle}>Status: {item.status ? "Active" : "Pending"}</div>
                  
                                                </div>
                                                <div className='col-6 my-4'>
                                                  <div className="fs-5 fw-light mt-4">Price: Rs.{item.price}</div>
                                                    <div className="fs-5 fw-light ">Place: {item.place}</div>
                                                    <p class="fs-6 my-2">Post Added Date: {item.date}</p>
                                                        {item.lastModifyDate && (
                                                          <p class=" fs-6">Last Modification Date: {item.lastModifyDate}</p>
                                                      )}
                                        </div>    
                                    </div>
                                </Link>
                                <div className='row'>
                                    <button className='btn btn-warning'onClick={handleButtonClick}>Delete</button>
                                        <Modal
                                        className='bg-dark'
                                        shouldCloseOnOverlayClick={true}
                                        isOpen={isModalOpen}
                                        shouldCloseOnEsc={true}
                                        onRequestClose={closeModal}
                                        contentLabel="Example Modal"
                                        style={modalStyle}>
                                                <div className='fs-1 text-info bg-dark text-center '>Warning!</div>
                                                <div className='fs-4 text-info bg-dark text-center my-3'>Are you sure to delete this post, which title is {item.title}?</div>
                                                <label> Why are you delete this :  </label>           
                                                <select className="form-select" value={reason} onChange={handleChange}>
                                                <option value="" disabled >Select reason</option>
                                                <option value="Sold">Sold</option>
                                                <option value="Take a long time">Take a long time</option>
                                                <option value="Change my mind">Change my mind</option>
                                                <option value="Another reason">Another reason</option>
                                                </select>

                                            <div className='row bg-dark my-3'>
                                            <div className='col-4'>
                                            </div>
                                            <div className='col-2 '>
                                                <button onClick={() => { handleDelete(item.id); closeModal(); }} disabled={!reason.trim()}>Yes</button>
                                            </div>
                                            <div className='col-2 '>
                                                <button onClick={closeModal}>No</button>
                                            </div>                    
                                        </div>                 
                                    </Modal>
                                </div>
                            </div>                                    
                        )): <div className='fs-1 '><center>"Currently, no any advertisement found"</center></div>} 
                </div>
            </div>          
                            
    

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
                            {[...Array(Math.ceil((searchResult.length > 0 ? searchResult : filteredItems).length / ITEMS_PER_PAGE)).keys()].map((number) => (
                                <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => paginate(number + 1)}>
                                        {number + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === Math.ceil((searchResult.length > 0 ? searchResult : filteredItems).length / ITEMS_PER_PAGE) ? 'disabled' : ''}`}>
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
}

export default AdminViewAllAds;
