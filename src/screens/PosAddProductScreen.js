import React, { useState } from 'react';
import './PosAddProductScreen.css';

function PosAddProductScreen() {
  return (
    <div className="pos-add-product-container">
      <div className="pos-add-product-title">Add Product</div>
      <div className="pos-add-product-form">
        <div className="pos-add-product-row">
          <label>Product Name:</label>
          <input className="pos-add-product-input" placeholder="Enter product name" />
        </div>
        <div className="pos-add-product-row">
          <label>Product Code:</label>
          <input className="pos-add-product-input" placeholder="Enter product code" />
        </div>
        <div className="pos-add-product-row">
          <label>Category:</label>
          <select className="pos-add-product-input"><option>Select</option></select>
        </div>
        <div className="pos-add-product-row">
          <label>Stock:</label>
          <input className="pos-add-product-input" placeholder="Enter stock" type="number" />
        </div>
        <div className="pos-add-product-row">
          <label>Price:</label>
          <input className="pos-add-product-input" placeholder="Enter price" type="number" />
        </div>
        <div className="pos-add-product-btn-row">
          <button className="pos-add-product-save-btn">Save</button>
          <button className="pos-add-product-clear-btn">Clear</button>
        </div>
      </div>
    </div>
  );
}

export default PosAddProductScreen; 