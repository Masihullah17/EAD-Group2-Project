# EAD-Group2-Project

Enterprise Application Development Course Project @IIITS

## Team Members

-   Shaik Masihullah | S20180010159
-   Shikhar Arya | S20180010162
-   Brinda S | S20180010031
-   Rishimanudeep | S20180010062
-   Kavya Nemmoju | S20180010078

## Problem

In this hustling times, we look for ways to save our time.

In situations where you are waiting for something to get updated, like launch of a new product or restocking, we keep checking the website at frequent intervals, causing a distraction and waste our time.

In emergency/urgent situations, where every minute matter, any delay caused may result into unfavourable conditions.

Some websites are malicious, which can cause scam or trouble to people.

## Idea Proposal

Watcher is an asynchronous website monitoring application.

Just enter the URL of the website and select the particular element, text or an image to be observed for a change and frequency to check for changes and leave the rest to us. Once the event occurs, you will be notified about the update.

It is more precise and robust in handling the requests of the users.

It provides low latency performance notifications.

Secure connections and prevention of online attacks.

## Features

-   Select content update from three possible choices: visual, text or element based
-   Robust asynchronous approach to check for updates on watch requests
-   Low latency notifications for any updates on the website from watcher
-   Smart email notifications when content has changed
-   Secure and resistant to cyberattacks
-   User-friendly UI consisting of a authentication pages, dashboard for tracking current summary of URLs being watched with their status and a form for submitting watch requests.

## Tech Stack

-   We have used MERN Stack.

-   We setup mongodb database on MongoDB Atlas for having a centralised database access.

-   Additional packages used:
    -   HTML-Parser & Body Parser for parsing requests and json objects
    -   Winston & Winston-mongodb for logging accesses and errors
    -   Nodemailer for sending emails
    -   Rembrandt for comparing images visually
    -   Mongoose for connecting to the database
    -   Crypto for salting and hashing the passwords

## Enterprise Application Development(EAD) Feature: Security

### Implemented by Shaik Masihullah, Shikhar Arya

We have decided to implement the security aspect of Enterprise Application Development. Broadly we will be authorizing and authenticating the user credentials, logging and avoiding Denial of Service (DoS) attack, Distributed Denial of Service (DDoS) attack and Redirection DNS attacks.

-   Authentication and Authorization of user credentials
    -   Created our own salts and hashing mechanisms using crypto package
    -   Managing user authorization using browser cache based sessions

*   Logging accesses

    -   All database accesses and errors are logged in the database.

*   To avoid DoS attack

    -   Maximum three attempts for the wrong password, after which the user will be blocked for 12 hours.

*   To avoid a DDoS attack

    -   Watch Request form can be filled only 10 times per day
    -   Limit any input forms entries based on the IP address of the user.

*   To avoid DNS attack
    -   URL given for watching should be the end URL, no further redirection to any other pages will be allowed, if so, the URL will be blacklisted

## Contributions

-   Shaik Masihullah

    -   Written methods to detect changes in elements of a website
    -   Written methods to detect image changes of a website
    -   Setting up express, http and https packages for carrying out various requests
    -   Written backend for user authentication using crypto package, by generating 128 bits salts and hashing the passwords of users using sha512 algorithm before saving in the database
    -   Browser cache based authorization, where user login details are saved in browser cache through out his/her session
    -   APIs for user database accessing to connect frontend and backend
    -   Written various database operation methods for accessing the data
    -   Written methods for watching websites asynchronously
    -   Setup mailing methods using node-mailer package
    -   **EAD Feature**: Written methods for authentication and authorization of the user using crypto package and browser cache
    -   **EAD Feature**: Written methods to protect from DoS attack by limiting no of wrong password attempts, failing which the user will be blocked for 12 hours
    -   **EAD Feature**: Written methods to protect from DDoS attack by limiting the no of form and input submissions via API in various forms like per user, per ip and per subnet ip

-   Shikhar Arya

    -   Created Cluster on MongoDB Atlas for our database
    -   Created dummy database for trial connection check
    -   Seperated the frontend and backend to run on different ports for faster access and easy debugging
    -   Written API requests for the watch requests database collection
    -   Setup of mails for element and image change configurations
    -   Connected the frontend of the watch request form to the backend
    -   **EAD Feature**: Setting up Winston for logging user credentials for security purposes
    -   **EAD Feature**: Setting up Winston-mongodb for connecting Winston to our database for storing the logs
    -   **EAD Feature**: Preventing Redirection DNS attacks

-   Rishi Manudeep

    -   Build the watch request form UI using Reactjs
    -   Build the backend for the form validation and submission
    -   Build the watch requests user dashboard UI using Reactjs
    -   Build the backend for dashboard reading data from the database and rendering on the UI
    -   **EAD Feature**: Helped for setting up the authentication backend

-   Brinda S

    -   Build the UI for Authentication login and signup pages using Reactjs
    -   Created animations for UI using Reactjs

-   Kavya Nemmoju
    -   Build the settings page UI and backend
