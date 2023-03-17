# Restaurant-chatbot

A restaurant assistant chatbot that attends to customers orders.

This application was built with NodeJS, MongoDB, Express, HTML, Socket.io and Sessions.

# Navigating the application

Select 1️⃣ to Place an order:
When a user select 1, the available items to order are displayed with an option to add each of them to the cart. When a user clicks "Place order" for an item, it dsplays "item added to cart" which means that order has been successfully added to the user's cart

Select 99 to checkout order:
After placing orders for items the user wishes to buy, the user clicks the button "99" to
checkout orders. This means orders added to the cart list [from button 1.] would now be placed and ready to be delivered ASAP (as soon as possible)

If there is no order in the cart, a message is displayed saying "No order to place, Press 1️⃣ to place an order"

Select 9️⃣8️⃣ to see order history:
When a user selects 98, a table is displayed showing the status of items selected which is either "added to cart" or "order placed".
If there is no item sleected, the table displays "cart is empty"

Select 9️⃣7️⃣ to see current order:
When a user selects 97, the last and most current order selected is displayed with its name, status and date of order.

Select 0️⃣ to cancel order:
When a user selects 0, the most current order is deleted and a notification displaying the item deleted is shown.
