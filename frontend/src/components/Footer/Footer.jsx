import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className='footer-content'>
            <div className='footer-content-left'>
                <img id='logo' src={assets.logo} alt=""></img>
                <p>At SaviCart, we believe that enjoying tasty food should always be an effortless experience. That's why we've built a service that stands for convenience, reliability, and speed, bringing the best local restaurants and kitchens directly to you.</p>
                <div className='footer-social-icons'>
                
                </div>
            </div>
            <div className='footer-content-center'>
                <h2></h2>
                <ul>
                    
                </ul>
            </div>
            <div className='footer-content-right'>
                <h2><br></br><br></br><br></br>GET IN TOUCH</h2>
                <ul>
                    <li>9999999999</li>
                    <li>contact@contact.com</li>
                </ul>
            </div>
        </div>
        <hr/>
        <p className='footer-copyright'>Copyright 2025</p>
    </div>
  )
}

export default Footer
