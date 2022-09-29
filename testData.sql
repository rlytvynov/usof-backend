USE friendly_community;
/*INSERT INTO users (login, password, fullName, email, role)
VALUES
('rlytvynov', 'roman-password', 'Roman Lytvynov', 'litvinromeo@gmail.com', 'admin'),
('llytvynova', 'mothers-password', 'Larysa Lytvynova', 'litvinova_mdpu@ukr.net', 'admin'),
('nabrosimov', 'abrosimov123', NULL, 'abrosimov@yahoo.com', 'user'),
('vvysotchyn', 'vlad123', NULL, 'vvysotchyn@gmail.com', 'user'),
('bzelenska', '15012014bogdana', 'Bogdana Zelenska', 'funny-bogdana@gmail.com', 'user');*/


INSERT INTO posts (userID, title, publishDate, content)
VALUES
(1, 'GREETINGS', '2022-09-10', 'Hi everyone. This is friendly community, and I am admin - Roman Lytvynov)'),
(2, 'GREETINGS', '2022-09-10', 'Hi everyone. This is friendly community, and I am admin - Larysa Lytvynova)'),
(3, 'Q for admin', '2022-09-12', 'What is the main idea of this community?'),
(3, 'Q for admin', '2022-09-12', 'Also, where admin lives?'),
(5, 'Q for ROMAAA', '2022-09-15', 'Play with me please))');

INSERT INTO comments (userID, postID, publishDate, content)
VALUES
(2, 3, '2022-09-12', 'Purpose is to ask some questions you have to other users of the community)'),
(4, 4, '2022-09-13', 'In Melitopol, he is my friend'),
(1, 5, '2022-09-15', 'Have no time, my friend, sorry)');

INSERT INTO likes (userID, postID, commentID, publishDate, type)
VALUES
(1, 2, NULL, '2022-09-10', 'like'),
(2, 1, NULL, '2022-09-10', 'like'),
(1, 5, NULL, '2022-09-15', 'dislike'),
(3, 1, NULL, '2022-09-11', 'like'),
(3, 2, NULL, '2022-09-11', 'like'),
(4, 1, NULL, '2022-09-11', 'like'),
(4, 2, NULL, '2022-09-11', 'like'),
(5, 1, NULL, '2022-09-11', 'like'),
(5, 2, NULL, '2022-09-11', 'like'),
(3, NULL, 1, '2022-09-12',  'like'),
(5, NULL, 3, '2022-09-15', 'dislike');

INSERT INTO categories (title, description)
VALUES
('ADMIN INFO', 'Here admins are posting actual news about the FriendlyCommunity'),
('COMMUNITY STUCTURE', 'Here users can ask qustions related to FriendlyCommunty organization'),
('GENERAL', 'Talk about different'),
('PLAY TOGETHER', 'Here users can find teamates in any games'),
('WORLD NEWS DISCUSS', 'Here users can alk about world news'),
('COMPUTER / DEVELOP', 'Here users can talk about different computer fields');

INSERT INTO posts_categories (postID, categoryID)
VALUES
(1, 1),
(2, 1),
(3, 2),
(3, 1),
(4, 3),
(5, 4);
