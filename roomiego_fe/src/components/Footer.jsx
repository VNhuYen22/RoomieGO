import React from 'react'
import '../styles/Footer.css';
const Footer = () => {
  return (
    <div>
     <footer className='footer'>
        <div className="left-side">
            <h3>Newsletter & Special Promo</h3>
            <input type="text" placeholder='Enter your email here' />
            <button className='button'>Subscribe</button>
        </div>
        <div className="right-side">
            <ul>
                <li><a href="/">About Us</a></li>
                <li><a href="/">Contact</a></li>
                <li><a href="/">Location</a></li>
                <li><a href="/">FAQ</a></li>
                <li><a href="/">Term of Use</a></li>
                <li><a href="/">Privacy Police</a></li>
            </ul>
        </div>
        </footer> 
    </div>
  )
}

export default Footer
