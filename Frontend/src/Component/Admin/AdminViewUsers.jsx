import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/DartTheme.css';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

const ITEMS_PER_PAGE = 5;

const AdminViewUsers = () => {
  const token =  sessionStorage.getItem('token');
  const adminId = sessionStorage.getItem('adminId')
  const navigate = useNavigate();
  const [reason, setReason] = useState('');
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [showNoResultsMessage, setShowNoResultsMessage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemId, setItemId] = useState('');

  
    useEffect(() => {
      // Fetch items from the backend API
      const fetchItems = async () => {
          const BearerToken = token;
        try {
          const response = await fetch(`http://localhost:8080/api/v1/admin/getAllUsers`, {
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
        console.log(items);
      };
      fetchItems();
    }, []);

    const handleItemId =(id) =>{
      setItemId(id);
  }
  
  
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

    const handleDelete = async (userId,itemRole) => {
      const role = itemRole.toString();
      try {
        const response = await fetch(`http://localhost:8080/api/v1/admin/removeUser/${userId}/${adminId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },body: JSON.stringify({reason,role})
        });
  
        if (response.ok) {
          console.log('Delete operation successful');
            setTimeout(() => {
              window.location.reload();
            }, 1000);    
            alert('Remove operation successful') 
        } else {
          console.error('Remove operation failed');
          alert('Remove operation failed')
        }
      } catch (error) {
        console.error('Error during remove operation', error);
        alert('Error during remove operation')
      }
    };
  
    const handleSearch = () => {
      // Reset to the first page when a new search is performed
      setCurrentPage(1);
  
      // Generate search term variations
      const searchVariations = generateSearchVariations(searchTerm.toLowerCase());
  
      // Filter items based on the cleaned search term
      const filteredItems = items.filter(item => {
        const cleanedTitle = item.fullName.toLowerCase().replace(/[^\w\s]/gi, '') ; // Remove symbols
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
        const cleanedTitle = item.fullName.toLowerCase().replace(/[^\w\s]/gi, ''); // Remove symbols
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
  
    const [isModalOpen, setIsModalOpen] = useState(false);
  
    const handleButtonClick = () => {
      setIsModalOpen(true);
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
  
    const handleChange = (event) => {
      event.preventDefault(); // Prevent default form submission behavior
      setReason(event.target.value)
  };


  return (
    <>

    <div className='container my-4'><NavBar/></div>
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

        </div>

      </div>
    </div>
  <div className='m-3'>
          {showNoResultsMessage && (
      <h4 style={textStyle}>No results found for "{searchTerm}".</h4>
    )}
  </div>


    <div>
      {currentItems.length !== 0 ?
      currentItems.map(item => (
        <div className='container-fluid border border-light m-4 view overlay zoom' key={item.id}>
          <div className='row m-3'>

            <div key={item.id}>
                <div className='row'>
                  <div className='col-4 '>
                    <div className="fs-4 fw-light ">E-mail:{item.email}</div>                                                       
                  </div> 
                  <div className='col-3'>
                    <div className="fs-4 fw-light ">Full Name: {item.fullName}</div>  
                  </div>
                  <div className='col-2'>
                    <div className="fs-4 fw-light ">Gender: {item.gender}</div>  
                  </div>
                  <div className='col-2'>
                    <div className="fs-4 fw-light ">DOB: {item.dob}</div>  
                  </div>
              <div className='col-1'>
                  <center><button className='btn btn-warning 'onClick={() => { handleItemId(item.id); handleButtonClick();}}>Remove</button></center>
                      <Modal
                                className='bg-dark'
                                shouldCloseOnOverlayClick={true}
                                isOpen={isModalOpen}
                                shouldCloseOnEsc={true}
                                onRequestClose={closeModal}
                                contentLabel="Example Modal"
                                style={modalStyle}>
                                <div className='fs-1 text-info bg-dark text-center '>Warning</div>
                                            <div className='fs-4 text-info bg-dark text-center my-3'>Are you sure to remove this user, which name is {item.fullName}?</div>

                            <label> Why are you delete this :  </label>           
                            <input type="text" name="nickName" value={reason} onChange={handleChange} class="form-control" required  />           

                                        <div className='row bg-dark my-3'>
                                        <div className='col-4'>
                                        </div>
                                        <div className='col-2 '>
                                            <button onClick={() => { handleDelete(item.userId, item.role); closeModal(); }} disabled={!reason.trim()}>Yes</button>
                                        </div>
                                        <div className='col-2 '>
                                            <button onClick={closeModal}>No</button>
                                  </div>                    
                            </div>                 
                  </Modal>
              </div>
            </div>
          </div>
        </div>
      </div>
      )): <li><div className='fs-1 '><center>"Currently, no any user found"</center></div></li>}
    </div>

    {/* Pagination */}
    <div className='container-fulid m-4'>
      <div className='row'>
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

  )
}

export default AdminViewUsers