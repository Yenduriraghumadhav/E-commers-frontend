import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './Authentication/AuthContext';
import ProtectedRoute from './Authentication/ProtectedRoute';
import VendoreLayout from "./Authentication/VendoreLayout";
import UserLogin from './components/UsersLogin/UsersLogin';
import VendoreLogin from './components/VendoreLogin/VendoreLogin';
import VendoreProductAdding from './components/vendoreProductAdding/VendoreProductAdding';
import ProfilePage from './Pages/ProfilePage/ProfilePage';
import UsersHomePage from './Pages/UsersHomePage/UsersHomePage';
import AddToCartPage from './Pages/AddToCartPage/AddToCartPage';
import UserodersPage from './Pages/UserodersPage/UserodersPage';
import WishListPage from './Pages/WishListPage/WishListPage';
import VendoresHomePage from './Pages/VendoresHomePage/VendoresHomePage';
import VendoreProfilePage from './Pages/VendoreProfilePage/VendoreProfilePage';
import ForgotpasswordsVendore from './components/Forgotpasswords/ForgotpasswordsVendore/ForgotpasswordsVendore';
import VendoreBusinessFeilds from './components/vendoreBusinessFeilds/VendoreBusinessFeilds';
import Footer from './components/Footer/Footer';
import AboutUs from './Pages/AboutUs/AboutUs';
import UserSignUp from './components/UserSignUp/UserSignUp';
import ForgotpasswordsUser from './components/Forgotpasswords/ForgotpasswordsUser/ForgotpasswordsUser';
import MultipuleProducts from './components/vendoreProductAdding/MultipuleProducts';
import OrdersVendorePage from './Pages/OrdersVendorePage/OrdersVendorePage';
import UserLayout from './Authentication/UserLayout';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Routes */}
          <Route path="/UsersLogin" element={<UserLogin />} />
          <Route path="/VendoreLogin" element={<VendoreLogin />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path='/signup' element={<UserSignUp />} />
          <Route path="/forgotpassword" element={<ForgotpasswordsVendore />} />
          <Route path='/userforgotpassword' element={<ForgotpasswordsUser />} />

          {/* Vendor Routes */}
          <Route element={<ProtectedRoute allowedRoles={["vendor"]} />}>
            <Route element={<VendoreLayout />}>
              <Route
                path="/vendoresHomePage"
                element={<VendoresHomePage />}
              />

              <Route
                path="/VendoreSingleProductAdding"
                element={<VendoreProductAdding />}
              />

              <Route
                path="/ordersTraking"
                element={<OrdersVendorePage />}
              />

              <Route
                path="/multiProdctAdding"
                element={<MultipuleProducts />}
              />

              <Route
                path="/VendoreProfile"
                element={<VendoreProfilePage />}
              />

              <Route
                path="/VendoreBussiness"
                element={<VendoreBusinessFeilds />}
              />
            </Route>
          </Route>

          {/* User Routes */}
          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route element={<UserLayout />}>
              <Route
                path="/Profile"
                element={<ProfilePage />}
              />

              <Route path="/footer" element={<Footer />} />

              <Route
                path="/ProductsHomePage"
                element={<UsersHomePage />}
              />

              <Route
                path="/Cart"
                element={<AddToCartPage />}
              />

              <Route
                path="/wishList"
                element={<WishListPage />}
              />

              <Route
                path="/orders"
                element={<UserodersPage />}
              />
            </Route>
          </Route>

          {/* Unauthorized */}
          <Route
            path="/unauthorized"
            element={<h1>Unauthorized Access</h1>}
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
