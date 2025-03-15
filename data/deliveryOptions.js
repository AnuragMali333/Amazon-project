import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export const deliveryOptions=[{
  id:'1',
  deliveryDays:7,
  priceCents:0
 },{
  id:'2',
  deliveryDays:3,
  priceCents:499
 },{
  id:'3',
  deliveryDays:1,
  priceCents:999
 }];

export function getDeliveryOption(deliveryOptionId) {
  return deliveryOptions.find(option => option.id === deliveryOptionId) || deliveryOptions[0];
}

 /* Retrieves a delivery option based on the provided delivery option ID.
    If the specified ID is not found, it defaults to the first delivery option.
 */

export function calculateDeliveryDate(deliveryOption) {
  let estimatedDate = dayjs();// Start with today's date
  let daysLeft = deliveryOption.deliveryDays;

  while (daysLeft > 0) {
    estimatedDate = estimatedDate.add(1, 'day');// Increment the date
    if (!isWeekend(estimatedDate)) {//Decrement only if it's not weekend
      daysLeft--;
    }
  }

  return estimatedDate.format('dddd, MMMM D');
}
    

  
function isWeekend(date){
  return date.day() === 0 || date.day() === 6;
}
