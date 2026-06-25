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
              onClick={(e) => onClick({ target: { innerText: category.name } })}
            >
              <span className={classes.categoryIcon}>
                {categoryIcons[category.name] || "📌"}
              </span>
              <span className={classes.categoryName}>{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
