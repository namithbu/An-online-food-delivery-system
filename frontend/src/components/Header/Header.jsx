import React from 'react'
import './Header.css'

const handleScrollToSection = (section) => {
  navigate('/');
  setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
      }
  }, 100);
}

const Header = () => {
  return (
    <div className='header'>
      <div className='header-contents'>
        <h2>SaviCart:<br/>
        Top Online Food Delivery Service</h2>
        <p>Tasty food delivered quick. The convenient choice you can count on.</p>
        <a href="#explore-Menu" className='view-Menu' onClick={() => handleScrollToSection('explore-Menu')}>View Menu</a>
      </div>
    </div>
  )
}

export default Header
