import { Testimonial, TeamMember } from './types';

export const CATEGORIES = [
  "Phones & Accessories",
  "Home & Kitchen",
  "Kids & Baby",
  "Appliances",
  "Shoes",
  "Computing",
  "Health & Beauty",
  "Clothes",
];

export const WHATSAPP_NUMBER = "254769259151";
export const INSTAGRAM_HANDLE = "bigi.kenya";
export const FACEBOOK_HANDLE = "#"; // Placeholder handle
export const X_HANDLE = "#"; // Placeholder handle
export const LINKEDIN_HANDLE = "#"; // Placeholder handle
export const COMPANY_EMAIL = "hello@bigi.co.ke";
export const CAREERS_EMAIL = "careers@bigi.co.ke";
export const SHIPPING_COST = 0;

export const DELIVERY_LOCATIONS = {
  "Nairobi - Central & West": [
    "CBD (Central Business District)",
    "Westlands",
    "Parklands",
    "Highridge",
    "Kileleshwa",
    "Kilimani",
    "Lavington",
    "Hurlingham",
    "Ngara",
    "Upper Hill",
  ],
  "Nairobi - South": [
    "Lang'ata",
    "Karen",
    "South B",
    "South C",
    "Nairobi West",
    "Madaraka",
  ],
  "Nairobi - East": [
    "Eastleigh",
    "Embakasi",
    "Donholm",
    "Umoja",
    "Kayole",
    "Pipeline",
    "Buru Buru",
    "Pangani",
  ],
  "Nairobi - North": [
    "Kasarani",
    "Roysambu",
    "Zimmerman", "Mirema", "Lumumba Drive".
    "Githurai 45",
    "Kahawa West",
    "Runda",
    "Muthaiga",
    "Garden Estate",
  ],
  "Nairobi Metropolitan Area": [
    "Athi River",
    "Juja",
    "Kiambu Town",
    "Kikuyu",
    "Kitengela",
    "Limuru",
    "Mlolongo",
    "Ngong",
    "Ongata Rongai",
    "Ruiru",
    "Syokimau",
    "Thika",
    "Wangige",
  ],
};

export const TESTIMONIALS: Testimonial[] = [
    { name: "Grace W.", location: "Kilimani, Nairobi", stars: 5, feedback: "I'm so impressed with the speed of delivery! I ordered a blender in the morning and had it by evening. The product quality is excellent too. Bigi is my new go-to!", imageUrl: "https://i.pravatar.cc/150?u=grace" },
    { name: "David K.", location: "Westlands, Nairobi", stars: 5, feedback: "The variety is amazing. I found exactly the kids' shoes I was looking for, which are hard to find elsewhere. The website is easy to use, and checkout was a breeze.", imageUrl: "https://i.pravatar.cc/150?u=david" },
    { name: "Fatima A.", location: "South C, Nairobi", stars: 4, feedback: "As a busy mom, Bigi is a lifesaver. I can order appliances and get them delivered for free without leaving the house. The cash on delivery is a huge plus for me.", imageUrl: "https://i.pravatar.cc/150?u=fatima" },
    { name: "Brian M.", location: "Parklands, Nairobi", stars: 5, feedback: "Finally, an online store that feels trustworthy. The product descriptions are accurate, and what you see is what you get. The Friday offers are a huge bonus!", imageUrl: "https://i.pravatar.cc/150?u=brian" },
    { name: "Esther N.", location: "Ruiru, Kiambu", stars: 5, feedback: "Living just outside Nairobi, I often struggle with delivery. Bigi was seamless. My computing accessories arrived the next day. Highly recommend their service!", imageUrl: "https://i.pravatar.cc/150?u=esther" },
    { name: "Samuel O.", location: "Kitengela, Kajiado", stars: 5, feedback: "I was skeptical about ordering shoes online, but the quality exceeded my expectations. The customer support team called to confirm the order, which was a nice personal touch.", imageUrl: "https://i.pravatar.cc/150?u=samuel" },
    { name: "Christine K.", location: "Thika, Kiambu", stars: 4, feedback: "The health & beauty section has a great selection. I found my favorite brands at a very good price. Will definitely be shopping here again for my skincare needs.", imageUrl: "https://i.pravatar.cc/150?u=christine" },
    { name: "Peter G.", location: "Syokimau, Machakos", stars: 5, feedback: "The user experience is top-notch. The site is fast, the search works perfectly, and the checkout process is incredibly simple. A truly modern shopping platform.", imageUrl: "https://i.pravatar.cc/150?u=peter" },
];

export const TEAM_MEMBERS: TeamMember[] = [
    {
        name: "Shem Johns",
        title: "Founder & CEO",
        bio: "The Visionary. Shem started Bigi after a 3-week delivery wait for a spatula convinced him he could do better. He's the driving force behind our 'Buy It, Get It' promise, ensuring no one ever suffers a similar fate.",
        imageUrl: "https://i.pravatar.cc/300?u=shem-johns"
    },
    {
        name: "Anthony Emong'oluk",
        title: "Chief Technology Officer",
        bio: "The Architect. Ant speaks three languages: English, JavaScript, and Sarcasm. He turns coffee into clean, scalable code and believes any problem can be solved with a well-placed console.log(). His motto: 'It’s not a bug, it’s an undocumented feature.'",
        imageUrl: "https://i.pravatar.cc/300?u=anthony-emongoluk"
    },
    {
        name: "Carlos Kirimo",
        title: "Marketing Director",
        bio: "The Storyteller. Carlos crafts marketing campaigns that create genuine connections. He balances data-driven insights with creative flair, ensuring the Bigi story is heard, felt, and shared by our growing community.",
        imageUrl: "https://i.pravatar.cc/300?u=carlos-kirimo"
    },
    {
        name: "Emmanuel Otieno",
        title: "Head of Operations",
        bio: "The Conductor. Emma is the master of our operational symphony, orchestrating logistics with precision. A real-life Tetris champion with delivery vans, he's the reason our promise of speed is a reality, every single day.",
        imageUrl: "https://i.pravatar.cc/300?u=emmanuel-otieno"
    }
];
