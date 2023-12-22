#!/bin/sh

wget --no-check-certificate --header='Content-Type: application/json' --post-data='{
    "name": "Harry123",    
    "surname": "Potter123",   
    "email": "harry@gmail.com",   
    "password": "Password12312312312!",
    "repeatPassword": "Password12312312312!",
    "cardNumber": "1234567890123123",
    "identityDocument": "AB-234"
}' http://web:3000/api/register -O-

wget --no-check-certificate --header='Content-Type: application/json' --post-data='{
    "name": "Harry",    
    "surname": "Potter",   
    "email": "harry123@gmail.com",
    "password": "Password123!",
    "repeatPassword": "Password123!",
    "cardNumber": "1234567890123456",
    "identityDocument": "AB-123"
}' http://web:3000/api/register -O-