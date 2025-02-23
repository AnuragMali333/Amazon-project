export let orders = JSON.parse(localStorage.getItem('orders')) ?? [];

if (!Array.isArray(orders)) {
  console.warn("Invalid orders data found in localStorage. Resetting...");
  localStorage.removeItem('orders'); // Clear corrupted data
  orders.length = 0; // Reset to an empty array
}else {
  // Remove orders with no products
  orders = orders.filter(order => order.products && order.products.length > 0);
  localStorage.setItem('orders', JSON.stringify(orders));
}


export function addOrder(order){
  if (!order.products || !Array.isArray(order.products) || order.products.length === 0) {
    console.warn("Attempted to add an empty order. Ignoring...");
    return; // Don't save empty orders

  }
  orders.unshift(order);// adds order to front of array
  saveToStorage();
  
}

function saveToStorage(){
  localStorage.setItem('orders',JSON.stringify(orders));
}


export function getOrder(orderId) {
  let matchingOrder;

  orders.forEach((order) => {
    if (order.id === orderId) {
      matchingOrder = order;
    }
  });

  return matchingOrder;
}