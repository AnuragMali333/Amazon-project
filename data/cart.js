export let cart;

loadFromStorage();

export function loadFromStorage() {// loads cart from localStorage
  cart = JSON.parse(localStorage.getItem('cart'));

  if (!cart) {// If there is no cart in localStorage  we assign default cart
    cart = [{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '1'
    }, {
      productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
      quantity: 1,
      deliveryOptionId: '2'
    }];
  }
}

function saveToStorage() {// saves cart to LocalStorage
  localStorage.setItem('cart', JSON.stringify(cart));
}

const addedMessageTimeouts = {};

export function addToCart(productId) { // adds product to cart 
  let matchingItem;

  cart.forEach((cartItem) => { //Iterates over the cart and checks if product is already present in cart
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  const quantitySelector = document.querySelector(
    `.js-quantity-selector-${productId}`
  );

  const quantity = Number(quantitySelector.value);
  if (matchingItem) {
    matchingItem.quantity += quantity; //If matching product is +nt increase its quantity.
  }
  else {
    cart.push({ //else push new product to cart
      productId,
      quantity,
      deliveryOptionId: '1'
    });
  }
  const addedMessage = document.querySelector(
    `.js-added-to-cart-${productId}`
  );

  addedMessage.classList.add('added-to-cart-visible'); // make the message visible 

  // Check if there's a previous timeout for this
  // product. If there is, we should stop it.
  const previousTimeoutId = addedMessageTimeouts[productId];
  if (previousTimeoutId) {
    clearTimeout(previousTimeoutId);
  }

  const timeoutId = setTimeout(() => {
    addedMessage.classList.remove('added-to-cart-visible');
  }, 2000);

  // Save the timeoutId for this product
  // so we can stop it later if we need to.
  addedMessageTimeouts[productId] = timeoutId;

  saveToStorage();
}



export function removeFromCart(productId) {// removes product from cart
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {// All other products with different productID than the one which is to be removed will get added to cart
      newCart.push(cartItem);
    }
  });

  cart = newCart;
  saveToStorage();
}

export function calculateCartQuantity() {//sums up all quantities in the cart.
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  return cartQuantity;
}

export function updateQuantity(productId, newQuantity) {//updates the quantity of a specific product in the cart.

  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.quantity = newQuantity;

  saveToStorage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach((cartItem) => { //Iterates over the cart and checks if product is already present in cart
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}

export function loadCart(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    console.log(xhr.response)
    fun();
  })
  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}

export async function loadCartFetch(){
  const response=await fetch ('https://supersimplebackend.dev/cart');
  const text=await response.text();
  console.log(text);
  return text;
}