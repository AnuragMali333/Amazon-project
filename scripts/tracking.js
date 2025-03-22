import { getOrder } from '../data/orders.js';
import { getProduct, loadProductsFetch } from '../data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { cart } from '../data/cart-class.js';

async function loadPage() {
  await loadProductsFetch();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');

  if (!orderId || !productId) {
    console.error('Invalid Order or Product ID.');
    document.querySelector('.js-order-tracking').innerHTML = `<p class="error-message">Order or Product not found.</p>`;
    return;
  }

  const order = getOrder(orderId);
  if (!order) {
    console.error('Order not found:', orderId);
    document.querySelector('.js-order-tracking').innerHTML = `<p class="error-message">Order not found.</p>`;
    return;
  }

  const productDetails = order.products.find(details => details.productId === productId);
  if (!productDetails) {
    console.error('Product not found in order:', productId);
    document.querySelector('.js-order-tracking').innerHTML = `<p class="error-message">Product not found in this order.</p>`;
    return;
  }

  const product = getProduct(productId);
  if (!product) {
    console.error('Product data not found:', productId);
    document.querySelector('.js-order-tracking').innerHTML = `<p class="error-message">Product details unavailable.</p>`;
    return;
  }

  // Calculate progress percentage
  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(productDetails.estimatedDeliveryTime);

  let percentProgress = ((today - orderTime) / (deliveryTime - orderTime)) * 100;
  percentProgress = Math.max(0, Math.min(100, percentProgress)); // Ensure it's between 0% and 100%

  // Display "Delivered" if today's date is past the delivery date
  const deliveredMessage = today < deliveryTime ? 'Arriving on' : 'Delivered on';

  // Generate tracking UI
  const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">View all orders</a>

    <div class="delivery-date">
      ${deliveredMessage} ${deliveryTime.format('dddd, MMMM D')}
    </div>

    <div class="product-info">${product.name}</div>
    <div class="product-info">Quantity: ${productDetails.quantity}</div>

    <img class="product-image" src="${product.image}" alt="${product.name}">

    <div class="progress-labels-container">
      <div class="progress-label ${percentProgress < 50 ? 'current-status' : ''}">Preparing</div>
      <div class="progress-label ${(percentProgress >= 50 && percentProgress < 100) ? 'current-status' : ''}">Shipped</div>
      <div class="progress-label ${percentProgress >= 100 ? 'current-status' : ''}">Delivered</div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${percentProgress}%;"></div>
    </div>
  `;

  document.querySelector('.js-order-tracking').innerHTML = trackingHTML;
  document.querySelector('.js-cart-quantity').innerHTML = cart.calculateCartQuantity();
}

loadPage();
