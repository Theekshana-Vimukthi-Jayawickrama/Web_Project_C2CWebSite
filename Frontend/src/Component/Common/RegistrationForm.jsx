import React, { useState, useEffect } from 'react';
import axios from 'axios';
import validator from 'validator';
import { useNavigate } from 'react-router-dom'; 



const RegistrationForm = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    nickName: '',
    dob: '',
    gender: '',
    address: '',
    telephone: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [telephoneError, setTelephoneError] = useState('');
  const [dobError, setDobError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

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

  useEffect(() => {
    setEmailError('');
  }, [formData.email]);

  const validateEmail = () => {
    if (!validator.isEmail(formData.email)) {
      setEmailError('Invalid email format');
      return false;
    } else {
      setEmailError('');
      return true;
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

  const togglePasswordVisibility1 = () => {
    setShowPassword1((prevShowPassword) => !prevShowPassword);
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

  const validateDob = () => {
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dobRegex.test(formData.dob)) {
      setDobError('Date of Birth should be in the format YYYY-MM-DD.');
      return false;
    } else {
      setDobError('');
      return true;
    }
  };

  const validateFullName = () => {
    if (!formData.fullName.trim()) {
      setFullNameError('Full Name is required.');
      return false;
    } else {
      setFullNameError('');
      return true;
    }
  };

  const handleSendOTP = async () => {
    if (
      !validateEmail() ||
      !validateFullName() ||
      !validateTelephone() ||
      !validateDob() ||
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

  const handleResendOTP = async () => {
    try {
      await axios.post('http://localhost:8080/api/v1/otp/reSendOTP', {
        email: formData.email,
      });
      setResendCooldown(120); // Reset the cooldown to 2 minutes
    } catch (error) {
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

  const handleSubmit = async () => {
    const isPasswordValid = validatePassword();
    const isConfirmPasswordValid = validateConfirmPassword();
   
    if (otpVerified && formData.gender != '' && formData.fullName != '' && formData.address != '') { 
      if(isPasswordValid && isConfirmPasswordValid){
      try {
    const response = await axios.post('http://localhost:8080/api/v1/auth/register', formData);
       alert("Succesful Registered.");
        if(response.status == 200){
          alert("Succesful Registered.");
            navigate('/');
                    
        console.log(response.data);
        }

      } catch (error) {  
        navigate('/');
             alert('UnsuccessFull to register. Email already has been existed');   
        console.error(error);
      }}else{
        alert("Please, Enter Strong Password")
      }
    }else{
       
        alert("Fill Out All Input field.")
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => Math.max(prev - 1, 0));
      }, 600);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);



  return (
    <>
     <div className='fs-2 text-center m-4'> Seller Register Page...</div>
    <form>
        <div class="form-row container">
            <div className='row'>

            <div class="col-md-6 mb-3">
                    <label for="inputFullName">Full Name:</label>                   
                    <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} onBlur={validateFullName} class="form-control" />              
            </div>

            <div class="col-md-4 mb-3">
                <label> Nick Name:  </label>           
                <input type="text" name="nickName" value={formData.nickName} onChange={handleChange} class="form-control" required  />           
            </div> 
            <div class="col-md-6 mb-3">
                <label>Date of Birth (YYYY-MM-DD): </label>
                <input type="text" name="dob" value={formData.dob} onChange={handleChange} onBlur={validateDob} class="form-control" required/>
                <div style={{ color: 'red' }}>{dobError}</div>        
            </div>
          
            <div class="col-md-4 mb-3">      
                    <label>Address:</label>
                      <input type="text" name="address" value={formData.address} onChange={handleChange} class="form-control" required/>
                    </div>

                      <fieldset class="form-group">
                        <div class="row my-4">
                        <legend class="col-form-label col-sm-2 pt-0 fs-3"> Gender:</legend>
                        <div class="col-sm-8">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="gender" id="gridRadios1" value="Male" onChange={handleChange} checked={formData.gender == 'Male'} required/>
                                <label class="form-check-label" for="gridRadios1">
                                    Male
                                </label>
                            </div>

                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="gender" id="gridRadios2" value="Female" onChange={handleChange} checked={formData.gender == 'Female'} />
                            <label class="form-check-label" for="gridRadios2">
                                Female
                            </label>
                        </div>
                    </div>
              </div>
          </fieldset>

            <div class="col-md-6 mb-4"> 
                <label>Telephone (10 digits, starts with 0):</label>
                <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} onBlur={validateTelephone} class="form-control" placeholder="07xxxxxxxx" required />
                <div style={{ color: 'red' }}>{telephoneError}</div>
            </div>
      
            <div class="col-md-4 mb-4"> 
                <label> Email:  </label>
            <input type="text" name="email" value={formData.email} onChange={handleChange} onBlur={validateEmail} class="form-control" placeholder="example@gmail.com" required disabled = {otpVerified}/>
            <div style={{ color: 'red' }}>{emailError}</div>
            </div>

            <div class="col-md-6 mb-4"> 
                <label className='mb-1'>Password:</label>
                  <div className='row'> 
                        <div className='col-lg-10'>
                            <input type={showPassword ? 'text' : 'password'} onBlur={validatePassword} value={formData.password} name="password" onChange={handleChange} className='form-control' required/>
                        </div>
                        <div className='col-lg-2'>
                                <button
                                className='btn btn-outline-secondary'
                                type='button'
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? 'Hide' : 'Show'} 
                            </button>
                        </div>
                      <div>
                </div>
                </div>
            </div>
            <div class="col-md-4 mb-4"> 
            <label className='mb-1'>Confirm Password:</label>
          <div className='row'>
            <div className='col-lg-10'>
            <input type={showPassword1 ? 'text' : 'password'} value={formData.confirmPassword} name="confirmPassword" onBlur={validateConfirmPassword} onChange={handleChange} className='form-control' required/>
                            {/* Display error message if passwords don't match */}
            {!passwordMatch && (
                <div className="row my-2 ">
                <div className="col-lg-10 col-md-12 mx-4">
                    <span className="text-danger fs-6">Passwords do not match.</span>
                </div>
                </div>
            )}
            </div>
            <div className='col-lg-2'>
                    <button
                    className='btn btn-outline-secondary'
                    type='button'
                    onClick={togglePasswordVisibility1}
                >
                    {showPassword1 ? 'Hide' : 'Show'} {/* Toggle button text */}
                </button>
            </div>
            
          </div>
                
            </div>

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

    </form>
    </>
  );
};

export default RegistrationForm;
