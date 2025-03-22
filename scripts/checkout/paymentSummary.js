import { cart } from '../../data/cart-class.js';
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from '../utils/money.js';
import { addOrder } from '../../data/orders.js';

export function renderPaymentSummary() {
  let productPriceCents = 0;// To track total price of all items in cart
  let shippingPriceCents = 0;// To track total shipping price of all items in cart

  cart.cartItems.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;

    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents
  });
  let cartQuantity = cart.calculateCartQuantity();
  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;// Total of all products before tax
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;// total of all products including tax

  const paymentSummaryHTML = `
   <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${cartQuantity}):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(totalCents)}</div>
          </div>

          <button class="place-order-button button-primary js-place-order">
            Place your order
          </button>
  `;

  const paymentSummaryEl = document.querySelector('.js-payment-summary');
  if (paymentSummaryEl) {
    paymentSummaryEl.innerHTML = paymentSummaryHTML;
  }
  else {
    console.error('Error: .js-payment-summary element not found.');
  }
  const placeOrderButton = document.querySelector('.js-place-order');
  if (placeOrderButton) {
    placeOrderButton.addEventListener('click', async () => {// Add event listener to "Place Order" button
      if (cart.calculateCartQuantity() === 0) {
        alert('Your cart is empty. Add products before placing an order.');
        return; // Prevent placing an order if the cart is empty
      }
      try {
         // Send the cart data to the backend to create an order
        const response = await fetch('https://supersimplebackend.dev/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            cart: cart // Send cart data as JSON
          })
        });
        
        const order = await response.json(); // Get the created order from the response
        addOrder(order);

      } catch (error) {
        alert('Failed to place order. Please check your internet connection and try again.');
        console.log('Unexpected error. Try again later.')
      }
      
      // Reset the cart after placing the order and redirect to orders page
      cart.resetCart();
      window.location.href = 'orders.html';
    });
  }

}