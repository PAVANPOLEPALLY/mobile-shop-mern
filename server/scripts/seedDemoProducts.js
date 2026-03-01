import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Product from "../models/Product.js";

dotenv.config();

const demoProducts = [
  {
    name: "OnePlus Nord CE4 Lite 5G (8GB, 256GB)",
    category: "mobile",
    brand: "OnePlus",
    price: 21999,
    discount: 12,
    emiAvailable: true,
    description: "Amazon-style demo listing for client walkthrough.",
    specifications: [
      "RAM: 8GB",
      "Storage: 256GB",
      "Display: 6.67 inch AMOLED 120Hz",
      "Battery: 5500mAh",
      "Source: Amazon India demo"
    ],
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"],
    stock: 18,
    isFeatured: true,
    featuredOrder: 1
  },
  {
    name: "Samsung Galaxy M35 5G (8GB, 128GB)",
    category: "mobile",
    brand: "Samsung",
    price: 19999,
    discount: 13,
    emiAvailable: true,
    description: "Amazon-style demo listing for client walkthrough.",
    specifications: [
      "RAM: 8GB",
      "Storage: 128GB",
      "Display: 6.6 inch Super AMOLED 120Hz",
      "Battery: 6000mAh",
      "Source: Amazon India demo"
    ],
    images: ["https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=900&q=80"],
    stock: 11,
    isFeatured: true,
    featuredOrder: 2
  },
  {
    name: "iQOO Z9s 5G (8GB, 256GB)",
    category: "mobile",
    brand: "iQOO",
    price: 20999,
    discount: 13,
    emiAvailable: true,
    description: "Amazon-style demo listing for client walkthrough.",
    specifications: [
      "RAM: 8GB",
      "Storage: 256GB",
      "Display: 6.77 inch AMOLED 120Hz",
      "Battery: 5500mAh",
      "Source: Amazon India demo"
    ],
    images: ["https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=900&q=80"],
    stock: 9,
    isFeatured: true,
    featuredOrder: 3
  },
  {
    name: "Redmi Note 13 5G (8GB, 256GB)",
    category: "mobile",
    brand: "Redmi",
    price: 18499,
    discount: 12,
    emiAvailable: false,
    description: "Amazon-style demo listing for client walkthrough.",
    specifications: [
      "RAM: 8GB",
      "Storage: 256GB",
      "Display: 6.67 inch AMOLED 120Hz",
      "Battery: 5000mAh",
      "Source: Amazon India demo"
    ],
    images: ["https://images.unsplash.com/photo-1567581935884-3349723552ca?auto=format&fit=crop&w=900&q=80"],
    stock: 15,
    isFeatured: false,
    featuredOrder: 0
  },
  {
    name: "Apple iPhone 15 (128GB)",
    category: "mobile",
    brand: "Apple",
    price: 69900,
    discount: 13,
    emiAvailable: true,
    description: "Amazon-style demo listing for client walkthrough.",
    specifications: [
      "Storage: 128GB",
      "Display: 6.1 inch Super Retina XDR",
      "Chip: A16 Bionic",
      "Camera: 48MP main",
      "Source: Amazon India demo"
    ],
    images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80"],
    stock: 6,
    isFeatured: true,
    featuredOrder: 4
  },
  {
    name: "realme Narzo 70 Pro 5G (8GB, 128GB)",
    category: "mobile",
    brand: "realme",
    price: 18999,
    discount: 14,
    emiAvailable: true,
    description: "Amazon-style demo listing for client walkthrough.",
    specifications: [
      "RAM: 8GB",
      "Storage: 128GB",
      "Display: 6.67 inch AMOLED 120Hz",
      "Battery: 5000mAh",
      "Source: Amazon India demo"
    ],
    images: ["https://images.unsplash.com/photo-1510557880182-3f8f4be59f65?auto=format&fit=crop&w=900&q=80"],
    stock: 12,
    isFeatured: false,
    featuredOrder: 0
  },
  {
    name: "boAt Airdopes 141 TWS Earbuds",
    category: "accessory",
    brand: "boAt",
    price: 1299,
    discount: 71,
    emiAvailable: false,
    description: "Amazon-style demo accessory for client walkthrough.",
    specifications: [
      "Type: TWS earbuds",
      "Playback: Up to 42 hours",
      "Bluetooth: 5.1",
      "Water Resistance: IPX4",
      "Source: Amazon India demo"
    ],
    images: ["https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=900&q=80"],
    stock: 35,
    isFeatured: false,
    featuredOrder: 0
  },
  {
    name: "Ambrane 20000mAh Fast Charging Power Bank",
    category: "accessory",
    brand: "Ambrane",
    price: 1699,
    discount: 51,
    emiAvailable: false,
    description: "Amazon-style demo accessory for client walkthrough.",
    specifications: [
      "Type: Power bank",
      "Capacity: 20000mAh",
      "Output: 22.5W",
      "Ports: USB-A + USB-C",
      "Source: Amazon India demo"
    ],
    images: ["https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80"],
    stock: 26,
    isFeatured: false,
    featuredOrder: 0
  },
  {
    name: "SanDisk Ultra 128GB microSDXC UHS-I Card",
    category: "accessory",
    brand: "SanDisk",
    price: 899,
    discount: 50,
    emiAvailable: false,
    description: "Amazon-style demo accessory for client walkthrough.",
    specifications: [
      "Type: Memory card",
      "Capacity: 128GB",
      "Read Speed: Up to 140MB/s",
      "Class: UHS-I U1",
      "Source: Amazon India demo"
    ],
    images: ["https://images.unsplash.com/photo-1587033411391-5d9e51cce126?auto=format&fit=crop&w=900&q=80"],
    stock: 40,
    isFeatured: false,
    featuredOrder: 0
  },
  {
    name: "Spigen Rugged Armor Case for iPhone 15",
    category: "accessory",
    brand: "Spigen",
    price: 1499,
    discount: 32,
    emiAvailable: false,
    description: "Amazon-style demo accessory for client walkthrough.",
    specifications: [
      "Type: Phone case",
      "Material: TPU",
      "Compatibility: iPhone 15",
      "Feature: Air Cushion technology",
      "Source: Amazon India demo"
    ],
    images: ["https://images.unsplash.com/photo-1601593346740-925612772716?auto=format&fit=crop&w=900&q=80"],
    stock: 19,
    isFeatured: false,
    featuredOrder: 0
  }
];

const seedDemoProducts = async () => {
  try {
    await connectDB();

    const operations = demoProducts.map((product) => ({
      updateOne: {
        filter: { name: product.name, brand: product.brand },
        update: { $setOnInsert: product },
        upsert: true
      }
    }));

    const result = await Product.bulkWrite(operations, { ordered: false });
    const inserted = result.upsertedCount || 0;

    console.log(`Demo products seed complete. Inserted: ${inserted}, Skipped(existing): ${demoProducts.length - inserted}`);
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

seedDemoProducts();
