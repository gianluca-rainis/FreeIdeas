# FreeIdeas
## The project
The FreeIdeas project was born to give everybody a place where share ideas. Everyone can publish their own ideas, and all the published ideas are at the same level. We give visibility to each idea, for example showing the last ideas on the home page, or ordering by default the ideas from the newest to the oldest in the search page. Our goal is to create an international community where creatives share their ideas and help others realize theirs.

---

*If you are looking for non-technical informations please see the [README.md](README.md) file.*

---

## Features
### Ideas
- Publish an idea
- Update an old idea
- Save an idea
- Vote an idea
- Follow an idea
- Report an idea
- Comment an idea
- Delete an old comment that you have published
- Delete an old idea
- See the author's username (and visit it's account page if the account is public)
- Required fields to publish an idea:
    - Title
    - Description
    - Main image
    - A license:
        - You can use the default license (The *FreeIdeas License*)
        - You can load a personalized license (only *pdf* files)
- Optional fields:
    - External link
    - Additional informations:
        - Image
        - Title
        - Description
    - Logs:
        - Title
        - Description
        - Date (automatically set to the current date)

### Accounts
- Logged user account:
    - Update their account informations
    - Made their account public or private
    - Send an email to change the password of their account
    - Delete their account
    - Recive notifications when a followed idea is edited or deleted
    - Recive notifications when a followed account is edited or deleted
    - Recive notifications when you publish an idea
    - Recive notifications when you delete an idea
    - Recive notifications when you change your account informations
- Others account:
    - Follow an account
    - Report an account
- See their saved ideas
- See their published ideas
- Users can't visit the account's page if the target account is private

### Reserved Area
- Login as administrator
- Logout
- Manage accounts:
    - See all the accounts informations (both for public and private accounts)
    - Search an account
    - Edit all the accounts informations (except for the password)
    - Delete an account
- Manage ideas:
    - See all the ideas informations
    - Search an idea
    - Edit all the ideas informations
    - Delete an idea
    - Delete the comments of an idea
- Manage notifications:
    - See all the notifications
    - Search a notification
    - Delete a notification
    - Create a new notification
        - Title
        - Date
        - Description
        - Account
        - Status:
            - Read
            - Not read
- Manage reports:
    - See all the reports
    - Search a report
    - Delete a report

### Other
- Search an idea
- Search a public account
- Create an account
- Login
- Logout
- Visit a random idea page
- Send feedbacks
- Each idea have an unique link
- Each public account have an unique link
- Light color theme
- Dark color theme
- Responsive (usable from computers, phones and tablets)

## Technologies used
- HTML
- CSS
- Next.js
- React

## Methods used
- HTTP / HTTPS: to send the pages to the client
- POST: to send and recive the data of the forms in a secure way
- GET: to manage the univoque links for the ideas and the accounts

