# FreeIdeas
Free Ideas is a site where you can publish your ideas for projects, apps, and websites, and where you can find inspiration for your next project.
You can search for ideas, publish your own ideas, ask for help on your ideas, or just browse through the ideas of others.
The published ideas are free to use, and you can use them as you wish, without any restrictions (except for the ones mentioned in the license).
The site is open to everyone, and you can contribute by publishing your own ideas or by helping others with their ideas.
The goal of Free Ideas is to create a community of people who share their ideas and help each other to bring them to life.
If you have an idea that you want to share with the world, or if you are looking for inspiration for your next project, Free Ideas is the place for you.

## Features
- Search for ideas
- Publish your own ideas
- Ask for help on your ideas
- Browse through the ideas of others
- Open to everyone
- Free to use

## Author
The author of the project is Gianluca Rainis ( __grdev on summer.hackclub.com )
This project was written for the Summer Of Making 2025

## License
FreeIdeas is under the MIT license.

## Languages
FreeIdeas is written in HTML, CSS and JavaScript.

## AI Disclaimer
NO TYPE OF AI WAS USED AT ANY STAGE OF DESIGN, DEVELOPMENT OR ACTUAL IMPLEMENTATION FOR THIS PROJECT.
EVERITHING WAS DEVELOPED BY THE AUTHOR.

## DataBase structure
### Accounts
```SQL
+-----------------------------------------------------------------------------+
|                                   accounts                                  |
+-----------------------------------------------------------------------------+
| id | email | password | name | surname | userimage | description | username |
+----+-------+----------+------+---------+-----------+------------------------+
|    |       |          |      |         |           |             |          |
|    |       |          |      |         |           |             |          |
|    |       |          |      |         |           |             |          |
+----+-------+----------+------+---------+-----------+-------------+----------+
```

### Ideas
```SQL
+-----------------------------------------------------------------------+
|                                ideas                                  |
+-----------------------------------------------------------------------+
| id | authorid | title | data | ideaimage | description | downloadlink |
+----+----------+-------+------+-----------+-------------+--------------+
|    |          |       |      |           |             |              |
|    |          |       |      |           |             |              |
|    |          |       |      |           |             |              |
+----+----------+-------+------+-----------+-------------+--------------+
```

### Additional info
```SQL
+-----------------------------------------------+
|                 additionalinfo                |
+-----------------------------------------------+
| id | title | updtimage | description | ideaid |
+----+-------+-----------+-------------+--------+
|    |       |           |             |        |
|    |       |           |             |        |
|    |       |           |             |        |
+----+-------+-----------+-------------+--------+
```

### Author Updates
```SQL
+------------------------------------------+
|              authorupdates               |
+------------------------------------------+
| id | title | description | ideaid | data |
+----+-------+-------------+--------+------+
|    |       |             |        |      |
|    |       |             |        |      |
|    |       |             |        |      |
+----+-------+-------------+--------+------+
```

### Comments and help
```SQL
+--------------------------------------------------------------+
|                           comments                           |
+--------------------------------------------------------------+
| id | authorid | data | description | ideaid | superCommentid |
+----+----------+------+-------------+--------+----------------+
|    |          |      |             |        |                |
|    |          |      |             |        |                |
|    |          |      |             |        |                |
+----+----------+------+-------------+--------+----------------+
```

## Database Types
```SQL
mysql> describe accounts;
+-------------+----------------+------+-----+---------+----------------+
| Field       | Type           | Null | Key | Default | Extra          |
+-------------+----------------+------+-----+---------+----------------+
| id          | int            | NO   | PRI | NULL    | auto_increment |
| email       | varchar(255)   | NO   |     | NULL    |                |
| password    | varchar(255)   | NO   |     | NULL    |                |
| name        | varchar(255)   | NO   |     | NULL    |                |
| surname     | varchar(255)   | NO   |     | NULL    |                |
| userimage   | mediumblob     | YES  |     | NULL    |                |
| description | varchar(10000) | YES  |     | NULL    |                |
| username    | varchar(255)   | NO   |     | NULL    |                |
+-------------+----------------+------+-----+---------+----------------+

mysql> describe ideas;
+--------------+----------------+------+-----+---------+----------------+
| Field        | Type           | Null | Key | Default | Extra          |
+--------------+----------------+------+-----+---------+----------------+
| id           | int            | NO   | PRI | NULL    | auto_increment |
| authorid     | int            | NO   | MUL | NULL    |                |
| title        | varchar(255)   | NO   |     | NULL    |                |
| data         | date           | NO   |     | NULL    |                |
| ideaimage    | mediumblob     | YES  |     | NULL    |                |
| description  | varchar(10000) | NO   |     | NULL    |                |
| downloadlink | varchar(5000)  | YES  |     | NULL    |                |
+--------------+----------------+------+-----+---------+----------------+

mysql> describe additionalinfo;
+-------------+----------------+------+-----+---------+----------------+
| Field       | Type           | Null | Key | Default | Extra          |
+-------------+----------------+------+-----+---------+----------------+
| id          | int            | NO   | PRI | NULL    | auto_increment |
| title       | varchar(255)   | NO   |     | NULL    |                |
| updtimage   | mediumblob     | NO   |     | NULL    |                |
| description | varchar(10000) | NO   |     | NULL    |                |
| ideaid      | int            | NO   | MUL | NULL    |                |
+-------------+----------------+------+-----+---------+----------------+

mysql> describe authorupdates;
+-------------+----------------+------+-----+---------+----------------+
| Field       | Type           | Null | Key | Default | Extra          |
+-------------+----------------+------+-----+---------+----------------+
| id          | int            | NO   | PRI | NULL    | auto_increment |
| title       | varchar(255)   | NO   |     | NULL    |                |
| description | varchar(10000) | YES  |     | NULL    |                |
| ideaid      | int            | NO   | MUL | NULL    |                |
| data        | date           | NO   |     | NULL    |                |
+-------------+----------------+------+-----+---------+----------------+

mysql> describe comments;  
+----------------+----------------+------+-----+---------+----------------+
| Field          | Type           | Null | Key | Default | Extra          |
+----------------+----------------+------+-----+---------+----------------+
| id             | int            | NO   | PRI | NULL    | auto_increment |
| authorid       | int            | NO   | MUL | NULL    |                |
| data           | date           | NO   |     | NULL    |                |
| description    | varchar(10000) | NO   |     | NULL    |                |
| ideaid         | int            | NO   | MUL | NULL    |                |
| superCommentid | int            | YES  | MUL | NULL    |                |
+----------------+----------------+------+-----+---------+----------------+
```

## Database interrogation
### In ./api/data.php
```SQL
SELECT ideas.*, accounts.username AS accountName FROM ideas JOIN accounts ON ideas.authorid=accounts.id WHERE ideas.id=?;

SELECT * FROM additionalinfo WHERE ideaid=?;

SELECT * FROM authorupdates WHERE ideaid=?;

SELECT comments.*, accounts.username, accounts.userimage FROM comments JOIN accounts ON accounts.id=comments.authorid WHERE comments.ideaid=?;
```