import React from "react";
import { Link } from "react-router-dom";
import Button from "./../../Forms/Button";

const Product = ({
  documentID,
  productThumbnail,
  productName,
  productPrice,
  productCategory,
}) => {
  if (
    !documentID ||
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
        <Link to={`/product/${documentID}`}>
          <img src={productThumbnail} alt={productName} />
        </Link>
      </div>
      <div className="details">
        <ul>
          <li>
            <span className="name">
              <Link to={`/product/${documentID}`}>
                {productCategory} {productName}
              </Link>
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
