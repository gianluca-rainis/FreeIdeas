# FreeIdeas
FreeIdeas is a site where you can publish your ideas for projects, apps, and websites, and where you can find inspiration for your next project.
You can search for ideas, publish your own ideas, ask for help on your ideas, or just browse through the ideas of others.
The published ideas are free to use, and you can use them as you wish, without any restrictions (except for the ones mentioned in the license).
The site is open to everyone, and you can contribute by publishing your own ideas or by helping others with their ideas.
The goal of FreeIdeas is to create a community of people who share their ideas and help each other to bring them to life.
If you have an idea that you want to share with the world, or if you are looking for inspiration for your next project, FreeIdeas is the place for you.

## ✨ Features
- Search for ideas
- Publish your own ideas
- Ask for help on your ideas
- Browse through the ideas of others
- Open to everyone
- Free to use

## 🧑‍💻 Author
The author of the project is Gianluca Rainis ( gianluca-rainis on GitHub ).

## 📜 License
FreeIdeas is under the FreeIdeas License.

### 📜⚠️ License Update Notice

As of *2025-07-21*, the FreeIdeas project is no longer distributed under the MIT License.

All versions from *v1.4 onward* are governed by the *FreeIdeas License*, a custom licensing framework designed to preserve the project's identity, non-commercial intent, and ethical attribution chain across derivative works.

Users and contributors are strongly encouraged to review the full license terms available in [LICENSE.md](./LICENSE.md) before reusing, modifying, or redistributing any part of this project.

Previous releases distributed under the MIT License remain available under those original terms.

---

As of *2025-08-16*, the FreeIdeas project is distributed under an updated version of the FreeIdeas License.

All versions from *v1.7 onward* are governed by the *FreeIdeas License*, a custom licensing framework designed to preserve the project's identity, non-commercial intent, and ethical attribution chain across derivative works.

Users and contributors are strongly encouraged to review the full license terms available in [LICENSE.md](./LICENSE.md) before reusing, modifying, or redistributing any part of this project.

Previous releases distributed under the old FreeIdeas License remain available under those original terms.

## 🌍 Languages
FreeIdeas is written in HTML, CSS and JavaScript.

## ֎🇦🇮 AI Disclaimer
THE AI WAS USED IN THIS PROJECT ONLY IN THE DEBUG PHASE.

NO TYPE OF AI WAS USED FOR THE DESIGN, DEVELOPMENT OR ACTUAL IMPLEMENTATION FOR THIS PROJECT.

EVERITHING WAS DEVELOPED BY THE AUTHOR.

## 🛢 DataBase structure
### Accounts
```SQL
+--------------------------------------------------------------------------------------+
|                                       accounts                                       |
+--------------------------------------------------------------------------------------+
| id | email | password | name | surname | userimage | description | username | public |
+----+-------+----------+------+---------+-----------+---------------------------------+
|    |       |          |      |         |           |             |          |        |
|    |       |          |      |         |           |             |          |        |
|    |       |          |      |         |           |             |          |        |
+----+-------+----------+------+---------+-----------+-------------+----------+--------+
```

```SQL
CREATE TABLE accounts (
    id int NOT NULL AUTO_INCREMENT,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    surname varchar(255) NOT NULL,
    userimage mediumblob,
    description varchar(1000),
    username varchar(255) NOT NULL,
    public int NOT NULL,
    PRIMARY KEY (id)
);
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

```SQL
CREATE TABLE ideas (
    id int NOT NULL AUTO_INCREMENT,
    authorid int NOT NULL,
    title varchar(255) NOT NULL,
    data date NOT NULL,
    ideaimage mediumblob,
    description varchar(10000) NOT NULL,
    downloadlink varchar(5000),
    PRIMARY KEY (id),
    FOREIGN KEY (authorid) REFERENCES accounts(id)
);
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

```SQL
CREATE TABLE additionalinfo (
    id int NOT NULL AUTO_INCREMENT,
    title varchar(255) NOT NULL,
    updtimage mediumblob NOT NULL,
    description varchar(10000) NOT NULL,
    ideaid int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (ideaid) REFERENCES ideas(id)
);
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

```SQL
CREATE TABLE authorupdates (
    id int NOT NULL AUTO_INCREMENT,
    title varchar(255) NOT NULL,
    description varchar(10000),
    ideaid int NOT NULL,
    data date NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (ideaid) REFERENCES ideas(id)
);
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

