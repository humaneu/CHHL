# CHHL

DESCRIPTION

This is a moive database dirven website designed for true movie lover. In addition to the basic search and data storage functions, we implement an online game “How many movies can you name from one backdrop image?”  The game is a timing trivia. 
User could guess the title of movie from an image. Every correct answer can gain 10 points and 5 extra seconds. If you know movies well, this could be an endless journey. After the game is finished, user could compare the result with past top records and tweet the result.

MODULES AND ARCHITECTURE

The project consists of online databases and website. The databases store data of movies, users, actors…etc with mySQL management system. The website is a typical “html+css+javascript” structure. The front-end part is written with Jade engine. The back-end part is written with Node.js and is linked with the database. We have three main directories: “views/public/routes” containing “.jade/ .css/ .js” files. The APIs and other web functions are implemented based on these architectures and structures.

TECHNICAL SPECIFICATION

  Database : mySQL and MongoDB
  Web development : Node.js + Jade engine + CSS
  API : Bing Search API + Twitter API

Instructions to run:
Run app.js as a node application.
