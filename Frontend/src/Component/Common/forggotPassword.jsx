import React, { useState } from 'react'
import axios from 'axios';
import validator from 'validator';
import { useNavigate } from 'react-router-dom'; 

const ForggotPassword = () => {

    const[email, setEmail] = useState('');
    const navigate = useNavigate();
   const [confirmPasswordError,setConfirmPasswordError] =useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showPassword1, setShowPassword1] = useState(false);
    const [passwordMatch, setPasswordMatch] = useState(true);

    const [formData,setFormData] = useState({
        email: '',
        password:'',
        confirmPassword:'',
        otp:''
    })

    const handleSubmit = async () => {
      const isPasswordValid = validatePassword();
      const isConfirmPasswordValid = validateConfirmPassword();
     
      if (otpVerified) { 
        if(isPasswordValid && isConfirmPasswordValid){
        try {
      const response = await axios.put(`http://localhost:8080/api/v1/auth/updatePassword/${formData.email}`, formData);
         alert("Succesful Registered.");
          if(response.status == 200){
            alert("Succesfully updated.");
              navigate('/');
                      
          console.log(response.data);
          }
  
        } catch (error) {  
          navigate('/');
               alert('Error');   
          console.error(error);
        }}else{
          alert("Please, Enter Strong Password")
        }
      }else{
         
          alert("Fill Out All Input field.")
      }
    };
    

    const handleResendOTP = async () => {
        try {
          await axios.post('http://localhost:8080/api/v1/otp/reSendOTP', {
            email: formData.email,
          });
          setResendCooldown(120); // Reset the cooldown to 2 minutes
        } catch (error) {
        }
      };

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (name === 'confirmPassword') {
          setPasswordMatch(formData.password === value);
        }
      };

      
  const validateConfirmPassword = () => {
    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError('Passwords do not match.');
      return false;
    } else {
      setConfirmPasswordError('');
      return true;
    }
  };
    
      const handleVerifyOTP = async () => {
        try {
          const response = await axios.post('http://localhost:8080/api/v1/otp/verifyOTP', {
            email: formData.email,
            otp: parseInt(formData.otp, 10),
          });
          setOtpVerified(true);
        } catch (error) {
          alert('Incorrect OTP entered');
        }
      };

      const validatePassword = () => {
        const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/;
        
        const isValid = passwordRegex.test(formData.password);
        console.log('Password:', formData.password);
        console.log('Is Valid:', isValid);
      
        if (isValid) {
          // Password meets the criteria
          setPasswordError('');
          return true;
        } else {
          // Password does not meet the criteria
          setPasswordError('Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol.');
          return false;
        }
      };  

      const validateEmail = () => {
        if (!validator.isEmail(formData.email)) {
          setEmailError('Invalid email format');
          return false;
        } else {
          setEmailError('');
          return true;
        }
      };

      const handleSendOTP = async () => {
        if (
          !validateEmail() ||
          !validatePassword() ||
          !validateConfirmPassword()
        ) {
          alert("Invalid input")
    
        }else{
             try {
                await axios.post('http://localhost:8080/api/v1/otp/sendOTP', { email: formData.email });
                setOtpSent(true);
                setResendCooldown(120);
                } catch (error) {
                alert('Failed to send OTP. Please try again.');
            }
        }       
      };
        
        const togglePasswordVisibility1 = () => {
            setShowPassword1((prevShowPassword) => !prevShowPassword);
          };
        const togglePasswordVisibility2 = () => {
            setShowPassword((prevShowPassword) => !prevShowPassword)
        };
    
  return (
    <>
     <div className='fs-2 text-center m-4'> Change My Password...</div>
    <form>
        <div class="mb-3 form-row">
            <div className='container m-4'>
                    <div className='row '>
                        <div className='col-lg-4'></div>
                        <div className='col-lg-4'>
                            <label  class="form-label">Email address : </label>
                            <input onBlur={validateEmail} class="form-control" name='email' type='email' value={formData.email} placeholder='Enter your email'  onChange={handleChange}  disabled = {otpVerified} required/> 
                        <div class="mb-3">
                            <label>Password</label>
                            <div className='row'>
                                <div className='col-8'>
                                    <input name='password' onBlur={validatePassword} type={showPassword1 ? 'text' : 'password'} class="form-control" value={formData.password} onChange={handleChange} required/>
                                </div>
                                <div className='col-4'>
                                    <button className='btn btn-outline-secondary'type='button'onClick={togglePasswordVisibility1}>
                                        {showPassword1 ? 'Hide' : 'Show'} {/* Toggle button text */}
                                    </button>
                                </div>

                            </div>
    
                        </div>
                        <div class="mb-3">
                            <label for="exampleInputPassword1" class="form-label">Confirm Password</label>
                            <div className='row'>
                                <div className='col-8'>
                                    <input name='confirmPassword' onBlur={validatePassword} type={showPassword ? 'text' : 'password'} class="form-control" value={formData.confirmPassword} onChange={handleChange} required/>
                                </div>
                                <div className='col-4'>
                                    <button className='btn btn-outline-secondary'type='button'onClick={togglePasswordVisibility2}>
                                        {showPassword ? 'Hide' : 'Show'} {/* Toggle button text */}
                                    </button>
                                </div>

                            </div>
                        </div>
                        <div className='col-lg-4'></div>
                    </div>            
                </div>

                <div className='row'>
                <div className='container'>
            <div className='row'>
            <div className='col-4 m-4'>
                      {otpSent && !otpVerified && (
                        <>
                        <label className='px-1'>
                            Enter OTP:
                            <input type="text" name="otp" onChange={handleChange} />
                        </label>
                        <button type="button" onClick={handleVerifyOTP} class="btn btn-warning mx-2">
                            Verify OTP
                        </button>
                        </>
                    )}
            </div>
                <div className='col-lg-6 m-4'>
                {!otpVerified && (
                    <>
                        <button
                        type="button"
                        onClick={otpSent ? handleResendOTP : handleSendOTP}
                        disabled={resendCooldown > 0}
                        className="btn btn-warning mx-2"
                        >
                        {otpSent ? 'Resend OTP' : 'Send OTP'}
                        </button>
                        {resendCooldown > 0 && <p>Resend cooldown: {resendCooldown} seconds</p>}
                    </>
                    )}
                </div>
  
            </div> 
        </div>  
        <div className='container'>
            <div className='row col-10'>
                {otpVerified && (
                    <button type="button" onClick={handleSubmit} class="btn btn-warning m-4">
                            Submit
                    </button>
                )}      
            </div>

   
        </div>
                </div>
            </div>
        </div>

    </form>
    
    </>
  )
}

export default ForggotPassword