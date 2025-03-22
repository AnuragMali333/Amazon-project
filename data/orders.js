export let orders = JSON.parse(localStorage.getItem('orders')) ?? [];

if (!Array.isArray(orders)) {
  console.warn("Invalid orders data found in localStorage. Resetting...");
  localStorage.removeItem('orders'); // Clear corrupted data
  orders=[]; // Reset to an empty array
}else {
  // Remove orders with no products
  orders = orders.filter(order => order.products && order.products.length > 0);
  localStorage.setItem('orders', JSON.stringify(orders));
}


export function addOrder(order){
  orders.unshift(order);// adds order to front of array
  saveToStorage();
  
}

function saveToStorage(){
  localStorage.setItem('orders',JSON.stringify(orders));
}


export function getOrder(orderId) {
  return orders.find(order => order.id === orderId) || null;
}