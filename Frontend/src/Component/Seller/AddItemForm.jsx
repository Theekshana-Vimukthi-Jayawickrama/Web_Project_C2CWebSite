import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AddItemForm = () => {

  const token =  sessionStorage.getItem('token');
  const userId = sessionStorage.getItem('userId')
  const [telephoneError, setTelephoneError] = useState('');
  const navigate = useNavigate();

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

  const [deviceTypes, setDeviceTypes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);


  useEffect(() => {
    // setData(responseData);
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
      const response = await fetch(`http://localhost:8080/api/v1/item/${userId}/items/add`, {
        method: 'POST',
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
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error saving item and photos.');
      alert(errorMessage)
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
    <div className='container my-4 fs-1' style={textStyle}><center>Add New Post...</center> </div>

    <form onSubmit={handleSubmit} className='container'>
      <div className='row my-4'>
        <div className='col-lg-5 mx-4'>
          <label className='mb-1'>Title:</label>
          <input type="text" name="title" onChange={handleInputChange} className='form-control' required />
        </div>
        <div className='col-lg-5 mx-1'>
            <label className='mb-1'>Model:</label>
            <input type="text" name="model" onChange={handleInputChange} value={formData.model} className='form-control' required />
          </div>
      </div>

      <div className='row my-4'>
        <div className='col-lg-3 mx-4'>
          <label className='mb-1'>Device Type:</label>
          <select name="deviceType" onChange={handleInputChange} value={formData.deviceType} className='form-control' required>
            <option value="" disabled>Select device type</option>
            {deviceTypes.map((type,index) => (
              <option key={index} value={type.deviceType}>{type.deviceType}</option>
            ))}
          </select>
        </div>

        <div className='col-lg-3 mx-4'>
          <label className='mb-1'>Item Condition:</label>
          <select name="itemCondition" onChange={handleInputChange} value={formData.itemCondition} className='form-control' required>
            <option value="" disabled>Select item condition</option>
            <option value="new">New</option>
            <option value="old">Used</option>
          </select>
        </div>

        <div className='col-lg-3 mx-4'>
          <label className='mb-1'>Brand:</label>
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
          <label className='mb-1'>Price:</label>
          <input type="text" name="price" onChange={handleInputChange} className='form-control' required/>
        </div>
        <div className='col-lg-4 mx-4'>
          <label className='mb-1'>Phone Number:</label>
          <input  type="text" name="phoneNumber" onChange={handleInputChange} className='form-control'  onBlur={validateTelephone} placeholder="07xxxxxxxx" required />
          <div style={{ color: 'red' }}>{telephoneError}</div>
        </div>
      </div>

      <div className='row my-4'>
        <div className='col-lg-4 mx-4'>
          <label className='mb-1'>Place:</label>
          <input type="text" name="place" onChange={handleInputChange} className='form-control' required/>
        </div>
        <div className='col-lg-4 mx-4'>
          <label className='mb-1'>Description:</label>
          <textarea name="description" onChange={handleInputChange} className='form-control' required></textarea>
        </div>
      </div>

      <div className='row my-4'>
        <div className='col-lg-4 my-4'>
          <label className='mb-1'>Photo 1 (JPEG/PNG only):</label>
          <input type="file" name="photo1" accept=".jpeg, .jpg, .png" onChange={handleFileChange} />
          {formData.photo1Preview && (
            <img src={formData.photo1Preview} alt="Preview" style={{ width: '200px', maxHeight: '200px' }}  className='m-3'required/>
          )}
        </div>
        <div className='col-lg-4 my-4'>
          <label className='mb-1'>Photo 2 (JPEG/PNG only):</label>
          <input type="file" name="photo2" accept=".jpeg, .jpg, .png" onChange={handleFileChange} />
          {formData.photo2Preview && (
            <img src={formData.photo2Preview} alt="Preview" style={{ width: '200px', maxHeight: '200px' }}  className='m-3' required />
          )}
        </div>
        <div className='col-lg-4 my-4'>
          <label className='mb-1'>Photo 3 (JPEG/PNG only):</label>
          <input type="file" name="photo3" accept=".jpeg, .jpg, .png" onChange={handleFileChange} />
          {formData.photo3Preview && (
            <img src={formData.photo3Preview} alt="Preview" style={{ width: '200px', maxHeight: '200px' }} className='m-3' required />
          )}
        </div>
      </div>

      <div className='row my-4'>
          <button type="submit" className='btn btn-warning font-weight-bold fs-5'><b>Submit</b></button>
      </div>
    </form>
    </>
  );
};

export default AddItemForm;
