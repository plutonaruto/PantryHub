# PantryHub

## Problem Motivation
Students often experience difficulties in keeping the shared pantries clean and organised due to various reasons, which include the lack of responsibility from other residents in keeping the pantry clean. Additionally, residents may lack the time to cook and discard leftover ingredients, resulting in food wastage. 
Therefore, we introduce PantryHub, a one-stop pantry sharing system where users are able to keep track of the food items that they own in the pantry, give away food they no longer need through a shared marketplace, and use easy-to-follow recipes that takes into account the ingredients and kitchenware that the residents have. This encourages everyone to be more considerate in using the pantry. 

## Core Features 
1. ***Inventory Keeping:*** Users key in items placed in the pantry, while other users in the same group can view all the items in the pantry along with its owner.
2. ***Marketplace:*** Users are able to give up unexpired food iems that residents no longer want.
3. ***Recipe Generator:*** PantryHub comes up with healthy and easy recipes based off what items residents have as well as kitchenware each pantry has such as air fryers.
4. ***User Groups:*** Users are assigned to a specific pantry based on user information, in this case their NUS Login ID.

### Extensions 
1. ***Notification:*** Residents will be notified if a food item they own is expiring soon
2. ***Check-in Check-out System:*** A Check-in Check-out system for common items used in the pantry such as pans are implemented to ensure accountability for their cleanliness and usage.
3. ***Meal Planner:*** Users are able to bookmark certain recipes for specific dates to help them plan our their meals.

## User Stories
1. As a student who wants to keep the pantry organised, I want to be able to keep track of my items and be alerted when they are expiring.
2. As a student who wants to reduce food wastage, I want to be able to offer any unused items to other residents who can claim it through the app.
3. As a student who wants to eat healthy while also having a busy schedule, I want to be able to have quick yet healthy meals.
4. As a student who wants to ensure that the pantry is kept clean, I want to be able to hold people accountable on the common kitchenware that is being used in the pantry such that people always be considerate by cleaning up after using them. 

## Design 
### Wireframes:
- Register, Login, Homepage, Inventory and Marketplace Wireframes done using Figma

### User Flow:
1. ***Login Page:*** Residents login up using their NUS E-mail/NET and their password.
2. ***Home Dashboard:*** On successful login, users will be directed to their home dashboard, where they can view their inventory and expiring food items.
3. ***Product Information:*** Clicking on an item shows the products full information, which includes the name, description, quantity and expiry date.
4. ***Addition of Item:*** Clicking the plus icon in the homepage allows users to add a new item to their inventory
5. ***Removal of Item:*** To remove an item from user's inventory, simply click on the item they want to remove and press the 'Remove' button.
6. ***Marketplace:*** Clicking 'Marketplace' on the left bar of the homepage directs users to the marketplace, where they are able to see other food items that are put up for donation.
7. ***Posting an Marketplace Item:*** On the top right, users can click 'Post an Item' to be directed to a new page, where they will be able to post an item they want to put up on the marketplace.
8. ***Patching & Removing Marketplace Item:*** To edit a Marketplace item, owner can click on the product item, and the 'Edit' button and modify accordingly. To remove the item, the owner can click on the 'Remove' button.
9. ***Claiming Marketplace Item:*** On the Marketplace page, users can click on the item they are interested in, which will show the products full information. To claim, simply click on the 'Claim Now' button, where users can now head to the pantry to collect their food item.

### UI Design:
- ***Colour Scheme:*** Primary Colours will be purple and white for a clean and professional look.
- ***Navigation Bar:*** Contains links to dashboard, marketplace, logout and settings.
- ***Inventory:*** Displays all available items with options to add/search/delete items.
- ***Marketplace:*** Displays all available items with options to add/patch/delete items.

## Plan 
### Tech Stack:
- ***Frontend:*** React, Vite, ReactRouter, CSS, Figma, Socket.IO client
- ***Backend:*** Flask, SQLAlchemy, React, HuggingFace, Celery, Redis, Flask-SocketIO, Firebase Cloud Messaging
- ***Database:*** PostgreSQL
- ***Authentication:*** Firebase Authentication SDK, Firebase Auth token validation

### Testing: 
- Pytest
  
### Development Plan:
- [ ] Login/Registration of user
- [x] Inventory
  - [x] Post, Get, Delete item
- [x] Marketplace
  - [x] Post, Get, Patch marketplace item
  - [ ] Delete marketplace item
- [ ] Pickup notification
- [ ] Recipe results using items user has
- [ ] Save recipes
- [ ] Expiry notifications
- [ ] Meal Planner
- [ ] Check-in/out of kitchenware
