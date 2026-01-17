Web Service Primary URL:
https://onlinedeliverywebservice.onrender.com/

Retrieve all deliveries:
https://onlinedeliverywebservice.onrender.com/allDeliveries

To add new delivery:
https://onlinedeliverywebservice.onrender.com/addDeliveries

{
"fullname": "Anita McQuarter",
"phone_num": "97792709",
"delivery_status": "On Delivery Vehicle",
"product_name": "Bicycle"
}

To update delivery status:
https://onlinedeliverywebservice.onrender.com/updateDeliveries

{
"id": "8",
"fullname": "Anita McDouble",
"delivery_status": "Shipped",
"product_name": "Bicycle",
"product_image": "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSjbnSU310AKesFlXGnVoquYVV4WfgPNK1g8ERxeyBBOdtYsO2AVKFFiOOSvQQxAShzoDXJMTwGr6Yds38ElrAslsEbio-tT7-672jInj-yeFqM2yZtwpIuiQ"
}

To delete delivery using POST:
https://onlinedeliverywebservice.onrender.com/deleteDeliveries

{
"id": "8"
}