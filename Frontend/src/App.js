import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ItemDetail from './Component/Common/ItemDetail';
import AddItemForm from './Component/Seller/AddItemForm';
import ItemList from './Component/Common/ItemList';
import RegistrationForm from './Component/Common/RegistrationForm';
import LogIn from './Component/Common/LogIn';
import SellerHome from './Component/Seller/SellerHome'
import EditPost from './Component/Seller/EditPost';
import AdminDashboard from './Component/Admin/AdminDashboard';
import AdminViewAllAds from './Component/Admin/AdminViewAllAds';
import AdminItemApprove from './Component/Admin/AdminItemApprove';
import AdminViewUsers from './Component/Admin/AdminViewUsers';
import AdminSliderAds from './Component/Admin/AdminSliderAds';
import AdminItemDetail from './Component/Admin/AdminItemDetail';
import Devices from './Component/Admin/Devices';
import DeleteDevices from './Component/Admin/DeleteDevices';
import Brands from './Component/Admin/Brands';
import DeleteBrands from './Component/Admin/DeleteBrands';
import AdminPage from './Component/Admin/AdminPage';
import AddAdminUser from './Component/Admin/AddAdminUser';
import EditAdminPage from './Component/Admin/EditAdminPage';
import AdminAllDetails from './Component/Admin/AdminAllDetails';
import ForggotPassword from './Component/Common/forggotPassword';

const App = () => {
   
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LogIn />} />
                <Route path="/" element={<ItemList/>} />
                <Route path="/registrationForm" element={<RegistrationForm/>} />
                <Route path="/sellerHome" element={<SellerHome />} />
                <Route path="/adminDashboard" element={<AdminDashboard/>} />
                <Route path="/editAdminPage" element={<EditAdminPage/>} />
                <Route path="/adminItemApprove/:id/:token/:adminId" element={<AdminItemApprove/>} />
                <Route path="/adminViewAllAds" element={<AdminViewAllAds/>} />
                <Route path="/adminViewUsers" element={<AdminViewUsers/>} />
                <Route path="/adminSliderAds" element={<AdminSliderAds/>} />
                <Route path="/editPost" element={<EditPost/>} />
                <Route path="/addItemForm" element={<AddItemForm/>} />
                <Route path="/items/:id" element={<ItemDetail />} />
                <Route path="/adminItems/:id" element={<AdminItemDetail />} />
                <Route path="/forgotPassword" element={<ForggotPassword />} />
                <Route path="/devices" element={<Devices />} />
                <Route path="/deleteDevices" element={<DeleteDevices />} />
                <Route path="/brands" element={<Brands />} />
                <Route path="/deleteBrands" element={<DeleteBrands />} />
                <Route path="/adminPage" element={<AdminPage />} />
                <Route path="/addAdminUser" element={<AddAdminUser />} />
                <Route path="/adminAllDetails" element={<AdminAllDetails/>} />
            </Routes>
        </Router>
    );
};

export default App;
