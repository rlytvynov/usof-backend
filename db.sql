/*CREATE USER IF NOT EXISTS 'rlytvynov'@'localhost' IDENTIFIED BY 'securepass';*/

CREATE DATABASE IF NOT EXISTS friendly_community;
GRANT ALL PRIVILEGES ON friendly_community.* TO 'rlytvynov'@'localhost';
USE friendly_community;

CREATE TABLE IF NOT EXISTS users 
(
    id INT NOT NULL AUTO_INCREMENT,
    login varchar(30) NOT NULL,
    password varchar(255) NOT NULL,
    fullName varchar(255) NULL,
    email varchar(64) UNIQUE NOT NULL,
    profilePicture VARCHAR(255) DEFAULT 'http://cdn.onlinewebfonts.com/svg/img_420635.png',
    rating INT NOT NULL DEFAULT 0,
    role ENUM('admin','user') NOT NULL DEFAULT 'user',
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS posts 
(
    id INT NOT NULL AUTO_INCREMENT,
    userID INT NOT NULL,
    title VARCHAR(128),
    publishDate DATE NOT NULL,
    content TEXT NOT NULL,
    rating INT NOT NULL DEFAULT 0,
    status ENUM('active','locked') NOT NULL DEFAULT 'active',
    PRIMARY KEY (id),
    FOREIGN KEY (userID)  REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments
(
    id INT NOT NULL AUTO_INCREMENT,
    userID INT NOT NULL,
    postID INT NOT NULL,
    publishDate DATE NOT NULL,
    content TEXT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (userID)  REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (postID)  REFERENCES posts (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes 
(
    id INT NOT NULL AUTO_INCREMENT,
    userID INT NOT NULL,
    postID INT NULL,
    commentID INT NULL,
    publishDate DATE NOT NULL,
    type ENUM('like','dislike') NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (userID)  REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (postID)  REFERENCES posts (id) ON DELETE CASCADE,
    FOREIGN KEY (commentID)  REFERENCES comments (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS categories 
(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(64),
    description TEXT,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS posts_categories 
(
    id INT NOT NULL AUTO_INCREMENT,
    postID INT NOT NULL,
    categoryID INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (categoryID)  REFERENCES categories (id) ON DELETE CASCADE,
    FOREIGN KEY (postID)  REFERENCES posts (id) ON DELETE CASCADE
);
