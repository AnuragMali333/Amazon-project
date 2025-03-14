import {cart} from '../../data/cart-class.js';
import { products, getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions, getDeliveryOption,calculateDeliveryDate } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckoutHeader } from './checkoutHeader.js';

export function renderOrderSummary() {

  let cartSummaryHTMl = '';

  if (cart.cartItems.length === 0) {
    cartSummaryHTMl = `
      <div class="empty-cart">
        <h2>Looks like your cart is empty!</h2>
        <img src="images/dog.png" alt="Cute dog" class="empty-cart-image">
        <button class="add-products-button button-primary js-add-products">Add Products</button>
      </div>
    `;

    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTMl;

    document.querySelector('.js-add-products').addEventListener('click', () => {
      window.location.href = 'index.html'; // Change this to your product page
    });

    return;
  }

  // Existing cart rendering logic when cart has items


  cart.cartItems.forEach((cartItem) => {
    const productId = cartItem.productId;//get productID of each cart-Item(stored in cart)

    const matchingProduct = getProduct(productId);// Find matching product from products array using productID

    const deliveryOptionId = cartItem.deliveryOptionId;//get deliveryOptionID of each cart-item(stored in cart)

    const deliveryOption = getDeliveryOption(deliveryOptionId);// Find complete deliveryOption using deliveryOptionID

    const dateString = calculateDeliveryDate(deliveryOption);//calculates delivery date for the delivery option and formats it

    //Generate HTML for each cart-item
    cartSummaryHTMl += `
    <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id}">
          <div class="delivery-date">
            Delivery date: ${dateString}
          </div>

          <div class="cart-item-details-grid">
            <img class="product-image"
              src=${matchingProduct.image}>

            <div class="cart-item-details">
              <div class="product-name">
              ${matchingProduct.name}
              </div>
              <div class="product-price">
                ${matchingProduct.getPrice()}
              </div>
              <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                <span>
                  Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                </span>
                <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                  Update
                </span>
                <input class="quantity-input js-quantity-input-${matchingProduct.id}">
                <span class="save-quantity-link link-primary js-save-link"
                data-product-id="${matchingProduct.id}">Save</span>
                <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                  Delete
                </span>
              </div>
            </div>

            <div class="delivery-options">
              <div class="delivery-options-title">
                Choose a delivery option:
              </div>
              ${deliveryOptionsHTML(matchingProduct, cartItem)}
              
            </div>
          </div>
        </div>
    
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {// Generate HTML of delivery options(three) for each cart-Item 
    let html = ''
    deliveryOptions.forEach((deliveryOption) => {
      const dateString = calculateDeliveryDate(deliveryOption);
      const priceString = deliveryOption.priceCents === 0
        ? 'FREE'
        : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;// returns true if deliveryOptionId in cart matches id of delivery option

      html += `
      <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}"     >
                <input type="radio" 
                ${isChecked ? 'checked' : ''}
                  class="delivery-option-input"
                  name="delivery-option-${matchingProduct.id}">
                <div>
                  <div class="delivery-option-date">
                  ${dateString}
                  </div>
                  <div class="delivery-option-price">
                    ${priceString} Shipping
                  </div>
                </div>
              </div>
      `
    });

    return html;
  }

  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTMl; // injects generated HTML 

  document.querySelectorAll('.js-delete-link') // Make all delete links interactive
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;//capture product id of cart item whose delete link is clicked
        cart.removeFromCart(productId);// remove item from cart
        renderCheckoutHeader();
        renderOrderSummary();
        renderPaymentSummary();
      });
    });

  function updateCartQuantity() { // updates quantity at top of checkout page
    const cartQuantity = cart.calculateCartQuantity();

    document.querySelector('.js-return-to-home-link')
      .innerHTML = `${cartQuantity} items`;
  }

  updateCartQuantity();

  document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => { // makes all update links interactive
        const productId = link.dataset.productId; //capture productID of item whose update link is clicked

        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.add('is-editing-quantity');
      })
    });

  document.querySelectorAll('.js-save-link')
    .forEach((link) => {
      const productId = link.dataset.productId;// capture product ID 

      // Add keydown listener to the corresponding input field
      const quantityInput = document.querySelector(
        `.js-quantity-input-${productId}`
      );

      quantityInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          link.click(); // Trigger the save button's click event on hitting enter in input
        }
      });

      link.addEventListener('click', () => { // makes all save links interactive
        const quantityInput = document.querySelector(
          `.js-quantity-input-${productId}`
        );

        const newQuantity = Number(quantityInput.value);
        if (newQuantity < 0 || newQuantity >= 1000) {
          alert('Quantity must be at least 0 and less than 1000');
          return;
        }

        cart.updateQuantity(productId, newQuantity);

        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.remove('is-editing-quantity');

        const quantityLabel = document.querySelector(
          `.js-quantity-label-${productId}`
        );
        quantityLabel.innerHTML = newQuantity;
        renderCheckoutHeader();
        renderOrderSummary();
        renderPaymentSummary();
      });
    });

  document.querySelectorAll('.js-delivery-option')// Allows to change delivery option
    .forEach((element) => {
      element.addEventListener('click', () => {
        const { productId, deliveryOptionId } = element.dataset;
        cart.updateDeliveryOption(productId, deliveryOptionId);
        renderOrderSummary();
        renderPaymentSummary();
      });
    });
}