```SQL
CREATE TABLE comments (
    id int NOT NULL AUTO_INCREMENT,
    authorid int NOT NULL,
    data date NOT NULL,
    description varchar(10000) NOT NULL,
    ideaid int NOT NULL,
    superCommentid int,
    PRIMARY KEY (id),
    FOREIGN KEY (authorid) REFERENCES accounts(id),
    FOREIGN KEY (ideaid) REFERENCES ideas(id),
    FOREIGN KEY (superCommentid) REFERENCES comments(id)
);
```

### Labels of a project
```SQL
+--------------------------------------------------------------------+
|                             idealabels                             |
+--------------------------------------------------------------------+
| id | ideaid | type | creativity | status | saves | likes | dislike |
+----+--------+------+------------+--------+-------+-------+---------+
|    |        |      |            |        |       |       |         |
|    |        |      |            |        |       |       |         |
|    |        |      |            |        |       |       |         |
+----+--------+------+------------+--------+-------+-------+---------+
```

```SQL
CREATE TABLE idealabels (
    id int NOT NULL AUTO_INCREMENT,
    ideaid int NOT NULL,
    type varchar(500) NOT NULL,
    creativity varchar(500) NOT NULL,
    status varchar(500) NOT NULL,
    saves int NOT NULL,
    likes int NOT NULL,
    dislike int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (ideaid) REFERENCES ideas(id)
);
```

### Account additional data about ideas
```SQL
+---------------------------------------------------+
|                  accountideadata                  |
+---------------------------------------------------+
| id | accountid | ideaid | saved | dislike | liked |
+----+-----------+--------+-------+---------+-------+
|    |           |        |       |         |       |
|    |           |        |       |         |       |
|    |           |        |       |         |       |
+----+-----------+--------+-------+---------+-------+
```

```SQL
CREATE TABLE accountideadata (
    id int NOT NULL AUTO_INCREMENT,
    accountid int NOT NULL,
    ideaid int NOT NULL,
    saved int,
    dislike int,
    liked int,
    PRIMARY KEY (id),
    FOREIGN KEY (accountid) REFERENCES accounts(id),
    FOREIGN KEY (ideaid) REFERENCES ideas(id)
);
```

### Account notifications
```SQL
+------------------------------------------------------+
|                     notifications                    |
+------------------------------------------------------+
| id | accountid | title | description | data | status |
+----+-----------+-------+-------------+------+--------+
|    |           |       |             |      |        |
|    |           |       |             |      |        |
|    |           |       |             |      |        |
+----+-----------+-------+-------------+------+--------+
```

```SQL
CREATE TABLE notifications (
    id int NOT NULL AUTO_INCREMENT,
    accountid int NOT NULL,
    title varchar(255) NOT NULL,
    description varchar(10000) NOT NULL,
    data date NOT NULL,
    status int NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (accountid) REFERENCES accounts(id)
);
```

### Reports (ideas, accounts)
```SQL
+-----------------------------------------------+
|                    reports                    |
+-----------------------------------------------+
| id | authorid | ideaid | accountid | feedback |
+----+----------+--------+-----------+----------+
|    |          |        |           |          |
|    |          |        |           |          |
|    |          |        |           |          |
+----+----------+--------+-----------+----------+
```

```SQL
CREATE TABLE reports (
    id int NOT NULL AUTO_INCREMENT,
    authorid int NOT NULL,
    ideaid int,
    accountid int,
    feedback varchar(10000) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (authorid) REFERENCES accounts(id)
);
```

### Follow (ideas, accounts)
```SQL
+-----------------------------------------------------------+
|                          follow                           |
+-----------------------------------------------------------+
| id | followaccountid | followedaccountid | followedideaid |
+----+-----------------+-------------------+----------------+
|    |                 |                   |                |
|    |                 |                   |                |
|    |                 |                   |                |
+----+-----------------+-------------------+----------------+
```

```SQL
CREATE TABLE follow (
    id int NOT NULL AUTO_INCREMENT,
    followaccountid int NOT NULL,
    followedaccountid int,
    followedideaid int,
    PRIMARY KEY (id),
    FOREIGN KEY (followaccountid) REFERENCES accounts(id),
    FOREIGN KEY (followedaccountid) REFERENCES accounts(id),
    FOREIGN KEY (followedideaid) REFERENCES ideas(id)
);
```

### Reserved Area Accounts
```SQL
+---------------------------------------------------------------------------+
|                            reservedareaaccounts                           |
+---------------------------------------------------------------------------+
| id | username | password1 | password2 | password3 | password4 | password5 |
+---------------------------------------------------------------------------+
|    |          |           |           |           |           |           |
|    |          |           |           |           |           |           |
|    |          |           |           |           |           |           |
+---------------------------------------------------------------------------+
```

