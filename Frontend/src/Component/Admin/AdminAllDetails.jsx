import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';

const AdminAllDetails = () => {

    const searchParams = new URLSearchParams(useLocation().search);
    const token =  sessionStorage.getItem('token');
    const id = searchParams.get('id')
    const navigate = useNavigate();


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
          setUserData({
            fullName: item.fullName|| '',
            nickName: item.nickName|| '',
            telephoneNumber: item.telephoneNumber || '',
            dob: item.dob || '',
            address: item.address || '',
            gender: item.gender || '',
            role: item.role  || '',
            residence: item.residence || '',
            email: item.email,
            photo: null,
          });
        }
      }, [item]);


      
    return (
    <>
     <cenetr><div className='container my-4'><NavBar /></div></cenetr>
     <div className='container my-4 fs-1'>
        <center>Admin's E-mail: {item && item.email ? item.email.toString() : 'Null'}</center>
    </div><br/>
    <div className='container my-4 fs-1'>      
        <div className='row my-4 fs-4 '>

          <div className='col-lg-6 col-md-12 d-flex flex-column '>
            <div className='m-1 m-4'>Full Name:  {userData.fullName} </div>
            <div className='m-1  m-4'>Role:  {userData.role}  </div>
            <div className='m-1  m-4'>Date of Birth: {userData.dob} </div>
            <div className='m-1  m-4'>Gender: {userData.gender.toUpperCase()} </div>
          </div>

          <div className='col-lg-4 col-md-12 d-flex flex-column'>
            <div className='m-1  m-4'>Nick Name: {userData.nickName}</div>
            <div className='m-1  m-4'>Address: {userData.address} </div>
            <div className='m-1  m-4'>Telephone Number: {userData.telephoneNumber} </div>
            
          </div>
        </div>
        </div>
      </>
    );
}

export default AdminAllDetails