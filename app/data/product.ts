// ============================================================
// TYPE / INTERFACE
// ============================================================

// Interface digunakan untuk menentukan "bentuk" sebuah Product.
//
// Jadi setiap product HARUS punya:
// id       -> number
// name     -> string
// category -> string
// price    -> number
// image    -> string
// rating   -> number
// reviews  -> number
//
// oldPrice dan badge menggunakan ?
// artinya property tersebut OPTIONAL / boleh tidak ada.

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
}


// ============================================================
// ARRAY
// ============================================================

// Ini adalah ARRAY.
//
// Array = kumpulan data.
//
// Di sini kita mempunyai kumpulan Product.
//
// Karena kita menulis:
// Product[]
//
// artinya:
// "products adalah array yang isinya Product"

export const products: Product[] = [

  // ==========================================================
  // OBJECT
  // ==========================================================

  // Object pertama.
  //
  // Object = data yang mempunyai property/key dan value.
  //
  // Contoh:
  //
  // name: "Nike Air Max 1"
  //
  // "name" adalah property/key
  // "Nike Air Max 1" adalah value

  {
    id: 1,
    name: "Nike Air Max 1",
    category: "Sneakers",
    price: 129,
    oldPrice: 160,
    rating: 4.8,
    reviews: 342,
    image:
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop",
    badge: "-20%",
  },


  // OBJECT kedua

  {
    id: 2,
    name: "Essential Hoodie",
    category: "Apparel",
    price: 59,
    rating: 4.7,
    reviews: 218,
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    badge: "New",
  },


  // OBJECT ketiga

  {
    id: 3,
    name: "Orbit Backpack",
    category: "Bags",
    price: 42,
    oldPrice: 60,
    rating: 4.6,
    reviews: 176,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    badge: "-30%",
  },


  // OBJECT keempat

  {
    id: 4,
    name: "Sony WH-CH520",
    category: "Electronics",
    price: 79,
    rating: 4.9,
    reviews: 421,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    badge: "Hot",
  },


  // OBJECT kelima

  {
    id: 5,
    name: "Nexus Gaming Controller",
    category: "Gaming",
    price: 69,
    oldPrice: 89,
    rating: 4.8,
    reviews: 143,
    image:
      "https://images.unsplash.com/photo-1600080972464-8e5ae330bbf8?q=80&w=800&auto=format&fit=crop",
    badge: "-22%",
  },


  // OBJECT keenam

  {
    id: 6,
    name: "Classic Watch",
    category: "Accessories",
    price: 99,
    rating: 4.5,
    reviews: 87,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=800&auto=format&fit=crop",
    badge: "New",
  },

];