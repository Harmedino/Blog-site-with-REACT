import React from "react";
import classes from "./Category.module.css";
import { categoes } from "./Catogries";

const categoryIcons = {
  Technology: "💻",
  Travel: "✈️",
  Fashion: "👗",
  Food: "🍔",
  Lifestyle: "🌿",
};

const categoryImages = {
  Technology: "https://picsum.photos/seed/category-tech/320/200",
  Travel:     "https://picsum.photos/seed/category-travel/320/200",
  Fashion:    "https://picsum.photos/seed/category-fashion/320/200",
  Food:       "https://picsum.photos/seed/category-food/320/200",
  Lifestyle:  "https://picsum.photos/seed/category-lifestyle/320/200",
};

const Category = ({ onClick, activeCate }) => {
  return (
    <div className={classes.categorySection}>
      <div className={classes.container}>
        <div className={classes.header}>
          <h2 className={classes.title}>Browse by Category</h2>
          {activeCate && (
            <button
              className={classes.clearBtn}
              onClick={() => onClick({ target: { innerText: activeCate } })}
            >
              Clear filter ×
            </button>
          )}
        </div>
        <div className={classes.categoryList}>
          {categoes.map((category, index) => (
            <button
              key={index}
              className={`${classes.categoryItem} ${activeCate === category.name ? classes.active : ""}`}
              onClick={() => onClick({ target: { innerText: category.name } })}
            >
              <img
                src={categoryImages[category.name] || `https://picsum.photos/seed/${category.name}/320/200`}
                alt={category.name}
                className={classes.categoryImg}
              />
              <div className={classes.categoryOverlay} />
              <div className={classes.categoryInfo}>
                <span className={classes.categoryIcon}>
                  {categoryIcons[category.name] || "📌"}
                </span>
                <span className={classes.categoryName}>{category.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
