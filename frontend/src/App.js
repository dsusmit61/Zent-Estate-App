import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CreateListing from './pages/CreateListing';
import NavBar from './components/NavBar';
import PrivateRoute from './components/PrivateRoute';
import UpdateListing from './pages/UpdateListing';
import About from './pages/About';
import Home from './pages/Home';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Listing from './pages/Listing';
import Search from './pages/Search';
import Footer from './components/Footer';

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/search' element={<Search />} />
        <Route path='/listing/:listingId' element={<Listing />} />
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route
            path='/update-listing/:listingId'
            element={<UpdateListing />}
          />
        </Route>
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
      </Routes>
      <Footer />
      <ToastContainer
        transition={Bounce}
        autoClose={2000}
        position='top-center'
        theme='dark'
      />
    </BrowserRouter>
  );
};

export default App;
