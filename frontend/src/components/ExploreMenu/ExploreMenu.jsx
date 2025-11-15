import React from 'react'
import './ExploreMenu.css'
import { Menu_list } from '../../assets/assets'

const ExploreMenu = ({category,setCategory}) => {


  return (
    <div className='explore-Menu' id='explore-Menu'>
      <h1>Explore our Menu</h1>
      <p className='explore-Menu-text'>Choose from a diverse Menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise.Our main goal is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
      <div className='explore-Menu-list'>
        {Menu_list.map((item,index) => {
            return (
                <div onClick={()=>setCategory(prev=>prev===item.Menu_name?"All":item.Menu_name)} key={index} className='explore-Menu-list-item'>
                    <img className={category===item.Menu_name?"active":""} src={item.Menu_image} alt="" />
                    <p>{item.Menu_name}</p>
                </div>
            )
        })}
      </div>
      <hr/>
    </div>
  )
}

export default ExploreMenu
