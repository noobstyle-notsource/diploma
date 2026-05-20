import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Layout from './components/Layout';
import PageTransition from './components/PageTransition';
import Home from './pages/Home';
import Services from './pages/Services';
import Products from './pages/Products';
import ServiceDetail from './pages/ServiceDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Checkout from './pages/Checkout';
import AddProduct from './pages/AddProduct';
import Settings from './pages/Settings';
import Orders from './pages/Orders';
import Status from './pages/Status';
import Admin from './pages/Admin';
import WalletPage from './pages/Wallet';
import { About, Privacy, Terms, Support } from './pages/Corporate';


function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      {/* @ts-ignore */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
        <Route path="/services/:id" element={<PageTransition><ServiceDetail /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/profile/:id" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/messages" element={<PageTransition><Messages /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="/seller/add" element={<PageTransition><AddProduct /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
        <Route path="/orders" element={<PageTransition><Orders /></PageTransition>} />
        <Route path="/status" element={<PageTransition><Status /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
        <Route path="/wallet" element={<PageTransition><WalletPage /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />

        <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
        <Route path="/support" element={<PageTransition><Support /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </Router>
  );
}
