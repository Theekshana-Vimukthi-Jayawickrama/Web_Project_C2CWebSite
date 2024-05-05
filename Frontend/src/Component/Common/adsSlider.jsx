import React, { useEffect, useState } from 'react'

const AdsSlider = () => {
    
    const [items, setItems] = useState([]); 
    useEffect(() => {
        // Fetch items from the backend API
        const fetchItems = async () => {
          try {
            const response = await fetch(`http://localhost:8080/api/v1/allItems/getSliderPhoto`, {
                headers: {
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
  return (
    <>
        <div className='container border border-warning rounded'>
        <div className='row'>
          <div className='position-relative'>
            <div id="carouselSliderOfItem" className="carousel carousel-dark slide" data-bs-ride="carousel">
              <div className="carousel-indicators">
                {items.map((photo, index) => (
                  <button   type="button" key={index} data-bs-target="#carouselSliderOfItem"  data-bs-slide-to={index} className={index === 0 ? "active thumbnail mx-2 " : "btn thumbnail mx-2"} aria-label={`Slide ${index + 1}`}>                  
                  </button>
                ))}
              </div>
              <div className="carousel-inner">
                {items.map((photo, index) => (
                  <div key={index} className={index === 0 ? "carousel-item active" : "carousel-item"}>
                    <img className="d-block w-100" src={`data:${photo.photoType};base64,${photo.data}`} alt={photo.name}  style={{ width: '100%', maxHeight: '400px', cursor: 'pointer',objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselSliderOfItem" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselSliderOfItem" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
            </button>
            </div>
          </div>
        </div>
    </div>
    
    </>
  )
}

export default AdsSlider