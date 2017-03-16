DELETE FROM spending;
DELETE FROM budget;
INSERT INTO spending (category_id, amount, purchase_date,description, user_id) VALUES (10 , 1400, '2017-03-02','desc A', 25),(11 , 140, '2017-01-05','desc A', 25);
INSERT INTO spending (category_id, amount, purchase_date,description, user_id) VALUES (11 , 1050, '2017-03-01','desc A', 25),(12 , 130, '2017-03-05','desc A', 25);
INSERT INTO spending (category_id, amount, purchase_date,description, user_id) VALUES (12 , 120, '2017-03-12','desc A', 25),(13, 105, '2017-03-05','desc A', 25);
INSERT INTO spending (category_id, amount, purchase_date,description, user_id) VALUES (13 , 140, '2017-02-22','desc A', 25),(14 , 1000, '2017-03-05','desc A', 25);
INSERT INTO spending (category_id, amount, purchase_date,description, user_id) VALUES (14 , 150, '2017-02-12','desc A', 25),(15 , 130, '2017-03-05','desc A', 25);
INSERT INTO spending (category_id, amount, purchase_date,description, user_id) VALUES (15 , 160, '2017-03-02','desc A', 25),(16 , 120, '2017-02-05','desc A', 25);
INSERT INTO spending (category_id, amount, purchase_date,description, user_id) VALUES (16 , 170, '2017-01-02','desc A', 25),(17 ,220, '2017-03-05','desc A', 25);
INSERT INTO spending (category_id, amount, purchase_date,description, user_id) VALUES (17 , 100, '2017-01-02','desc A', 25),(18 , 1400, '2017-03-05','desc A', 25);
INSERT INTO spending (category_id, amount, purchase_date,description, user_id) VALUES (18 , 160, '2017-03-02','desc A', 25),(12 , 150, '2017-03-05','desc A', 25);
INSERT INTO spending (category_id, amount, purchase_date,description, user_id) VALUES (10 , 160, '2017-03-02','desc A', 25),(13 , 160, '2017-03-05','desc A', 25);
INSERT INTO spending (category_id, amount, purchase_date,description, user_id) VALUES (11 , 160, '2017-03-02','desc A', 25),(14 , 180, '2017-03-13','desc A', 25);
INSERT INTO spending (category_id, amount, purchase_date,description, user_id) VALUES (12 , 160, '2017-03-02','desc A', 25),(15 , 330, '2017-03-04','desc A', 25);
INSERT INTO spending (category_id, amount, purchase_date,description, user_id) VALUES (13 , 160, '2017-03-02','desc A', 25),(16 , 140, '2017-01-01','desc A', 25);
INSERT INTO spending (category_id, amount, purchase_date,description, user_id) VALUES (14 , 160, '2017-03-02','desc A', 25),(17 , 150, '2017-02-05','desc A', 25);
INSERT INTO spending (category_id, amount, purchase_date,description, user_id) VALUES (15 , 160, '2017-03-02','desc A', 25),(18 , 140, '2017-01-05','desc A', 25);
INSERT INTO spending (category_id, amount, purchase_date,description, user_id) VALUES (16 , 100, '2017-03-02','desc A', 25),(12 , 130, '2017-02-05','desc A', 25);
INSERT INTO spending (category_id, amount, purchase_date,description, user_id) VALUES (17 , 1020, '2017-03-02','desc A', 25),(13 , 100, '2017-03-05','desc A', 25);
INSERT INTO spending (category_id, amount, purchase_date,description, user_id) VALUES (18 , 102, '2017-02-02','desc A', 25),(14 , 100, '2017-03-05','desc A', 25);
INSERT INTO budget (amount, category_id, user_id) VALUES (100 , 10, 25);
INSERT INTO budget (amount, category_id, user_id) VALUES (200 , 11, 25);
INSERT INTO budget (amount, category_id, user_id) VALUES (300 , 12, 25);
INSERT INTO budget (amount, category_id, user_id) VALUES (400 , 13, 25);
INSERT INTO budget (amount, category_id, user_id) VALUES (500 , 14, 25);
INSERT INTO budget (amount, category_id, user_id) VALUES (600 , 15, 25);
INSERT INTO budget (amount, category_id, user_id) VALUES (700 , 16, 25);
INSERT INTO budget (amount, category_id, user_id) VALUES (800 , 17, 25);
INSERT INTO budget (amount, category_id, user_id) VALUES (200 , 18, 25);



