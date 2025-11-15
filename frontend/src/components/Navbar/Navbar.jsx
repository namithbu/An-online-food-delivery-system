import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {

    const [Menu, setMenu] = useState("home");

    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/")
    }

    const handleScrollToSection = (section) => {
        navigate('/');
        setMenu(section);
        setTimeout(() => {
            const element = document.getElementById(section);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }

    return (
        <div className='navbar'>
            <Link to='/' onClick={() => setMenu("home")} className={Menu === "home" ? "" : ""}><img src={assets.logo} alt='' className='logo' /></Link>
            <ul className='navbar-Menu'>
                <a href="#explore-Menu" onClick={() => handleScrollToSection('explore-Menu')} className={Menu === "Menu" ? "active" : ""}>Menu</a>
                <Link to='/myorders' onClick={() => setMenu("track-order")} className={Menu === "track-order" ? "active" : ""}>Track Order</Link>
                <Link to='/' onClick={() => setMenu("Parcel")} className={Menu === "Parcel" ? "active" : ""}></Link>
            </ul>
            <div className='navbar-right'>
                <div className='navbar-search-icon'>
                    <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
                    <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
                </div>
                {!token ? <button onClick={() => setShowLogin(true)}>Sign In</button>
                    : <div className='navbar-profile'>
                        <img src={assets.profile_icon} alt='' />
                        <ul className='nav-profile-dropdown'>
                            <Link to='/deliver' className='deliver-button'>Deliver</Link>
                            <hr />
                            <Link to='/account' className='account-button'>Account</Link>
                            <hr />
                            <li onClick={logout}><img src={assets.logout_icon} alt='' /><p>Logout</p></li>
                        </ul>
                    </div>}
            </div>
        </div>
    );
}

export default Navbar;