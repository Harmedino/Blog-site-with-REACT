import React from 'react'
import classes from './Category.module.css'
import { categoes } from './Catogries'

const categories = categoes

const Category = (props) => {
    


   
    return (
        <div className={classes.category}>
            <div className={classes.container}>
      <h1 className={classes.head}>Popular Categories</h1>
      
      <div className={classes.categoryList} onClick={props.onClick}>
          {categories.map((category, index) => (
            <div key={index} className={classes.categoryItem}  style={{ backgroundColor: category.color }}>
              <img
                src={category.imageSrc}
                alt=''
                className={classes.categoryImage}
              />
              <div
               
                className={classes.categoryContent}
              >
                {category.name}
              </div>
            </div>
          ))}
        </div>
              
      </div>
      </div>
  )
}

export default Category