import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const NavBar = () => {

  return ( <> 
  <ul className="d-flex justify-content-end" type ="none" >
        <li className=" hover-zoom">
          <Link to={`/`} classNameName="nav-link active text-dark text-light text-decoration-none fs-6 font-weight-bold"><button type="button" className="btn btn-warning">Home</button></Link>
        </li>
      </ul>

    <nav className="navbar navbar-expand-lg ">
  <div className="container-fluid">

    <div className="collapse navbar-collapse " id="navbarNavDropdown">
      <ul className="navbar-nav">        
      <li className="nav-item mx-2">
          <Link to={`/login`} classNameName="nav-link active text-dark text-light text-decoration-none fs-6 font-weight-bold">
            <button type="button" className="btn btn-warning">
            Log In
            </button>
            </Link>
        </li>
        <li className="nav-item hover-zoom  mx-2">
         <Link to={`/registrationForm`} classNameName="nav-link active text-dark text-light text-decoration-none fs-6 font-weight-bold"> <button type="button" className="btn btn-warning">Sing Up</button></Link>
        </li>

        <li className="nav-item">
          <a className="nav-link" href="#">Pricing</a>
        </li>
      </ul>
    </div>
  </div>
</nav></>
  )
}

export default NavBar