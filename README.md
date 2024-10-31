# Overview
**Delirium** is the Git repository that groups all my personal project, both to create and develop products that I need, and to learn new languages, frameworks and good practices.
- *geodezic-app* is a project that aims to geolocate in real time a mobile phone and display its position on a map. To do so, it has one server side (the admin page) that display a map and the location of the mobile; and a client side (the user page) which is ran on a mobile and send the location to the admin.

# Geodezic-app

## Technical stack & architecture
This app is a progressive web app (PWA), which means that it is ran on a web browser, either on a computer or a mobile phone. It is written in JavaScript, HTML and CSS.
The three directories at the project root, *pages/*, *scripts/* and *styles/*, group respectively the html, the javascript and the css files of the different project web pages.
The *server.js* files manages and set up the whole PWA, such as endpoints and the way of the different apges are communicating (WebSocket). It is also use for debug purposes.

## Installation

Instructions for installing and running the *geodezic-app* project.

```bash
git clone git@github.com:cachoupss/delirium.git
cd delirium/geodezic-app
node server.js
```
In order to allow the execution of the app on a mobile phone, it is mandatory to use a secure https request to communicate with the server. That's why it is not possible to use the localhost adress in this case. Instead, you can use for example [Render](https://render.com/) to deploy freely the app and test it.  You just need to create an account and to link it to your github account.