```SQL
CREATE TABLE reservedareaaccounts (
    id int NOT NULL AUTO_INCREMENT,
    username varchar(255) NOT NULL,
    password1 varchar(255) NOT NULL,
    password2 varchar(255) NOT NULL,
    password3 varchar(255) NOT NULL,
    password4 varchar(255) NOT NULL,
    password5 varchar(255) NOT NULL,
    PRIMARY KEY (id)
);
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
| description | varchar(1000)  | YES  |     | NULL    |                |
| username    | varchar(255)   | NO   |     | NULL    |                |
| public      | int            | NO   |     | NULL    |                |
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

mysql> describe idealabels;
+------------+--------------+------+-----+---------+----------------+
| Field      | Type         | Null | Key | Default | Extra          |
+------------+--------------+------+-----+---------+----------------+
| id         | int          | NO   | PRI | NULL    | auto_increment |
| ideaid     | int          | NO   | MUL | NULL    |                |
| type       | varchar(500) | NO   |     | NULL    |                |
| creativity | varchar(500) | NO   |     | NULL    |                |
| status     | varchar(500) | NO   |     | NULL    |                |
| saves      | int          | NO   |     | NULL    |                |
| likes      | int          | NO   |     | NULL    |                |
| dislike    | int          | NO   |     | NULL    |                |
+------------+--------------+------+-----+---------+----------------+

mysql> describe accountideadata;          
+-----------+------+------+-----+---------+----------------+
| Field     | Type | Null | Key | Default | Extra          |
+-----------+------+------+-----+---------+----------------+
| id        | int  | NO   | PRI | NULL    | auto_increment |
| accountid | int  | NO   | MUL | NULL    |                |
| ideaid    | int  | NO   | MUL | NULL    |                |
| saved     | int  | YES  |     | NULL    |                |
| dislike   | int  | YES  |     | NULL    |                |
| liked     | int  | YES  |     | NULL    |                |
+-----------+------+------+-----+---------+----------------+

mysql> describe notifications;
+-------------+----------------+------+-----+---------+----------------+
| Field       | Type           | Null | Key | Default | Extra          |
+-------------+----------------+------+-----+---------+----------------+
| id          | int            | NO   | PRI | NULL    | auto_increment |
| accountid   | int            | NO   | MUL | NULL    |                |
| title       | varchar(255)   | NO   |     | NULL    |                |
| description | varchar(10000) | NO   |     | NULL    |                |
| data        | date           | NO   |     | NULL    |                |
| status      | int            | NO   |     | NULL    |                |
+-------------+----------------+------+-----+---------+----------------+

mysql> describe reports;
+-----------+----------------+------+-----+---------+----------------+
| Field     | Type           | Null | Key | Default | Extra          |
+-----------+----------------+------+-----+---------+----------------+
| id        | int            | NO   | PRI | NULL    | auto_increment |
| authorid  | int            | NO   | MUL | NULL    |                |
| ideaid    | int            | YES  |     | NULL    |                |
| accountid | int            | YES  |     | NULL    |                |
| feedback  | varchar(10000) | NO   |     | NULL    |                |
+-----------+----------------+------+-----+---------+----------------+

mysql> describe follow;
+-------------------+------+------+-----+---------+----------------+
| Field             | Type | Null | Key | Default | Extra          |
+-------------------+------+------+-----+---------+----------------+
| id                | int  | NO   | PRI | NULL    | auto_increment |
| followaccountid   | int  | NO   | MUL | NULL    |                |
| followedaccountid | int  | YES  | MUL | NULL    |                |
| followedideaid    | int  | YES  | MUL | NULL    |                |
+-------------------+------+------+-----+---------+----------------+

mysql> describe reservedareaaccounts;
+-----------+--------------+------+-----+---------+----------------+
| Field     | Type         | Null | Key | Default | Extra          |
+-----------+--------------+------+-----+---------+----------------+
| id        | int          | NO   | PRI | NULL    | auto_increment |
| username  | varchar(255) | NO   |     | NULL    |                |
| password1 | varchar(255) | NO   |     | NULL    |                |
| password2 | varchar(255) | NO   |     | NULL    |                |
| password3 | varchar(255) | NO   |     | NULL    |                |
| password4 | varchar(255) | NO   |     | NULL    |                |
| password5 | varchar(255) | NO   |     | NULL    |                |
+-----------+--------------+------+-----+---------+----------------+
```