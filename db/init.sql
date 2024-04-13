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
    ('666', 'dev', 'dev@gmail.com', 'hash');

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
    ('test1', 'test desc', 'test image', 'test category', '123', '666'),
    ('test2', 'test desc', 'test image', 'test category', '123', '666');