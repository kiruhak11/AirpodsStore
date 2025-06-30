-- Очистка существующих данных
DELETE FROM OrderItem;
DELETE FROM `Order`;
DELETE FROM Product;
DELETE FROM Category;
DELETE FROM User;

-- Сброс автоинкремента
ALTER TABLE OrderItem AUTO_INCREMENT = 1;
ALTER TABLE `Order` AUTO_INCREMENT = 1;
ALTER TABLE Product AUTO_INCREMENT = 1;
ALTER TABLE Category AUTO_INCREMENT = 1;
ALTER TABLE User AUTO_INCREMENT = 1;

-- Вставка категорий
INSERT INTO Category (name, description, image) VALUES
('AirPods Pro', 'Премиум наушники с активным шумоподавлением', '/images/categories/airpods-pro.jpg'),
('AirPods', 'Классические беспроводные наушники', '/images/categories/airpods.jpg'),
('AirPods Max', 'Накладные наушники премиум класса', '/images/categories/airpods-max.jpg'),
('Аксессуары', 'Чехлы, зарядные устройства и другие аксессуары', '/images/categories/accessories.jpg');

-- Вставка пользователей
INSERT INTO User (email, passwordHash, fullName, phone, role) VALUES
('admin@airpodsstore.com', '$2b$10$hashedpassword123', 'Администратор', '+7 (999) 123-45-67', 'admin'),
('user1@example.com', '$2b$10$hashedpassword123', 'Иван Петров', '+7 (999) 111-11-11', 'customer'),
('user2@example.com', '$2b$10$hashedpassword123', 'Мария Сидорова', '+7 (999) 222-22-22', 'customer'),
('user3@example.com', '$2b$10$hashedpassword123', 'Алексей Козлов', '+7 (999) 333-33-33', 'customer');

-- Вставка продуктов
INSERT INTO Product (name, description, price, image, additionalImages, categoryId, color, model, inStock, specs) VALUES
('AirPods Pro 2nd Generation', 'Новейшие AirPods Pro с улучшенным шумоподавлением и пространственным звуком', 24990.00, '/images/products/airpods-pro-2.jpg', '["/images/products/airpods-pro-2-1.jpg", "/images/products/airpods-pro-2-2.jpg", "/images/products/airpods-pro-2-3.jpg"]', 1, 'Белый', 'A2931', 1, '{"battery": "6 часов воспроизведения", "connectivity": "Bluetooth 5.0", "features": ["Активное шумоподавление", "Прозрачный режим", "Пространственный звук"]}'),
('AirPods Pro 2nd Generation', 'Новейшие AirPods Pro с улучшенным шумоподавлением и пространственным звуком', 24990.00, '/images/products/airpods-pro-2-black.jpg', '["/images/products/airpods-pro-2-black-1.jpg", "/images/products/airpods-pro-2-black-2.jpg"]', 1, 'Черный', 'A2931', 1, '{"battery": "6 часов воспроизведения", "connectivity": "Bluetooth 5.0", "features": ["Активное шумоподавление", "Прозрачный режим", "Пространственный звук"]}'),
('AirPods 3rd Generation', 'Беспроводные наушники с улучшенным звуком и защитой от воды', 18990.00, '/images/products/airpods-3.jpg', '["/images/products/airpods-3-1.jpg", "/images/products/airpods-3-2.jpg"]', 2, 'Белый', 'A2565', 1, '{"battery": "6 часов воспроизведения", "connectivity": "Bluetooth 5.0", "features": ["Пространственный звук", "Защита от воды IPX4"]}'),
('AirPods 2nd Generation', 'Классические AirPods с чипом H1', 15990.00, '/images/products/airpods-2.jpg', '["/images/products/airpods-2-1.jpg"]', 2, 'Белый', 'A2031', 1, '{"battery": "5 часов воспроизведения", "connectivity": "Bluetooth 5.0", "features": ["Чип H1", "Голосовое управление Siri"]}'),
('AirPods Max', 'Накладные наушники премиум класса с активным шумоподавлением', 59990.00, '/images/products/airpods-max.jpg', '["/images/products/airpods-max-1.jpg", "/images/products/airpods-max-2.jpg", "/images/products/airpods-max-3.jpg"]', 3, 'Серебристый', 'A2096', 1, '{"battery": "20 часов воспроизведения", "connectivity": "Bluetooth 5.0", "features": ["Активное шумоподавление", "Прозрачный режим", "Пространственный звук", "Адаптивный эквалайзер"]}'),
('AirPods Max', 'Накладные наушники премиум класса с активным шумоподавлением', 59990.00, '/images/products/airpods-max-space-gray.jpg', '["/images/products/airpods-max-space-gray-1.jpg", "/images/products/airpods-max-space-gray-2.jpg"]', 3, 'Темно-серый', 'A2096', 0, '{"battery": "20 часов воспроизведения", "connectivity": "Bluetooth 5.0", "features": ["Активное шумоподавление", "Прозрачный режим", "Пространственный звук", "Адаптивный эквалайзер"]}'),
('AirPods Max', 'Накладные наушники премиум класса с активным шумоподавлением', 59990.00, '/images/products/airpods-max-blue.jpg', '["/images/products/airpods-max-blue-1.jpg"]', 3, 'Синий', 'A2096', 1, '{"battery": "20 часов воспроизведения", "connectivity": "Bluetooth 5.0", "features": ["Активное шумоподавление", "Прозрачный режим", "Пространственный звук", "Адаптивный эквалайзер"]}'),
('Чехол для AirPods Pro', 'Силиконовый чехол с защитой от ударов', 2990.00, '/images/products/airpods-pro-case.jpg', '["/images/products/airpods-pro-case-1.jpg"]', 4, 'Черный', 'Case-Pro', 1, '{"material": "Силикон", "protection": "Защита от ударов", "compatibility": "AirPods Pro"}'),
('Беспроводное зарядное устройство', 'Магнитное зарядное устройство MagSafe', 3990.00, '/images/products/magsafe-charger.jpg', '["/images/products/magsafe-charger-1.jpg"]', 4, 'Белый', 'MagSafe', 1, '{"power": "15W", "compatibility": "iPhone 12 и новее", "features": ["Магнитное крепление", "Быстрая зарядка"]}'),
('AirPods 2nd Generation', 'Классические AirPods с чипом H1', 15990.00, '/images/products/airpods-2-black.jpg', '["/images/products/airpods-2-black-1.jpg"]', 2, 'Черный', 'A2031', 1, '{"battery": "5 часов воспроизведения", "connectivity": "Bluetooth 5.0", "features": ["Чип H1", "Голосовое управление Siri"]}');

-- Вставка заказов
INSERT INTO `Order` (userId, totalAmount, status, deliveryAddress) VALUES
(2, 24990.00, 'completed', 'г. Москва, ул. Тверская, д. 1, кв. 10'),
(2, 18990.00, 'pending', 'г. Москва, ул. Тверская, д. 1, кв. 10'),
(3, 59990.00, 'shipped', 'г. Санкт-Петербург, Невский пр., д. 50, кв. 25'),
(4, 44980.00, 'completed', 'г. Екатеринбург, ул. Ленина, д. 15, кв. 7');

-- Вставка элементов заказов
INSERT INTO OrderItem (orderId, productId, quantity, price) VALUES
(1, 1, 1, 24990.00),
(2, 3, 1, 18990.00),
(3, 5, 1, 59990.00),
(4, 1, 1, 24990.00),
(4, 8, 1, 2990.00),
(4, 9, 1, 3990.00),
(4, 10, 1, 13010.00); 