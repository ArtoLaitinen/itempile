CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(36) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(60) NOT NULL,
  `password_hash` VARCHAR(60) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY(`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

INSERT INTO users (id, name, email, password_hash) VALUES
    ('2bfd3e62-6fd4-48bf-be7e-f694f880b10e', 'dev1', 'dev@gmail.com', 'hash'),
    ('6eb7a265-d3c1-4780-88cd-54ea3bc7ab59', 'dev2', 'dev@gmail.com', 'hash');

CREATE TABLE IF NOT EXISTS `items` (
  `id` int(15) NOT NULL AUTO_INCREMENT,
  `title` varchar(60) NOT NULL,
  `description` varchar(300) NOT NULL,
  `image` varchar(200) NOT NULL,
  `category` varchar(60) NOT NULL,
  `price` varchar(60) NOT NULL,
  `owner_id` varchar(36) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`)
) ENGINE = InnoDB DEFAULT CHARSET = latin1;

INSERT INTO items (title, description, image, category, price, owner_id) VALUES
    ('test1', 'test desc', 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Football_Pallo_valmiina-cropped.jpg', 'test category', '123', '2bfd3e62-6fd4-48bf-be7e-f694f880b10e'),
    ('test2', 'test desc', 'https://thefootballheritage.com/wp-content/uploads/2023/10/cf304ccd.jpg', 'test category', '123', '6eb7a265-d3c1-4780-88cd-54ea3bc7ab59'),
    ('Sofa', 'test desc', 'https://live.staticflickr.com/4082/4822322673_c6edb296f2_b.jpg', 'test category', '123', '2bfd3e62-6fd4-48bf-be7e-f694f880b10e'),
    ('PC', 'test desc', 'https://www.trustedreviews.com/wp-content/uploads/sites/54/2023/01/AlphaSync-PBA-Diamond-Gaming-Desktop-PC-16.jpg', 'test category', '123', '2bfd3e62-6fd4-48bf-be7e-f694f880b10e'),
    ('Shoes', 'test desc', 'https://live.staticflickr.com/65535/51200638532_52a17c552a_b.jpg', 'test category', '123', '2bfd3e62-6fd4-48bf-be7e-f694f880b10e'),
    ('Wii', 'test desc', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPwxcvRCOhT0nWcotqId9HswY5sZVDKVT7oeygwUrehQ&s', 'test category', '123', '2bfd3e62-6fd4-48bf-be7e-f694f880b10e'),
    ('Google Pixel 8 pro - phone', 'test desc', 'https://www.trustedreviews.com/wp-content/uploads/sites/54/2023/10/X1007230-scaled.jpeg', 'test category', '123', '2bfd3e62-6fd4-48bf-be7e-f694f880b10e');


