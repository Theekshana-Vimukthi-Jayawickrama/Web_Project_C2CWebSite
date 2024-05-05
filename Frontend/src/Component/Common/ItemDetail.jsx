import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import NavBar from './NavBar';

const ItemDetail = () => {
  const [item, setItem] = useState(null);
  const { id } = useParams();

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

  return (
    <><center><div className='container m-4 '><NavBar /></div></center>
      <div className='container border border-warning '>
      
        <div className='row'>
          <div className='col-lg-12 fs-2 text-center p-4'><div className='fs-3'>{item.title}</div></div>
          <div className='col-lg-7 col-md-12 position-relative p-4 m-4'>
            <div id="carouselSliderOfItem" className="carousel carousel-dark slide">
              <div className="carousel-indicators mt-4 mx-2">
                {itemPhotos.map((photo, index) => (
                  <button   type="button" key={index} data-bs-target="#carouselSliderOfItem" data-bs-slide-to={index} className={index === 0 ? "active thumbnail mx-2 " : "btn thumbnail mx-2"} aria-label={`Slide ${index + 1}`}>
                    <img className="d-block w-100 border border-dark border-4  " src={`data:${photo.photoType};base64,${photo.data}`} alt={photo.name} />
                  </button>
                ))}
              </div>
              <div className="carousel-inner">
                {itemPhotos.map((photo, index) => (
                  <div key={index} className={index === 0 ? "carousel-item active" : "carousel-item"}>
                    <img className="d-block w-100" src={`data:${photo.photoType};base64,${photo.data}`} alt={photo.name} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='col-lg-1'></div>
          <div className='col-lg-3 col-md-12 m-4 p-4'>
            <div className='row'>
              <div className='col-lg-12 col-md-12 p-4'>
                <div className='fs-5 mb-4'>Posted on : {item.date}</div> 
                <div className='fs-5 mb-4'>Place : {item.place}</div> 
                <div className='fs-5 mb-4'>Call Seller: {item.phoneNumber}</div>
                <div className='fs-5'> 
                      <b>Safety tips</b><br></br>
                      <div className='fs-5'>Never share card details or OTPs, and always verify items in person before payment. PCHUB does not offer a delivery service. Stay vigilant!</div>
                
                </div>        
              </div>          
            </div>
          </div>

        </div>
        <div>
          <div className='row my-4'>
            <div className='col-lg-2'></div>
              <div className='col-lg-6'>
                  <div className='fs-2 m-4'>RS. {item.price}</div>
                  <div className='fs-5'>Condition : {item.itemCondition}</div>
                  <div className='fs-5'>Brand : {item.brand}</div>
                  <div className='fs-5'>Device Type : {item.deviceType}</div>
                  <div className='fs-5'>Model : {item.model}</div>

              </div>
              <div className='col-lg-4'>
                  <div className='fs-3 m-2'> <b>Description</b></div>
                  <div className='fs-5 mb-4'>{item.description}</div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemDetail;
