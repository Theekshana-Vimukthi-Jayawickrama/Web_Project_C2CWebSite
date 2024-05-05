import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/DartTheme.css';
import NavBar from './NavBar';
import ImagePreviewModal1 from '../Common/ImagePreviewModal';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import axios from 'axios';

const AdminSliderAds = () => {
const token =  sessionStorage.getItem('token');
const adminId = sessionStorage.getItem('adminId')
const navigate = useNavigate();
const [items, setItems] = useState([]);  
const [selectedFile, setSelectedFile] = useState(null);
const [submitEnabled, setSubmitEnabled] = useState(false);
const [selectedImage, setSelectedImage] = useState(null);
    useEffect(() => {
        // Fetch items from the backend API
        const fetchItems = async () => {
            const BearerToken = token;
          try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/getSliderPhoto`, {
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

      const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const editPost = (itemId) => {
    navigate(`/editPost?itemId=${itemId}`);
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
    try {
      const response = await fetch(`http://localhost:8080/api/v1/admin/deleteSliderPhoto/${itemId}/${adminId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
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


  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setSubmitEnabled(true);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setSubmitEnabled(false);
  };
  
  const openImagePreview = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const closeImagePreview = () => {
    setSelectedImage(null);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('AdsPhoto', selectedFile);

      const response = await axios.post(`http://localhost:8080/api/v1/admin/addSliderPhoto/${adminId}`,formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        }
      });

      if(response.status == 200){
        alert("successfully added");
        window.location.reload();
      }else{
        alert("unsuccesfull!");
        window.location.reload();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <>
    <div className='container my-4'> <NavBar token={token} adminId={adminId}/> </div>
    <div className='fs-2 text-center m-4 text-light bg-dark'>SLIDER IMAGE PAGE</div>
    <div className='container border' style= {{height: '250px'}}>
        <div className='row'>        
            <div className='d-flex col-6  fs-1 border ' style= {{height: '250px'}}>
                <label htmlFor="fileInput" className="add-slider-button justify-content-center">
                    Add A Slider Image  <div className='fs-1'>Click Here...</div>
                </label>   
                <input
                    type="file"
                    id="fileInput"
                    accept="image/*"  
                    onChange={handleFileInputChange}
                    style={{ display: 'none' }} 
                />          
            </div> 
            <div className='col-6 border'>
                {selectedFile && (
                <div className="image-preview">
                    <center>
                <button onClick={handleRemoveImage} className="remove-button fs-4"> 
                <img src={URL.createObjectURL(selectedFile)} alt="Selected" style={{ width: 240, height: 240 }} />
                <FontAwesomeIcon icon={faTimes} />
                </button>                      
                    </center>
                </div>
                )}
            </div>     
      </div> 
      <div className='row'>
              {submitEnabled && (
               <button onClick={handleSubmit} className="submit-button my-4 button btn btn-warning" >
                Submit
                </button>
            )} 
      </div>

    <div className='my-4'> 
        <div className='row m-4'>
        {items.length !== 0 ?items.map(item => (
         
            <div key={item.imageId} className='col-3 border border-light p-1'>
                  <div className='row m-4'>

                    <div className='col-lg-12 col-md-4'>
                    {(
                    <img
                        className="no-border img-fluid img-thumbnail bg-image hover-zoom"
                        src={`data:${item.photoType};base64,${item.data}`}
                        style={{ width: '400px', maxHeight: '400px', cursor: 'pointer' }}
                        alt={item.name}
                        onClick={() =>
                        openImagePreview(
                            `data:${item.photoType};base64,${item.data}`
                        )                 
                        }
                    />
                    )}
                    
                    </div>
                </div>            
              <ImagePreviewModal1
                    isOpen={!!selectedImage}
                    onClose={closeImagePreview}
                    imageSrc={selectedImage}
                    altText={item.title}
                />            
            <div className='row mx-4'>
                
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
                          <div className='fs-4 text-info bg-dark text-center my-3'>Are you sure to delete this slider image, which title is {item.name}?</div>         
                        <div className='row bg-dark my-3'>
                        <div className='col-4'>
                        </div>
                        <div className='col-2 '>
                          <button onClick={() => {alert(item.imageId); handleDelete(item.imageId); closeModal(); }}>Yes</button>
                        </div>
                        <div className='col-2 '>
                          <button onClick={closeModal}>No</button>
                        </div>                    
                    </div>                 
                  </Modal>             
              </div>  </div>       
        ))     
  : <li><div className='fs-1 '><center>"Currently, no any advertisement found"</center></div></li>}      
  
    </div>
      </div>
      </div>
      
    </>
  )
}

export default AdminSliderAds