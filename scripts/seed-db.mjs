import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const products = [
        {
            "id": 1,
            "name": "Pupusa de Ayote",
            "type": "pupusa",
            "category": "tradicional",
            "description": "Pupusa de Ayote acompañada de curtido y salsa.",
            "image": "pupusa.webp",
            "variations": [{ "price": 1.5 }]
        },
        {
            "id": 2,
            "name": "Pupusa de Loroco",
            "type": "pupusa",
            "category": "tradicional",
            "description": "Pupusa de Loroco acompañada de curtido y salsa.",
            "image": "pupusa.webp",
            "variations": [{ "price": 1.5 }]
        },
        {
            "id": 3,
            "name": "Pupusa de Mora",
            "type": "pupusa",
            "category": "especial",
            "description": "Pupusa de Mora acompañada de curtido y salsa.",
            "image": "pupusa.webp",
            "variations": [{ "price": 1.5 }]
        },
        {
            "id": 4,
            "name": "Pupusa de Espinaca",
            "type": "pupusa",
            "category": "especial",
            "description": "Pupusa de Espinaca acompañada de curtido y salsa.",
            "image": "pupusa.webp",
            "variations": [{ "price": 1.5 }]
        },
        {
            "id": 5,
            "name": "Pupusa de Jalapeño",
            "type": "pupusa",
            "category": "especial",
            "description": "Pupusa de Jalapeño acompañada de curtido y salsa.",
            "image": "pupusa.webp",
            "variations": [{ "price": 1.75 }]
        },
        {
            "id": 6,
            "name": "Pupusa de Pollo",
            "type": "pupusa",
            "category": "especial",
            "description": "Pupusa de Pollo acompañada de curtido y salsa.",
            "image": "pupusa.webp",
            "variations": [{ "price": 2 }]
        },
        {
            "id": 7,
            "name": "Pupusa de Res",
            "type": "pupusa",
            "category": "especial",
            "description": "Pupusa de Res acompañada de curtido y salsa.",
            "image": "pupusa.webp",
            "variations": [{ "price": 2 }]
        },
        {
            "id": 8,
            "name": "Pupusa de Chorizo",
            "type": "pupusa",
            "category": "especial",
            "description": "Pupusa de Chorizo acompañada de curtido y salsa.",
            "image": "pupusa.webp",
            "variations": [{ "price": 2 }]
        },
        {
            "id": 9,
            "name": "Pupusa de Hongos",
            "type": "pupusa",
            "category": "especial",
            "description": "Pupusa de Hongos acompañada de curtido y salsa.",
            "image": "pupusa.webp",
            "variations": [{ "price": 2 }]
        },
        {
            "id": 10,
            "name": "Pupusa de Camarón",
            "type": "pupusa",
            "category": "especial",
            "description": "Pupusa de Camarón lo mejor del mar.",
            "image": "pupusa.webp",
            "variations": [{ "price": 2 }]
        },
        {
            "id": 11,
            "name": "Pupusa Loca",
            "type": "pupusa",
            "category": "especial",
            "description": "Pupusa Loca una explosion de sabores.",
            "image": "pupusa.webp",
            "variations": [{ "price": 6 }]
        },
        {
            "id": 12,
            "name": "Pupusa Revuelta",
            "type": "pupusa",
            "category": "tradicional",
            "description": "Pupusa Revuelta acompañada de curtido y salsa.",
            "image": "pupusa.webp",
            "variations": [{ "price": 1.5 }]
        },
        {
            "id": 13,
            "name": "Pupusa de Frijol",
            "type": "pupusa",
            "category": "tradicional",
            "description": "Pupusa de Frijol acompañada de curtido y salsa.",
            "image": "pupusa.webp",
            "variations": [{ "price": 1.25 }]
        },
        {
            "id": 14,
            "name": "Pupusa de Queso",
            "type": "pupusa",
            "category": "tradicional",
            "description": "Pupusa de Queso acompañada de curtido y salsa.",
            "image": "pupusa.webp",
            "variations": [{ "price": 1.5 }]
        },
        {
            "id": 15,
            "name": "Pupusa de Frijol con Queso",
            "type": "pupusa",
            "category": "tradicional",
            "description": "Pupusa de Frijol con Queso acompañada de curtido y salsa.",
            "image": "pupusa.webp",
            "variations": [{ "price": 1.25 }]
        },
        {
            "id": 16,
            "name": "Pupusa de Chicharrón",
            "type": "pupusa",
            "category": "tradicional",
            "description": "Pupusa de Chicharrón acompañada de curtido y salsa.",
            "image": "pupusa.webp",
            "variations": [{ "price": 2 }]
        },
        {
            "id": 17,
            "name": "Pupusa de Chicharrón con Queso",
            "type": "pupusa",
            "category": "tradicional",
            "description": "Pupusa de Chicharrón con Queso acompañada de curtido y salsa.",
            "image": "pupusa.webp",
            "variations": [{ "price": 1.5 }]
        },
        {
            "id": 18,
            "name": "Tamales de Elote",
            "type": "tamal",
            "category": "tradicional",
            "description": "Tamales de Elote tradicionales. Se sirven calientes.",
            "image": "tamales-elote.webp",
            "variations": [{ "price": 1.25 }]
        },
        {
            "id": 19,
            "name": "Tamales de Pollo",
            "type": "tamal",
            "category": "tradicional",
            "description": "Tamales de Pollo tradicionales. Se sirven calientes.",
            "image": "tamales-pollo.webp",
            "variations": [{ "price": 1.5 }]
        },
        {
            "id": 20,
            "name": "Tamales Pisques",
            "type": "tamal",
            "category": "tradicional",
            "description": "Tamales Pisques tradicionales. Se sirven calientes.",
            "image": "tamales-pisques.webp",
            "variations": [{ "price": 1.25 }]
        },
        {
            "id": 21,
            "name": "Sandwich de Pollo",
            "type": "sandwich",
            "category": "comida",
            "description": "Sandwich de Pollo preparado al momento.",
            "image": "hero.webp",
            "variations": [{ "price": 2.25 }]
        },
        {
            "id": 22,
            "name": "Sandwich de Jamon",
            "type": "sandwich",
            "category": "comida",
            "description": "Sandwich de Jamon preparado al momento.",
            "image": "hero.webp",
            "variations": [{ "price": 2 }]
        },
        {
            "id": 23,
            "name": "Café",
            "type": "bebida",
            "category": "café",
            "description": "Café caliente servido al gusto con su aroma tradicional.",
            "image": "cafe.webp",
            "variations": [
                { "size": "8oz", "price": 1.5 },
                { "size": "12oz", "price": 1.75 },
                { "size": "16oz", "price": 2 }
            ]
        },
        {
            "id": 26,
            "name": "Chocolate",
            "type": "bebida",
            "category": "café",
            "description": "Delicioso chocolate caliente.",
            "image": "chocolate.webp",
            "variations": [{ "size": "8oz", "price": 1.75 }]
        },
        {
            "id": 27,
            "name": "Leche",
            "type": "bebida",
            "category": "café",
            "description": "Vaso de leche fresca.",
            "image": "leche.webp",
            "variations": [{ "size": "8oz", "price": 1.75 }]
        },
        {
            "id": 28,
            "name": "Coca Cola",
            "type": "bebida",
            "category": "gaseosa",
            "description": "Bebida refrescante en lata.",
            "image": "cocacola.webp",
            "variations": [{ "size": "12oz", "price": 2 }]
        },
        {
            "id": 29,
            "name": "Kolashanpan",
            "type": "bebida",
            "category": "gaseosa",
            "description": "Sabor tradicional de El Salvador.",
            "image": "kolashanpan.webp",
            "variations": [{ "size": "12oz", "price": 2 }]
        },
        {
            "id": 30,
            "name": "Fanta",
            "type": "bebida",
            "category": "gaseosa",
            "description": "Fanta sabor naranja en lata.",
            "image": "fanta.webp",
            "variations": [{ "size": "12oz", "price": 2 }]
        },
        {
            "id": 31,
            "name": "Fresa",
            "type": "bebida",
            "category": "gaseosa",
            "description": "Gaseosa sabor fresa.",
            "image": "fresa.webp",
            "variations": [{ "size": "8oz", "price": 2 }]
        },
        {
            "id": 32,
            "name": "Sprite",
            "type": "bebida",
            "category": "gaseosa",
            "description": "Refresco lima-limón en lata.",
            "image": "sprite.webp",
            "variations": [{ "size": "12oz", "price": 2 }]
        },
        {
            "id": 33,
            "name": "Uva",
            "type": "bebida",
            "category": "gaseosa",
            "description": "Gaseosa sabor uva.",
            "image": "uva.webp",
            "variations": [{ "size": "500ml", "price": 2 }]
        },
        {
            "id": 34,
            "name": "Agua Mineral",
            "type": "bebida",
            "category": "gaseosa",
            "description": "Agua mineral Salutaris.",
            "image": "salutaris.webp",
            "variations": [{ "price": 2 }]
        },
        {
            "id": 35,
            "name": "Jugo de Mandarina",
            "type": "bebida",
            "category": "jugo",
            "description": "Jugo natural de mandarina.",
            "image": "mandarina.webp",
            "variations": [{ "size": "500ml", "price": 2 }]
        },
        {
            "id": 36,
            "name": "Jugo de Naranja",
            "type": "bebida",
            "category": "jugo",
            "description": "Jugo natural de naranja.",
            "image": "naranja.webp",
            "variations": [{ "size": "500ml", "price": 2 }]
        },
        {
            "id": 37,
            "name": "Té de Durazno",
            "type": "bebida",
            "category": "té",
            "description": "Té helado sabor durazno.",
            "image": "te-durazno.webp",
            "variations": [{ "size": "500ml", "price": 2 }]
        },
        {
            "id": 38,
            "name": "Té de Frambuesa",
            "type": "bebida",
            "category": "té",
            "description": "Té helado sabor frambuesa.",
            "image": "te-frambuesa.webp",
            "variations": [{ "size": "500ml", "price": 2 }]
        },
        {
            "id": 39,
            "name": "Té de Limón",
            "type": "bebida",
            "category": "té",
            "description": "Té helado sabor limón.",
            "image": "te-limon.webp",
            "variations": [{ "size": "500ml", "price": 2 }]
        },
        {
            "id": 40,
            "name": "Botella de Agua",
            "type": "bebida",
            "category": "agua",
            "description": "Agua pura embotellada.",
            "image": "agua.webp",
            "variations": [{ "size": "600ml", "price": 1.5 }]
        },
        {
            "id": 41,
            "name": "Fresco de Jamaica",
            "type": "bebida",
            "category": "fresco",
            "description": "Bebida natural de Jamaica.",
            "image": "jamaica.webp",
            "variations": [{ "size": "12oz", "price": 2.25 }]
        },
        {
            "id": 42,
            "name": "Fresco de Horchata",
            "type": "bebida",
            "category": "fresco",
            "description": "Bebida típica de Horchata.",
            "image": "orchata.webp",
            "variations": [{ "size": "16oz", "price": 2.75 }]
        },
        {
            "id": 43,
            "name": "Espinaca con Manzana",
            "type": "bebida",
            "category": "licuado",
            "description": "Licuado nutritivo preparado al momento.",
            "image": "manzana-espinaca.webp",
            "variations": [{ "price": 3.5 }]
        },
        {
            "id": 44,
            "name": "Espinaca con Piña",
            "type": "bebida",
            "category": "licuado",
            "description": "Sabor tropical y saludable.",
            "image": "pepino-piña.webp",
            "variations": [{ "price": 3.5 }]
        },
        {
            "id": 45,
            "name": "Pepino con Limón",
            "type": "bebida",
            "category": "licuado",
            "description": "Súper refrescante.",
            "image": "pepino-limon.webp",
            "variations": [{ "price": 3.5 }]
        },
        {
            "id": 46,
            "name": "Pepino y Piña",
            "type": "bebida",
            "category": "licuado",
            "description": "Mezcla fresca y dulce.",
            "image": "pepino-piña.webp",
            "variations": [{ "price": 3.5 }]
        },
        {
            "id": 47,
            "name": "Apio y Manzana Verde",
            "type": "bebida",
            "category": "licuado",
            "description": "Ideal para comenzar el día.",
            "image": "manzana-espinaca.webp",
            "variations": [{ "price": 3.5 }]
        },
        {
            "id": 48,
            "name": "Apio y Piña",
            "type": "bebida",
            "category": "licuado",
            "description": "Desintoxicante y delicioso.",
            "image": "pepino-piña.webp",
            "variations": [{ "price": 3.5 }]
        },
        {
            "id": 49,
            "name": "Lechuga con Manzana",
            "type": "bebida",
            "category": "licuado",
            "description": "Combinación suave y nutritiva.",
            "image": "manzana-espinaca.webp",
            "variations": [{ "price": 3.5 }]
        },
        {
            "id": 50,
            "name": "Piña Jengibre y Agua",
            "type": "bebida",
            "category": "licuado",
            "description": "Picante sutil y mucha energía.",
            "image": "pepino-piña.webp",
            "variations": [{ "price": 3.5 }]
        },
        {
            "id": 51,
            "name": "Papaya Limón",
            "type": "bebida",
            "category": "licuado",
            "description": "Digestivo y dulce.",
            "image": "papaya-limon.webp",
            "variations": [{ "price": 3.5 }]
        },
        {
            "id": 52,
            "name": "Toronja y Naranja",
            "type": "bebida",
            "category": "licuado",
            "description": "Vitamina C al máximo.",
            "image": "toronja-naranja.webp",
            "variations": [{ "price": 3.5 }]
        },
        {
            "id": 53,
            "name": "Banano con Leche",
            "type": "bebida",
            "category": "licuado",
            "description": "Clásico y cremoso.",
            "image": "banano-leche.webp",
            "variations": [{ "price": 3.5 }]
        },
        {
            "id": 54,
            "name": "Fresa con Leche",
            "type": "bebida",
            "category": "licuado",
            "description": "Favorito de todos.",
            "image": "fresa-leche.webp",
            "variations": [{ "price": 3.5 }]
        },
        {
            "id": 55,
            "name": "Galleta Oreo",
            "type": "bebida",
            "category": "licuado",
            "description": "Para un antojo especial.",
            "image": "oreo.webp",
            "variations": [{ "price": 3.5 }]
        },
        {
            "id": 56,
            "name": "Café con Leche",
            "type": "bebida",
            "category": "café",
            "description": "Energía y cremosidad.",
            "image": "cafe-leche.webp",
            "variations": [{ "price": 3.5 }]
        },
        {
            "id": 57,
            "name": "Avena y Banano",
            "type": "bebida",
            "category": "licuado",
            "description": "Completo y satisfactorio.",
            "image": "banano-leche.webp",
            "variations": [{ "price": 3.5 }]
        },
        {
            "id": 58,
            "name": "Avena y Manzana",
            "type": "bebida",
            "category": "licuado",
            "description": "Equilibrado y delicioso.",
            "image": "manzana-espinaca.webp",
            "variations": [{ "price": 3.5 }]
        },
        {
            "id": 59,
            "name": "Zanahoria con Naranja",
            "type": "bebida",
            "category": "licuado",
            "description": "Brillo y salud.",
            "image": "zanahoria-naranja.webp",
            "variations": [{ "price": 3.5 }]
        },
        {
            "id": 60,
            "name": "Remolacha con Naranja",
            "type": "bebida",
            "category": "licuado",
            "description": "Sabor vibrante.",
            "image": "remolacha-naranja.webp",
            "variations": [{ "price": 3.5 }]
        },
        {
            "id": 61,
            "name": "Tomate con Apio",
            "type": "bebida",
            "category": "licuado",
            "description": "Saludable y refrescante.",
            "image": "tomate-apio.webp",
            "variations": [{ "price": 3.5 }]
        },
        {
            "id": 62,
            "name": "Café con Huevo",
            "type": "bebida",
            "category": "café",
            "description": "Tradicional y nutritivo.",
            "image": "cafe-huevo.png",
            "variations": [{ "price": 3.5 }]
        },
        {
            "id": 63,
            "name": "Naranja con Arándanos",
            "type": "bebida",
            "category": "licuado",
            "description": "Anti-oxidante natural.",
            "image": "naranja-arandanos.webp",
            "variations": [{ "price": 3.5 }]
        }
    ];

async function seedDatabase() {
  console.log("Starting database seeding...");
  
  // Cleanup: Delete existing products
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    console.log(`Deleting ${querySnapshot.size} existing products...`);
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log("Cleanup complete.");
  } catch (error) {
    console.error("Error during cleanup:", error);
  }

  // Format data to match the expected Product interface
  for (const item of products) {
    const formattedProduct = {
      name: item.name,
      description: item.description,
      price: item.variations[0].price,
      category: item.category === "licuado" ? "licuados" : item.category,
      type: item.type,
      image: `/${item.image}`,
    };
    
    try {
      const docRef = await addDoc(collection(db, "products"), formattedProduct);
      console.log(`Uploaded ${item.name} with ID: ${docRef.id}`);
    } catch (e) {
      console.error(`Error adding document ${item.name}: `, e);
    }
  }
  
  console.log("Seeding complete!");
  process.exit(0);
}

seedDatabase();
