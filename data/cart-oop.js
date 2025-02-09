
function Cart(loadFromStorageKey){
  const cart = {
    cartItems: undefined,
    addedMessageTimeouts : {},

    loadFromStorage () {
      this.cartItems = JSON.parse(localStorage.getItem(loadFromStorageKey));
  
      if (!this.cartItems) {
        this.cartItems = [{
          productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
          quantity: 2,
          deliveryOptionId: '1'
        }, {
          productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
          quantity: 1,
          deliveryOptionId: '2'
        }];
      }
    },
    
     saveToStorage() {
      localStorage.setItem(loadFromStorageKey, JSON.stringify(this.cartItems));
    },
  
     addToCart(productId) {
      console.log(productId);
      let matchingItem;
    
      this.cartItems.forEach((cartItem) => { //Iterates over the cart and checks if product is already present in cart
        if (productId === cartItem.productId) {
          matchingItem = cartItem;
        }
      });
    
      const quantitySelector = document.querySelector(
        `.js-quantity-selector-${productId}`
      );
    
      const quantity = quantitySelector ? Number(quantitySelector.value) : 1;  // Default to 1 if not found
      console.log(`Quantity for product ${productId}: ${quantity}`);
      
      if (matchingItem) {
        matchingItem.quantity += quantity; //If matching product is +nt increase its quantity.
      }
      else {
        this.cartItems.push({ //else push new product to cart
          productId,
          quantity,
          deliveryOptionId: '1'
        });
      }
      
      const addedMessage = document.querySelector(
        `.js-added-to-cart-${productId}`
      );
      
      if(addedMessage){
      addedMessage.classList.add('added-to-cart-visible'); // make the message visible 
    
      // Check if there's a previous timeout for this
      // product. If there is, we should stop it.
      const previousTimeoutId = this.addedMessageTimeouts[productId];
      if (previousTimeoutId) {
        clearTimeout(previousTimeoutId);
      }
    
      const timeoutId = setTimeout(() => {
        addedMessage.classList.remove('added-to-cart-visible');
      }, 2000);
    
      // Save the timeoutId for this product
      // so we can stop it later if we need to.
      this.addedMessageTimeouts[productId] = timeoutId;
      }else{
        console.warn(`No added-to-cart message element found for productId: ${productId}`);
      }

      // Save the updated cart to localStorage
      this.saveToStorage();
    },
  
     removeFromCart(productId) {
      const newCart = [];
    
      this.cartItems.forEach((cartItem) => {
        if (cartItem.productId !== productId) {// All other products with different productID than the one which is to be removed will get added to cart
          newCart.push(cartItem);
        }
      });
    
      this.cartItems = newCart;
      this.saveToStorage();
    },
  
     updateDeliveryOption(productId, deliveryOptionId) {
      let matchingItem;
    
      this.cartItems.forEach((cartItem) => { //Iterates over the cart and checks if product is already present in cart
        if (productId === cartItem.productId) {
          matchingItem = cartItem;
        }
      });
    
      matchingItem.deliveryOptionId = deliveryOptionId;
    
      this.saveToStorage();
    },
  
     calculateCartQuantity() {//sums up all quantities in the cart.
      let cartQuantity = 0;
    
      this.cartItems.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
      });
    
      return cartQuantity;
    },
     updateQuantity(productId, newQuantity) {//updates the quantity of a specific product in the cart.
  
      let matchingItem;
    
      cart.cartItems.forEach((cartItem) => {
        if (productId === cartItem.productId) {
          matchingItem = cartItem;
        }
      });
    
      matchingItem.quantity = newQuantity;
    
      this.saveToStorage();
    }
  
  };

  return cart;
}

const cart=Cart('cart-oop');
const buisnessCart=Cart('cart-buisness');


cart.loadFromStorage();
buisnessCart.loadFromStorage();

console.log(cart);
console.log(buisnessCart);