## Software requirements
- A DBMS (for the development it's been used MySQL).
- Apache (or an equivalent) to run a webserver.
- NPM to install the dependencies.
- Next to run the back-end.
- React for the front-end.
- Vite for the dependencies.

## Files
```
FreeIdeas/
├── components/
    ├── reserved/
        ├── AccountEditModal.jsx
        ├── AccountsView.jsx
        ├── IdeaEditModal.jsx
        ├── IdeasView.jsx
        ├── NotificationsView.jsx
        ├── ReportsView.jsx
        └── WelcomeView.jsx
    ├── Footer.jsx
    ├── Head.jsx
    ├── LoginForm.jsx
    ├── Modal.jsx
    ├── ModalProvider.jsx
    ├── Nav.jsx
    └── PasswordInput.jsx
├── contexts/
    └── CommonContext.js
├── hooks/
    ├── useAuth.js
    ├── useModals.js
    ├── useNotifications.js
    ├── usePasswordVisibility.js
    └── useThemeImages.js
├── lib/
    ├── db_connection.js
    ├── session.js
    └── withSession.js
├── pages/
    ├── account/
        └── [id].js
    ├── api/
        ├── changePassword.js
        ├── createNewNotificationAdmin.js
        ├── data.js
        ├── deleteAccount.js
        ├── deleteComment.js
        ├── deleteIdea.js
        ├── deleteNotification.js
        ├── deleteNotificationAdmin.js
        ├── deleteReportAdmin.js
        ├── followAccountIdea.js
        ├── getAccountData.js
        ├── getAccountDataForReservedArea.js
        ├── getFreeIdeasLicense.js
        ├── getIdeaDataForReservedArea.js
        ├── getLastIdeas.js
        ├── getNotificationsDataForReservedArea.js
        ├── getRandomIdeaId.js
        ├── getReportsDataForReservedArea.js
        ├── getSessionData.js
        ├── login.js
        ├── logout.js
        ├── modifyAccountInfo.js
        ├── modifyIdeaInfoAdmin.js
        ├── reportIdeaAccount.js
        ├── reservedAreaLogin.js
        ├── saveAccountIdeaData.js
        ├── saveNewComment.js
        ├── saveNewIdea.js
        ├── searchAnIdea.js
        ├── setNotificationAsRead.js
        ├── signUp.js
        └── updateOldIdea.js
    ├── idea/
        └── [id].js
    ├── publishAnIdea/
        └── [id].js
    ├── _app.js
    ├── _document.js
    ├── about.js
    ├── account.js
    ├── contacts.js
    ├── createAccount.js
    ├── faq.js
    ├── feedback.js
    ├── index.js
    ├── licensePage.js
    ├── login.js
    ├── privacyPolicy.js
    ├── publishAnIdea.js
    ├── reservedArea.js
    ├── searchAnIdea.js
    └── termsOfUse.js
├── public/
    ├── images/
        ├── logo/
            ├── FreeIdeas_official_logos.zip
            ├── FreeIdeas_Pro.svg
            ├── FreeIdeas_ReservedArea.svg
            └── FreeIdeas.svg
        └── ...                                 # Omitted because too many files
├── styles/
    ├── LoginForm.module.css
    ├── Modal.module.css
    ├── PasswordToggle.module.css
    └── styles.css
├── utils/
    ├── apiConfig.js
    ├── errorHandling.js
    └── fetchWithTimeout.js
├── .gitignore
├── about.html
├── account.html
├── contacts.html
├── createAccount.html
├── faq.html
├── favicon.svg
├── feedback.html
├── FreeIdeasLicense.md
├── idea.html
├── index.html
├── LICENSE.md
├── licensePage.html
├── login.html
├── next.config.js
├── package.json
├── privacyPolicy.html
├── publishAnIdea.html
├── README.md
├── reservedArea.html
├── robots.txt
├── searchAnIdea.html
├── sitemap.xml
├── termsOfUse.html
└── TECHNICAL_REPORT.md
```

## Dependencies
```bash
npm install next react react-dom
```
```bash
npm install mysql2
```
```bash
npm install bcrypt
```
```bash
npm install nodemailer
```
```bash
npm install formidable
```
```bash
npm install iron-session
```

## ENV Variables
```
DB_HOST

DB_USER

DB_PASSWORD

DB_NAME

SECRET_COOKIE_PASSWORD

EMAIL_NODE_MAILER

PASSWORD_NODE_MAILER

SITE_URL
```

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
    id INT NOT NULL AUTO_INCREMENT,
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
+---------------------------------------------------------------------------------+
|                                     ideas                                       |
+---------------------------------------------------------------------------------+
| id | authorid | title | data | ideaimage | description | downloadlink | license |
+----+----------+-------+------+-----------+-------------+------------------------+
|    |          |       |      |           |             |              |         |
|    |          |       |      |           |             |              |         |
|    |          |       |      |           |             |              |         |
+----+----------+-------+------+-----------+-------------+------------------------+
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
    license mediumblob,
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
    authorid int NULL,
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
| license      | mediumblob     | YES  |     | NULL    |                |
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
| authorid       | int            | YES  | MUL | NULL    |                |
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