import { useSelector } from 'react-redux';
import {
  Navigate,
  Route, RouterProvider, createBrowserRouter, createRoutesFromElements
} from "react-router-dom";

import { selectIsAuthChecked, selectLoggedInUser } from './features/auth/AuthSlice';
import { Logout } from './features/auth/components/Logout';
import { Protected } from './features/auth/components/Protected';
import { useAuthCheck } from "./hooks/useAuth/useAuthCheck";
import { useFetchLoggedInUserDetails } from "./hooks/useAuth/useFetchLoggedInUserDetails";

import {
  AddProductPage,
  AdminOrdersPage,
  CartPage,
  CheckoutPage,
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  OrderSuccessPage,
  OtpVerificationPage,
  ProductDetailsPage,
  ProductUpdatePage,
  ResetPasswordPage,
  SignupPage,
  UserOrdersPage,
  UserProfilePage,
  WishlistPage
} from './pages';

import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const loggedInUser = useSelector(selectLoggedInUser);

  useAuthCheck();
  useFetchLoggedInUserDetails(loggedInUser);

  const routes = createBrowserRouter(
    createRoutesFromElements(
      <>
        {/* ✅ Default route: fix infinite loop or wrong landing */}
        <Route
          path="/"
          element={
            !isAuthChecked ? (
              ""
            ) : !loggedInUser ? (
              <Navigate to="/login" />
            ) : loggedInUser.isAdmin ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <Navigate to="/home" />
            )
          }
        />

        {/* Auth Routes */}
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/verify-otp' element={<OtpVerificationPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password/:userId/:passwordResetToken' element={<ResetPasswordPage />} />

        {/* Public Product Details */}
        <Route path='/product-details/:id' element={<Protected><ProductDetailsPage /></Protected>} />
        <Route path='/logout' element={<Protected><Logout /></Protected>} />

        {/* Admin Routes */}
        {loggedInUser?.isAdmin && (
          <>
            <Route path='/admin/dashboard' element={<Protected><AdminDashboardPage /></Protected>} />
            <Route path='/admin/product-update/:id' element={<Protected><ProductUpdatePage /></Protected>} />
            <Route path='/admin/add-product' element={<Protected><AddProductPage /></Protected>} />
            <Route path='/admin/orders' element={<Protected><AdminOrdersPage /></Protected>} />
          </>
        )}

        {/* User Routes */}
        {loggedInUser && !loggedInUser.isAdmin && (
          <>
            <Route path='/home' element={<Protected><HomePage /></Protected>} />
            <Route path='/cart' element={<Protected><CartPage /></Protected>} />
            <Route path='/profile' element={<Protected><UserProfilePage /></Protected>} />
            <Route path='/checkout' element={<Protected><CheckoutPage /></Protected>} />
            <Route path='/order-success/:id' element={<Protected><OrderSuccessPage /></Protected>} />
            <Route path='/orders' element={<Protected><UserOrdersPage /></Protected>} />
            <Route path='/wishlist' element={<Protected><WishlistPage /></Protected>} />
          </>
        )}

        {/* Catch-all Not Found */}
        <Route path='*' element={<NotFoundPage />} />
      </>
    )
  );

  return isAuthChecked ? <RouterProvider router={routes} /> : "";
}

export default App;
