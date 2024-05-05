import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

const EditAdminPage = () => {

    const searchParams = new URLSearchParams(useLocation().search);
    const token =  sessionStorage.getItem('token');
    const userId = sessionStorage.getItem('userId')
    const id = searchParams.get('id')
    const [telephoneError, setTelephoneError] = useState(''); 
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);

     const [item, setItem] = useState(null);

      useEffect(() => {
        const fetchItem = async () => {
          try {
            const response = await fetch(`http://localhost:8080/api/v1/admin/getAdminAllDetails/${id}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            const data = await response.json();
            if (data && data.id) {
              setItem(data);
            } else {
              console.error('Error: Conductor ID not found in data');
            }
          
          } catch (error) {
            console.error('Error fetching items:', error);
          }
        };
        fetchItem();
      }, [id]);

      const [formData, setFormData] = useState({
        fullName: '',
        nickName: '',
        telephoneNumber: '',
        dob: '',
        address: '',
        gender: '',
        role:'',

      });

      const [userData, setUserData] = useState({
        fullName: '',
        nickName: '',
        telephoneNumber: '',
        dob: '',
        address: '',
        gender: '',
        role:'',

      });
      
      useEffect(() => {
        if (item) {
          setFormData({
            fullName: item.fullName|| '',
            nickName: item.nickName|| '',
            telephoneNumber: item.telephoneNumber || '',
            dob: item.dob || '',
            address: item.address || '',
            gender: item.gender || '',
            role: item.role  || '',
          });
          setUserData({
            fullName: item.fullName|| '',
            nickName: item.nickName|| '',
            telephoneNumber: item.telephoneNumber || '',
            dob: item.dob || '',
            address: item.address || '',
            gender: item.gender || '',
            role: item.role  || '',
          });
        }
      }, [item]);

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
      data.append('request', JSON.stringify(formData));
      data.append('photo', formData.photo);

  
      try {
        const response = await fetch(`http://localhost:8080/api/v1/admin/updateAdminDetails/${id}`, {
          method: 'PUT',
          body: data,
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          alert('User saved successfully')
          console.log('User saved successfully');
          navigate('/adminPage');
          window.location.reload();
        } else {
          const error = await response.text();
          setErrorMessage(`Error saving user: ${error}`);
          alert(errorMessage)
          navigate('/adminPage');
          window.location.reload();
        }
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage('Error saving user.');
        alert(errorMessage)
        navigate('/adminPage');
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
    fontWeight: 'bold',
    userSelect: 'none',
  };
    return (
    <>
     <cenetr><div className='container my-4'><NavBar /></div></cenetr>
     <div className='container my-4 fs-1' style={textStyle}>
        <center>Admin E-mail: {item && item.conductorId ? item.conductorId.toString() : 'Null'}</center>
      </div>
      <form onSubmit={handleSubmit} className='container my-4 fs-5 text-left'>

      <div className='container border border-danger rounded m-4'>
            <div className='row'>
                <div className='row'>
                    <div className='fs-1 text-center text-danger'>
                        Warnning
                    </div>
                    <div className='fs-4 m-3 text-center'>
                        If no photo is selected as well as not change details, the previous details will be set as the default.
                    </div>
                </div>

            </div>
        </div>
        
        <div className='row my-4 '>
          
          <div className='col-lg-5 col-md-12 mx-4 '>
            <label className='mb-1'>Full Name: Default " {userData.fullName} "</label>
            <input type="text" name="fullName" onChange={handleInputChange} className='form-control' required value={formData.fullName} />
          </div>
          <div className='col-lg-5 col-md-12 mx-4'>
            <label className='mb-1'>Nick Name: Default " {userData.nickName} "</label>
            <input type="text" name="nickName" onChange={handleInputChange} value={formData.nickName} className='form-control' required />
          </div>
        </div>
        <div className='row my-4'>
        <div className='col-lg-10 col-md-12 mx-4'>
            <label className='mb-1'>Role:  Default " {userData.role} " </label>
            <input type="text" name="role" onChange={handleInputChange} value={formData.role} className='form-control' required disabled/>
        </div>
        </div>        
        <div className='row my-4'>
          <div className='col-lg-5 col-md-12 mx-4'>
            <label className='mb-1'>Date of Birth:  Default " {userData.dob} "</label>
            <input type="text" name="dob" onChange={handleInputChange} className='form-control' value={formData.dob} required/>
          </div>
          <div className='col-lg-5 col-md-12 mx-4'>
            <label className='mb-1'>Address:  Default " {userData.address} "</label>
            <input  type="text" name="address" onChange={handleInputChange} className='form-control' value={formData.address} required />         
          </div>
        </div>
  
        <div className='row my-4'>
              <div className='col-lg-5 col-md-12 mx-4'>
                <label className='mb-1'>Gender: Default " {userData.gender.toUpperCase()} "</label>
                <select value={formData.gender} name="gender" onChange={handleInputChange} className='form-control' required>
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

          <div className='col-lg-5 col-md-12 mx-4'>
            <label className='mb-1'>Telephone Number:  Default " {userData.telephoneNumber} "</label>
            <input name="telephoneNumber" onChange={handleInputChange} className='form-control' required value={formData.telephoneNumber}  onBlur={validateTelephone} placeholder="07xxxxxxxx" ></input>
            <div style={{ color: 'red' }}>{telephoneError}</div>
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

export default EditAdminPage