mysql> describe budget;
+-------------+---------------+------+-----+---------+----------------+
| Field       | Type          | Null | Key | Default | Extra          |
+-------------+---------------+------+-----+---------+----------------+
| ID          | int(11)       | NO   | PRI | NULL    | auto_increment |
| amount      | decimal(13,4) | YES  |     | NULL    |                |
| category_id | mediumint(9)  | YES  |     | NULL    |                |
| user_id     | mediumint(9)  | YES  |     | NULL    |                |
+-------------+---------------+------+-----+---------+----------------+

mysql> describe category;
+-------+--------------+------+-----+---------+----------------+
| Field | Type         | Null | Key | Default | Extra          |
+-------+--------------+------+-----+---------+----------------+
| id    | mediumint(9) | NO   | PRI | NULL    | auto_increment |
| name  | char(30)     | NO   |     | NULL    |                |
+-------+--------------+------+-----+---------+----------------+

mysql> describe spending;
+---------------+---------------+------+-----+---------+----------------+
| Field         | Type          | Null | Key | Default | Extra          |
+---------------+---------------+------+-----+---------+----------------+
| id            | mediumint(9)  | NO   | PRI | NULL    | auto_increment |
| category_id   | int(11)       | YES  |     | NULL    |                |
| amount        | decimal(13,4) | YES  |     | NULL    |                |
| description   | varchar(255)  | YES  |     | NULL    |                |
| purchase_date | date          | YES  |     | NULL    |                |
| user_id       | mediumint(9)  | YES  |     | NULL    |                |
+---------------+---------------+------+-----+---------+----------------+

mysql> describe users;
+-----------+--------------+------+-----+---------+----------------+
| Field     | Type         | Null | Key | Default | Extra          |
+-----------+--------------+------+-----+---------+----------------+
| id        | int(11)      | NO   | PRI | NULL    | auto_increment |
| firstName | varchar(100) | NO   |     | NULL    |                |
| lastName  | varchar(40)  | NO   |     | NULL    |                |
| username  | varchar(40)  | NO   |     | NULL    |                |
| email     | varchar(40)  | NO   |     | NULL    |                |
| password  | varchar(200) | YES  |     | NULL    |                |
+-----------+--------------+------+-----+---------+----------------+
