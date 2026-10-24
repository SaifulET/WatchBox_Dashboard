import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/Main/Main";
import SignIn from "../Pages/Auth/SignIn/SignIn";
import ForgatePassword from "../Pages/Auth/ForgatePassword/ForgatePassword";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../Pages/Dashboard/Dashboard";
import VerifyCode from "../Pages/Auth/VerifyCode/VerifyCode";
import NewPass from "../Pages/Auth/NewPass/NewPass";
import Settings from "../Pages/Settings/Settings";
import Booking from "../Pages/Bookings/Bookings";
import BookingDetails from "../Pages/BookingDetails/BookingDetails";
import Workers from "../Pages/Workers/Workers";
import WorkerDetailsPage from "../Pages/WorkerDetailsPage/WorkerDetailsPage";
import PaymentDetails from "../Pages/PaymentDetails/PaymentDetails";
import Payments from "../Pages/Payments/Payments";
import Customers from "../Pages/Customers/Customers";
import CustomerDetails from "../Pages/CustomerDetails/CustomerDetails";
import SupportMessages from "../Pages/SupportMessages/SupportMessages";
import Notifications from "../Pages/Notifications/Notifications";
import Users from "../Pages/Users/Users";
import Earning from "../Pages/Earning/Earning";
import Subscription from "../Pages/Subscription/Subscription";
import Marketplace from "../Pages/Marketplace/Marketplace";
import Analytics from "../Pages/Analytics/Analytics";
import SystemMonitoring from "../Pages/SystemMonitoring/SystemMonitoring";
import CreateAdmin from "../Pages/CreateAdmin/CreateAdmin";
import Reports from "../Pages/Reports/Reports";
import BulkEmail from "../Pages/BulkEmail/BulkEmail";

import ChangePassword from "../Pages/Settings/ChangePassword";
import ForgotPassword from "../Pages/Settings/ForgotPassword";
import VerifyOtp from "../Pages/Settings/VerifyOtp";
import PrivacyPolicy from "../Pages/Settings/PrivacyPolicy";
import TermsConditions from "../Pages/Settings/TermsConditions";
import AboutUs from "../Pages/Settings/AboutUs";
import AccountDeletionSettings from "../Pages/Settings/AccountDeletion";
import PublicLayout from "../Layout/Public/PublicLayout";
import PublicPrivacyPolicy from "../Pages/Public/PrivacyPolicy";
import PublicTermsConditions from "../Pages/Public/TermsConditions";
import PublicContact from "../Pages/Public/Contact";
import PublicAccountDeletion from "../Pages/Public/AccountDeletion";

export const router = createBrowserRouter([
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/forgate-password",
    element: <ForgatePassword />,
  },
  {
    path: "/verify-code",
    element: <VerifyCode />,
  },
  {
    path: "/new-password",
    element: <NewPass />,
  },
  {
    element: <PublicLayout />,
    children: [
      { path: "/privacy-policy", element: <PublicPrivacyPolicy /> },
      { path: "/privacy", element: <PublicPrivacyPolicy /> },
      { path: "/terms", element: <PublicTermsConditions /> },
      { path: "/terms-and-conditions", element: <PublicTermsConditions /> },
      { path: "/contact", element: <PublicContact /> },
      { path: "/account-deletion", element: <PublicAccountDeletion /> },
      { path: "/delete-account", element: <PublicAccountDeletion /> },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { path: "/", element: <Dashboard /> },
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/booking", element: <Booking/> },
          { path: "/booking-details", element: <BookingDetails/> },
          { path: "/workers", element: <Workers/> },
          { path: "/workers/:id", element: <WorkerDetailsPage/> },
          {path: "/payments" , element: <Payments/>},
          {path: "/payment-details" , element: <PaymentDetails/>},
           {path: "/customers" , element: <Customers/>},
          {path: "/customer/:id" , element: <CustomerDetails/>},
          { path: "/support", element: <SupportMessages /> },
          { path: "/settings", element: <Settings/> },
          { path: "/settings/change-password", element: <ChangePassword/> },
          { path: "/settings/forgot-password", element: <ForgotPassword/> },
          { path: "/settings/verify-otp", element: <VerifyOtp/> },
          { path: "/settings/privacy-policy", element: <PrivacyPolicy/> },
          { path: "/settings/terms-conditions", element: <TermsConditions/> },
          { path: "/settings/about-us", element: <AboutUs/> },
          { path: "/settings/account-deletion", element: <AccountDeletionSettings/> },
          { path: "/notifications", element: <Notifications /> },
          { path: "/users", element: <Users /> },
          { path: "/earning", element: <Earning /> },
          { path: "/subscription", element: <Subscription /> },
          { path: "/marketplace", element: <Marketplace /> },
          { path: "/analytics", element: <Analytics /> },
          { path: "/system-monitoring", element: <SystemMonitoring /> },
          { path: "/create-admin", element: <CreateAdmin /> },
          { path: "/reports", element: <Reports /> },
          { path: "/bulk-email", element: <BulkEmail /> },
        ],
      },
    ],
  },
]);
