
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ImagePreviewModal from '../Admin/ImagePreviewModal';
import Modal from 'react-modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

const AdminItemDetail = () => {
    const { id } = useParams();
    const token =  sessionStorage.getItem('token');
    const adminId = sessionStorage.getItem('adminId')
    const [item, setItem] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [isModalOpen1, setIsModalOpen1] = useState(false);
      const [requesActivetData, setRequesActivetData] = useState({
      status: true,
      id: null,
      adminId: ""
    });
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchItem = async () => {
        try {
          const response = await fetch(`http://localhost:8080/api/v1/allItems/getItem/${id}`);
          const data = await response.json();
          setItem(data);
        } catch (error) {
          console.error('Error fetching items:', error);
        }
      };
      fetchItem();
    }, [id]);
  
    if (!item) {
      return <div>Loading...</div>;
    }
  
    // Filter out photos with missing data
    const itemPhotos = [
      { photoType: item.itemPhoto1?.photoType, data: item.itemPhoto1?.data, name: item.itemPhoto1?.name },
      { photoType: item.itemPhoto2?.photoType, data: item.itemPhoto2?.data, name: item.itemPhoto2?.name },
      { photoType: item.itemPhoto3?.photoType, data: item.itemPhoto3?.data, name: item.itemPhoto3?.name }
    ].filter(photo => photo.data); // Filter out photos with missing data
  
    const openImagePreview = (imageSrc) => {
      setSelectedImage(imageSrc);
    };
  
    const closeImagePreview = () => {
      setSelectedImage(null);
    };
  
    if (!item) {
      return <div>Loading...</div>;
    }
  
    const handleDelete = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/admin/deleteItem/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },body: JSON.stringify({reason,adminId})
        });
  
        if (response.status == 200) {
          console.log('Delete operation successful');
            setTimeout(() => {
              window.location.reload();
            }, 1000);    
            alert('Remove operation successful') 
            navigate(`/generalUserDetails`);
        } else {
          console.error('Remove operation failed');
          alert('Remove operation failed')
        }
      } catch (error) {
        console.error('Error during remove operation', error);
        alert('Error during remove operation')
      }
    };
  
    const handleActive = async () => {
      try {
              const data = {
                id: item.id,
                adminId: adminId 
              };
  
        const response = await fetch(`http://localhost:8080/api/v1/admin/activeItem`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          console.log('Active the User');
          
            setTimeout(() => {
              window.location.reload();
            }, 1000);    
            alert('Advertisement has been Activated') 
            navigate(`/adminViewAllAds`);
        } else {
          console.error('Activate operation failed');
          alert('Activate operation failed')
        }
      } catch (error) {
        console.error('Error during activation operation', error);
        alert('Error during activation operation')
      }
    };
  
    const handleButtonClick = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
    };
  
    const handleButtonClick1 = () => {
      setIsModalOpen1(true);
    };
  
    const closeModal1 = () => {
      setIsModalOpen1(false);
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
  
    const modalStyle1 = {
      content: {
        width: '50%', 
        top: isModalOpen1 ? '50%' : '-100%', 
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
    <center><div className='container m-4'><NavBar /></div></center>
        <div className='container my-4'>
            <div className='col-12'>
                <div className='row rounded m-4 text-light bg-dark'>
                    <div className='col-12 border text-center'>
                    <div className='fs-3 my-2 font-weight-bold text-center'><b>Wellcome</b></div>
                        <div className='fs-4 m-3'>title: {item.title || 'No title available'}</div>
                        <div className='fs-4 m-3'>Device Type: {item.deviceType || 'No model available'}</div>
                        <div className='fs-4 m-3'>Brand: {item.brand || 'No device type available'}</div>
                        <div className='fs-4 m-3'>Price: {item.price || 'No condition available'}</div>
                        <div className='fs-4 m-3'> Phone Number: {item.phoneNumber || 'No brand available'}</div>
                        <div className='fs-4 m-3'>Item Condition: {item.itemCondition || 'No price available'}</div>
                        <div className='fs-4 m-3'>Place: {item.place || 'No phone number available'}</div>
                        <div className='fs-4 m-3'>Date: {item.date || 'No date available'}</div>
                    </div>                   
                </div>
            </div>

        <div className='container border border-danger rounded m-4'>
        <div className='row'><div className='fs-5 text-center'>ITEM PHOTOS</div>
            <div className='col-lg-12 col-md-12 m-4'>
            
           
                <div className='row'>
                  {itemPhotos.map((photo, index) => (
                    <div key={index} className='col-lg-3 m-4'>
                      <img
                        className="d-block w-100 border border-dark border-4"
                        src={`data:${photo.photoType};base64,${photo.data}`}
                        alt={photo.name}
                        onClick={() => openImagePreview(`data:${photo.photoType};base64,${photo.data}`)}
                      />
                    </div>
                  ))}
                </div>

           
          </div>
            
           
            
        </div>
        </div>

        <ImagePreviewModal
        isOpen={!!selectedImage}
        onClose={closeImagePreview}
        imageSrc={selectedImage}
        altText={item.title}
        />

        <div className='container'>
        <div className='row'>
            <div className='col-5 mx-2'>
            <button className='btn btn-warning'onClick={handleButtonClick}>Remove</button>
                <Modal
                    className='bg-dark'
                    shouldCloseOnOverlayClick={true}
                    isOpen={isModalOpen}
                    shouldCloseOnEsc={true}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                    style={modalStyle}>
                    <div className='fs-1 text-info bg-dark text-center '>Warning</div>
                                <div className='fs-4 text-info bg-dark text-center my-3'>Are you sure to remove this Item, which title is {item.title}?</div>

                <label> Why are you delete this :  </label>           
                <input type="text" name="nickName" value={reason} onChange={handleChange} class="form-control" required  />           

                            <div className='row bg-dark my-3'>
                            <div className='col-4'>
                            </div>
                            <div className='col-2 '>
                                <button onClick={() => { handleDelete(); closeModal(); }} disabled={!reason.trim()}>Yes</button>
                            </div>
                            <div className='col-2 '>
                                <button onClick={closeModal}>No</button>
                            </div>                    
                    </div>                 
                </Modal>
            </div>

            <div className='col-5 mx-2'>
            {item.status == false ? 
            <button className='btn btn-warning'onClick={handleButtonClick1}>Active</button>  : null}
                <Modal
                    className='bg-dark'
                    shouldCloseOnOverlayClick={true}
                    isOpen={isModalOpen1}
                    shouldCloseOnEsc={true}
                    onRequestClose={closeModal1}
                    contentLabel="Example Modal"
                    style={modalStyle1}>
                    <div className='fs-1 text-info bg-dark text-center '>Alert!</div>
                                <div className='fs-4 text-info bg-dark text-center my-3'>Are you sure to Active this user, which name is {item.fullName}?</div>
                            <div className='row bg-dark my-3'>
                            <div className='col-4'>
                            </div>
                            <div className='col-2 '>
                                <button onClick={() => { handleActive(); closeModal1(); }} >Yes</button>
                            </div>
                            <div className='col-2 '>
                                <button onClick={closeModal1}>No</button>
                            </div>                    
                    </div>                 
                </Modal>
            </div>
        </div>
        </div>
    </div>
</>
  )
}

export default AdminItemDetail