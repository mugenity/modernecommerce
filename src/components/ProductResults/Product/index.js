import React from "react";
import Button from "./../../Forms/Button";

const Product = ({
  productThumbnail,
  productName,
  productPrice,
  productCategory,
}) => {
  if (
    !productThumbnail ||
    !productName ||
    !productCategory ||
    typeof productPrice === "undefined"
  )
    return null;

  const configAddToCartBtn = {
    type: "button",
  };

  return (
    <div className="product">
      <div className="thumb">
        <img src={productThumbnail} alt={productName} />
      </div>
      <div className="details">
        <ul>
          <li>
            <span className="name">
              {productCategory} {productName}
            </span>
          </li>
          <li>
            <span className="price">$ {productPrice}</span>
          </li>
          <li>
            <Button {...configAddToCartBtn}>Add to cart</Button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Product;
