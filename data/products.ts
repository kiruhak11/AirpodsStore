export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "AirPods Pro",
    price: 24900,
    image:
      "https://avatars.mds.yandex.net/i?id=63adcfdc6dbe41b3fa84015f77b05957_l-9870356-images-thumbs&n=13",
    description: "Оцените лучшее качество звука с AirPods Pro.",
  },
  {
    id: 2,
    name: "AirPods Max",
    price: 54900,
    image:
      "https://basket-14.wbbasket.ru/vol2122/part212264/212264341/images/big/1.jpg",
    description: "Погрузитесь в атмосферу высокоточного звука с AirPods Max.",
  },
  {
    id: 3,
    name: "AirPods (3rd Generation)",
    price: 17900,
    image:
      "https://avatars.mds.yandex.net/i?id=56d7a1d323d733207305e7917a3ba2f1_l-9181123-images-thumbs&n=13",
    description:
      "Наслаждайтесь новейшими технологиями с AirPods (3-е поколение).",
  },
  {
    id: 4,
    name: "iPhone 13",
    price: 79900,
    image:
      "https://avatars.mds.yandex.net/i?id=95874c939944d81478eeaf73d3314579087e69c1-5318713-images-thumbs&n=13",
    description:
      "Последняя модель iPhone с улучшенной камерой и производительностью.",
  },
  {
    id: 5,
    name: "MacBook Pro",
    price: 129900,
    image:
      "https://avatars.mds.yandex.net/i?id=a128f3b62f06e697c9ad70429f50fcb9855be139-5276366-images-thumbs&n=13",
    description: "Мощный ноутбук для профессионалов.",
  },
  {
    id: 6,
    name: "Apple Watch Series 7",
    price: 39900,
    image:
      "https://avatars.mds.yandex.net/i?id=be2f810b7fb9c86b6e73f55415f144578c76af49-4079813-images-thumbs&n=13",
    description:
      "Следите за своим здоровьем и активностью с Apple Watch Series 7.",
  },
  {
    id: 7,
    name: "iPad Pro",
    price: 99900,
    image:
      "https://avatars.mds.yandex.net/i?id=0e51312c2554ab25f850b1030a402a72c8d387be2d154f03-12475401-images-thumbs&n=13",
    description: "Мощный планшет для работы и творчества.",
  },
  {
    id: 8,
    name: "Samsung Galaxy S21",
    price: 79900,
    image:
      "https://avatars.mds.yandex.net/i?id=f9cd4adf3cc04d325c44d381826d3f1cf69bfe00-9065868-images-thumbs&n=13",
    description: "Флагманский смартфон от Samsung с отличной камерой.",
  },
  {
    id: 9,
    name: "Sony WH-1000XM4",
    price: 34900,
    image:
      "https://avatars.mds.yandex.net/i?id=0d32142953a2d5d2b4c028a676ed4de89c13d72d-8246369-images-thumbs&n=13",
    description: "Лучшие беспроводные наушники с шумоподавлением.",
  },
  {
    id: 10,
    name: "Google Pixel 6",
    price: 69900,
    image:
      "https://avatars.mds.yandex.net/i?id=3943f17b91e5e27b9b1c27d329ced8a90a600ea6-12988028-images-thumbs&n=13",
    description: "Смартфон от Google с чистым Android и отличной камерой.",
  },
  {
    id: 11,
    name: "Dell XPS 13",
    price: 99900,
    image:
      "https://avatars.mds.yandex.net/i?id=c649993e4f52c1b0bbdd304232b834fc7f986c81-8193216-images-thumbs&n=13",
    description: "Компактный и мощный ноутбук для работы и развлечений.",
  },
  {
    id: 12,
    name: "HP Spectre x360",
    price: 119900,
    image:
      "https://avatars.mds.yandex.net/i?id=435e2edd062c8c095aab7e1c3b263125c28ac1cc00706352-12522553-images-thumbs&n=13",
    description: "Универсальный ноутбук-трансформер с отличным экраном.",
  },
  {
    id: 13,
    name: "Microsoft Surface Pro 7",
    price: 89900,
    image:
      "https://avatars.mds.yandex.net/i?id=e281c8f6c90a17d7f2d249e04443b1aed249972a-6390812-images-thumbs&n=13",
    description: "Планшет и ноутбук в одном устройстве от Microsoft.",
  },
  {
    id: 14,
    name: "Amazon Echo Dot",
    price: 4900,
    image:
      "https://avatars.mds.yandex.net/i?id=08712236c08b0c2dc964eef97d6fca4497b8d2d0-4012386-images-thumbs&n=13",
    description: "Умная колонка с голосовым помощником Alexa.",
  },
  {
    id: 15,
    name: "Google Nest Hub",
    price: 9900,
    image:
      "https://avatars.mds.yandex.net/i?id=2e2208895dab69ab2e45ca4a71a89f1e-6311157-images-thumbs&n=13",
    description: "Умный дисплей для управления умным домом и развлечений.",
  },
  {
    id: 16,
    name: "Fitbit Charge 5",
    price: 14900,
    image:
      "https://avatars.mds.yandex.net/i?id=a3362f79226b58ef01db60f17ca4569a622c2f33-10263675-images-thumbs&n=13",
    description: "Фитнес-трекер для отслеживания активности и здоровья.",
  },
  {
    id: 17,
    name: "JBL Flip 5",
    price: 11900,
    image:
      "https://avatars.mds.yandex.net/i?id=1034ff7d70c45d0b1541384963e1e886c5a6f959-12486332-images-thumbs&n=13",
    description: "Портативная колонка с мощным звуком и водозащитой.",
  },
  {
    id: 18,
    name: "Nintendo Switch",
    price: 29900,
    image:
      "https://avatars.mds.yandex.net/i?id=591c93dd5f7bbe316aad55c0646035048e9e6c3a-5363169-images-thumbs&n=13",
    description: "Популярная игровая консоль для дома и в пути.",
  },
  {
    id: 19,
    name: "PlayStation 5",
    price: 49900,
    image:
      "https://avatars.mds.yandex.net/i?id=c0e7725d1aab1d568a757c3cffce0116fac3e688-4828150-images-thumbs&n=13",
    description: "Новая игровая консоль от Sony с поддержкой 4K.",
  },
  {
    id: 20,
    name: "Xbox Series X",
    price: 49900,
    image:
      "https://avatars.mds.yandex.net/i?id=896b12c6d215fe5aa8d8956d0ef877b0751a6504-5173468-images-thumbs&n=13",
    description: "Мощная игровая консоль от Microsoft с поддержкой 4K.",
  },
  {
    id: 21,
    name: "Canon EOS R5",
    price: 389900,
    image:
      "https://avatars.mds.yandex.net/i?id=739c0a00cd81319f1cd376f2c454a6cf8d3ac5f1-9264516-images-thumbs&n=13",
    description: "Профессиональная беззеркальная камера с высоким разрешением.",
  },
  {
    id: 22,
    name: "Nikon Z6 II",
    price: 199900,
    image:
      "https://avatars.mds.yandex.net/i?id=fbbbc1139cd4de6102c2bb842260a998ee1bbbc2-5087168-images-thumbs&n=13",
    description: "Беззеркальная камера с отличной производительностью.",
  },
  {
    id: 23,
    name: "DJI Mavic Air 2",
    price: 79900,
    image:
      "https://avatars.mds.yandex.net/i?id=fbb368cedb1a2a7711ea6bef74714838e8d9dac9-12690968-images-thumbs&n=13",
    description: "Компактный дрон с отличной камерой и функциями.",
  },
  {
    id: 24,
    name: "GoPro HERO9 Black",
    price: 39900,
    image:
      "https://avatars.mds.yandex.net/i?id=1dd244bff5a1d258802c2088208bd82b1dbdea623ff43f5d-12569904-images-thumbs&n=13",
    description: "Экшн-камера с поддержкой 5K видео и стабилизацией.",
  },
  {
    id: 25,
    name: "Razer Blade 15",
    price: 169900,
    image:
      "https://avatars.mds.yandex.net/i?id=f9728442dad95719d5c81f0a9b2279f83ff7fdea-9211281-images-thumbs&n=13",
    description: "Игровой ноутбук с мощной графикой и производительностью.",
  },
  {
    id: 26,
    name: "Asus ROG Zephyrus G14",
    price: 144900,
    image:
      "https://avatars.mds.yandex.net/i?id=cf033696372959dee258b788c74b789a7b966f3f-12932370-images-thumbs&n=13",
    description: "Компактный игровой ноутбук с отличной производительностью.",
  },
  {
    id: 27,
    name: "Logitech MX Master 3",
    price: 9900,
    image:
      "https://avatars.mds.yandex.net/i?id=626d25a49f99adb61d9905207307077df50e5887-2771387-images-thumbs&n=13",
    description:
      "Эргономичная мышь с множеством функций для продуктивной работы.",
  },
  {
    id: 28,
    name: "Apple Magic Keyboard",
    price: 9900,
    image:
      "https://avatars.mds.yandex.net/i?id=9e1c216a8a102b6f2199b47cc20bec3fa56b6ff7-10698550-images-thumbs&n=13",
    description: "Беспроводная клавиатура с удобным набором текста.",
  },
  {
    id: 29,
    name: "Samsung Galaxy Tab S7",
    price: 64900,
    image:
      "https://avatars.mds.yandex.net/i?id=37830e6d3133c11894c1661fca11ee77c388652d-7552730-images-thumbs&n=13",
    description: "Мощный планшет с отличным экраном и производительностью.",
  },
  {
    id: 30,
    name: "Sony PlayStation VR",
    price: 29900,
    image:
      "https://avatars.mds.yandex.net/i?id=39cc1119d51e1f85c8c00c176b49aebb57c75b09-7571104-images-thumbs&n=13",
    description:
      "Виртуальная реальность для PlayStation с захватывающими играми.",
  },
];
