import React from 'react'
import style from "./rightBar.module.css"

export default function rightBar() {
  return (
    <div className={style.wrapper}>
      <a href = "https://www.adidas.co.in/" target='_blank'>
       <img src = "./assets/adidas.png" alt = "adidas ad" style = {{cursor: 'pointer'}}/>
     </a>
      <a href = "https://www.nike.com/in/" target='_blank'>
        <img src = "./assets/nike.png" alt = "nike ad" style = {{cursor: 'pointer'}}/>        
      </a>
    </div>
  )
}
