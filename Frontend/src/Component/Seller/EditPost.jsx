import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import '../CSS/DartTheme.css';

const EditPost = () => {

    const searchParams = new URLSearchParams(useLocation().search);
    const token =  sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId')
    const id = searchParams.get('itemId')
    const [telephoneError, setTelephoneError] = useState(''); 
    const navigate = useNavigate();

     const [item, setItem] = useState(null);

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

      const [formData, setFormData] = useState({
        title: '',
        deviceType: '',
        brand: '',
        description: '',
        price: '',
        phoneNumber: '',
        place: '',
        itemCondition: '',
        model: '',
        photo1: null,
        photo2: null,
        photo3: null,
      });
      
      useEffect(() => {
        if (item) {
          setFormData({
            title: item.title || '',
            deviceType: item.deviceType || '',
            brand: item.brand || '',
            description: item.description || '',
            price: item.price || '',
            phoneNumber: item.phoneNumber || '',
            place: item.place || '',
            itemCondition: item.itemCondition || '',
            model: item.model || '',
            photo1: null,
            photo2: null,
            photo3: null,
          });
        }
      }, [item]);

    const [deviceTypes, setDeviceTypes] = useState([]);
    const [brands, setBrands] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
   
    useEffect(() => { 
      const fetchData = async () => {
        
        try {   
            const deviceTypesResponse = await axios.get('http://localhost:8080/api/v1/item/getDeviceType', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });  
            const deviceTypesArray = deviceTypesResponse.data;
            setDeviceTypes(deviceTypesArray);
  
            const brandsResponse = await axios.get('http://localhost:8080/api/v1/item/getBrands', {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });  
            const brandArray = brandsResponse.data;       
            setBrands(brandArray); 
  
        } catch (error) {
          console.error('Error fetching device types and brands:', error.message);
        }
      };
  
      fetchData();
    }, [token]);

    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    
    };
    const handleFileChange = (e) => {
        const allowedTypes = ['image/jpeg', 'image/png'];
      
        if (e.target.files.length > 0) {
          const file = e.target.files[0];
      
          // Validate file type
          if (allowedTypes.includes(file.type)) {
            setFormData({ ...formData, [e.target.name]: file });
      
            // Read the image and set the preview
            const reader = new FileReader();
      
            reader.onload = (event) => {
              const imagePreview = event.target.result;
              setFormData((prevData) => ({ ...prevData, [`${e.target.name}Preview`]: imagePreview }));
            };
      
            reader.readAsDataURL(file);
          } else {
            alert('Invalid file type. Please upload a JPEG or PNG image.');
          }
        } else {
          // Clear the file and the preview if the user deselects the file
          setFormData((prevData) => ({ ...prevData, [e.target.name]: null, [`${e.target.name}Preview`]: null }));
        }
      };
      
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      const data = new FormData();
      data.append('itemDetails', JSON.stringify(formData));
      data.append('itemPhoto1', formData.photo1);
      data.append('itemPhoto2', formData.photo2);
      data.append('itemPhoto3', formData.photo3);
  
      try {
        const response = await fetch(`http://localhost:8080/api/v1/item/modifyItem/${id}`, {
          method: 'PUT',
          body: data,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          alert('Item and photos saved successfully')
          console.log('Item and photos saved successfully');
          navigate('/sellerHome');
          window.location.reload();
        } else {
          const error = await response.text();
          setErrorMessage(`Error saving item and photos: ${error}`);
          alert(errorMessage)
          navigate('/sellerHome');
          window.location.reload();
        }
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage('Error saving item and photos.');
        alert(errorMessage)
        navigate('/sellerHome');
        window.location.reload();
      }
    };
  
    
    const validateTelephone = () => {
      const telephoneRegex = /^0\d{9}$/;
      if (!telephoneRegex.test(formData.telephone)) {
        setTelephoneError('Telephone should be 10 digits and start with 0.');
        return false;
      } else {
        setTelephoneError('');
        return true;
      }
    };
    
  const textStyle = {
    color: '#FFD700',
    fontWeight: 'bold',
    userSelect: 'none',
  };
    return (
    <>
    <div className='container my-4 fs-1' style={textStyle}><center>Edit Post: {formData.title}</center> </div>
      <form onSubmit={handleSubmit} className='container my-4'>
        
        <div className='row my-4'>
          <div className='col-lg-5 mx-4'>
            <label className='mb-1'>Title: Default value is " <b>{formData.title} </b>"</label>
            <input type="text" name="title" onChange={handleInputChange} className='form-control' required value={formData.title} />
          </div>
          <div className='col-lg-5 mx-1'>
            <label className='mb-1'>Model:  Default value is " <b>{formData.model} </b>" </label>
            <input type="text" name="model" onChange={handleInputChange} value={formData.model} className='form-control' required />
          </div>
        </div>
  
        <div className='row my-4'>
          <div className='col-lg-3 mx-4'>
            <label className='mb-1'>Device Type: Default value is " <b>{formData.deviceType} </b>"</label>
            <select name="deviceType" onChange={handleInputChange} value={formData.deviceType} className='form-control' required>
              <option value="" disabled>Select device type</option>
              {deviceTypes.map((type,index) => (
                <option key={index} value={type.deviceType}>{type.deviceType}</option>
              ))}
            </select>
          </div>

          <div className='col-lg-3 mx-4'>
          <label className='mb-1'>Item Condition: Default value is " <b>{formData.itemCondition} </b>"</label>
          <select name="itemCondition" onChange={handleInputChange} value={formData.itemCondition} className='form-control' required>
            <option value="" disabled>Select item condition</option>
            <option value="new">New</option>
            <option value="old">Used</option>
          </select>
        </div>
  
          <div className='col-lg-3 mx-4'>
            <label className='mb-1'>Brand: Default value is " <b>{formData.brand} </b>"</label>
            <select name="brand" onChange={handleInputChange} value={formData.brand} className='form-control'required>
              <option value="" disabled>Select brand</option>
              {brands.map((brand,index) => (
                <option key={index} value={brand.brand}>{brand.brand}</option>
              ))}
            </select>
          </div>
        </div>
                
        <div className='row'>
          <div className='col-lg-4 mx-4'>
            <label className='mb-1'>Price: Default value is " <b>{formData.price} </b>"</label>
            <input type="text" name="price" onChange={handleInputChange} className='form-control' value={formData.price} required/>
          </div>
          <div className='col-lg-4 mx-4'>
            <label className='mb-1'>Phone Number: Default value is " <b>{formData.phoneNumber} </b>"</label>
            <input  type="text" name="phoneNumber" onChange={handleInputChange} className='form-control' value={formData.phoneNumber}  onBlur={validateTelephone} placeholder="07xxxxxxxx" required />
            <div style={{ color: 'red' }}>{telephoneError}</div>
          </div>
        </div>
  
        <div className='row my-4'>
          <div className='col-lg-4 mx-4'>
            <label className='mb-1'>Place: Default value is " <b>{formData.place} </b>"</label>
            <input type="text" value={formData.place} name="place" onChange={handleInputChange} className='form-control' required/>
          </div>
          <div className='col-lg-4 mx-4'>
            <label className='mb-1'>Description: Default value is " <b>{formData.description} </b>"</label>
            <textarea name="description" onChange={handleInputChange} className='form-control' required value={formData.description}></textarea>
          </div>
        </div>

        <div className='container border border-danger rounded m-4'>
            <div className='row'>
                <div className='row'>
                    <div className='fs-1 text-center text-danger'>
                        Warnning
                    </div>
                    <div className='fs-4 m-3'>
                        If no photo is selected, the previous photos will be set as the default. Previous photos show in below.
                    </div>
                </div>
                <div className='col-lg-3 m-4'>
                    <div className='fs-5'>Photo 1</div>
                    {item && item.itemPhoto1 && (
                        <img
                            className="no-border img-fluid img-thumbnail bg-image hover-zoom"
                            src={`data:${item.itemPhoto1.photoType};base64,${item.itemPhoto1.data}`}
                            style={{ width: '200px', maxHeight: '200px' }}
                            alt={item.title}
                        />
                    )}
                </div>
                <div className='col-lg-3 m-4'>
                    <div className='fs-5'>Photo 2</div>
                    {item && item.itemPhoto2 && (
                        <img
                            className="no-border img-fluid img-thumbnail bg-image hover-zoom"
                            src={`data:${item.itemPhoto2.photoType};base64,${item.itemPhoto2.data}`}
                            style={{ width: '200px', maxHeight: '200px' }}
                            alt={item.title}
                        />
                    )}
                </div>
                <div className='col-lg-3 m-4'>
                    <div className='fs-5'>Photo 3</div>
                    {item && item.itemPhoto3 && (
                        <img
                            className="no-border img-fluid img-thumbnail bg-image hover-zoom"
                            src={`data:${item.itemPhoto3.photoType};base64,${item.itemPhoto3.data}`}
                            style={{ width: '200px', maxHeight: '200px' }}
                            alt={item.title}
                        />
                    )}
                </div>

            </div>
        </div>
  
        <div className='row my-4 '>
            <div className='col-lg-4 my-4'>
            <label className='mb-1'>Photo 1 (JPEG/PNG only):</label>
            <input type="file" name="photo1" accept=".jpeg, .jpg, .png" onChange={handleFileChange} />
            {formData.photo1Preview && (
                <img src={formData.photo1Preview} alt="Preview" style={{ width: '200px', maxHeight: '200px' }}  className='mt-3'required />
            )}
            </div>
            <div className='col-lg-4 my-4'>
                <label className='mb-1'>Photo 2 (JPEG/PNG only):</label>
                <input type="file" name="photo2" accept=".jpeg, .jpg, .png" onChange={handleFileChange} />
                {formData.photo2Preview && (
                <img src={formData.photo2Preview} alt="Preview" style={{ width: '200px', maxHeight: '200px' }}  className='mt-3' required />
                )}
            </div>
            <div className='col-lg-4 my-4'>
                <label className='mb-1'>Photo 3 (JPEG/PNG only):</label>
                <input type="file" name="photo3" accept=".jpeg, .jpg, .png" onChange={handleFileChange} />
                {formData.photo3Preview && (
                <img src={formData.photo3Preview} alt="Preview" style={{ width: '200px', maxHeight: '200px' }} className='mt-3' required />
                )}
            </div>
        </div>
                    <br/>
        <div className='row my-2 ' >
            <button type="submit" className='btn btn-warning font-weight-bold fs-5'><b>Submit</b></button>
        </div>
      </form>
      </>
    );
}

export default EditPost