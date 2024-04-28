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
    ('Football', 'Upgrade your game with this reliable used football! Perfect for casual play or practice, this ball offers durability and a traditional feel. Grab this deal today and hit the field with confidence', 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Football_Pallo_valmiina-cropped.jpg', 'Sports', '25', '2bfd3e62-6fd4-48bf-be7e-f694f880b10e'),
    ('FC Barcelona 10/11 shirt', 'Really nice shirt for collectors. The shirt has been kept in good condition and it has never been worn', 'https://thefootballheritage.com/wp-content/uploads/2023/10/cf304ccd.jpg', 'Sports', '120', '6eb7a265-d3c1-4780-88cd-54ea3bc7ab59'),
    ('Sofa', 'Just a basic sofa, dont need it anymore because I got a new one', 'https://live.staticflickr.com/4082/4822322673_c6edb296f2_b.jpg', 'Furniture', '50', '2bfd3e62-6fd4-48bf-be7e-f694f880b10e'),
    ('PC', 'Very nice PC, the lights on it will improve your gaming ability x1000', 'https://www.trustedreviews.com/wp-content/uploads/sites/54/2023/01/AlphaSync-PBA-Diamond-Gaming-Desktop-PC-16.jpg', 'Electronics', '824', '2bfd3e62-6fd4-48bf-be7e-f694f880b10e'),
    ('Shoes', 'Really fancy shoes, not used', 'https://live.staticflickr.com/65535/51200638532_52a17c552a_b.jpg', 'Clothes', '65', '2bfd3e62-6fd4-48bf-be7e-f694f880b10e'),
    ('iPhone 14', 'Really good price, not a scam', 'https://www.gigantti.fi/image/dv_web_D1800010021129765/522643/iphone-14-5g-alypuhelin-128-gb-violetti--pdp_zoom-3000--pdp_main-540.jpg', 'Electronics', '10', '2bfd3e62-6fd4-48bf-be7e-f694f880b10e'),
    ('jopo', 'Definitely wasnt stolen, this is my own bike. Ignore the high quality image from the internet, couldnt get a picture of the actual bike', 'https://cdn.s-cloud.fi/v1/w1920_q80/assets/dam-id/E_lYZc1i4hO9UdGgKN-y-l.webp', 'Sports', '150', '2bfd3e62-6fd4-48bf-be7e-f694f880b10e'),
    ('Google Pixel 8 pro - phone', 'This phone was really bad, dont buy it', 'https://www.trustedreviews.com/wp-content/uploads/sites/54/2023/10/X1007230-scaled.jpeg', 'Electronics', '450', '2bfd3e62-6fd4-48bf-be7e-f694f880b10e');


