// GK content for the GK tab. Everything here is a fact from the Class 3 Social
// Studies chapters (Our Government, Our Leaders, Delhi & Mumbai, India - Our
// Beautiful Country, Knowing Our Earth, Transport), plus the full list of
// States / UT capitals the Government chapter asks for. Keep sentences short:
// this is a quick-revision page, not a textbook.

export interface Region {
  /** Matches the name used in indiaMap.ts. */
  shape: string;
  /** Name as written in the book. */
  name: string;
  capital: string;
  kind: "state" | "ut";
  /** Where to put the capital's dot on the map. */
  lat: number;
  lon: number;
  note?: string;
}

// 28 states, then 8 Union Territories, each alphabetical. Index + 1 is the
// number printed on the map.
export const REGIONS: Region[] = [
  { shape: "Andhra Pradesh", name: "Andhra Pradesh", capital: "Amaravati", kind: "state", lat: 16.51, lon: 80.52 },
  { shape: "Arunachal Pradesh", name: "Arunachal Pradesh", capital: "Itanagar", kind: "state", lat: 27.08, lon: 93.61 },
  { shape: "Assam", name: "Assam", capital: "Dispur", kind: "state", lat: 26.14, lon: 91.79 },
  { shape: "Bihar", name: "Bihar", capital: "Patna", kind: "state", lat: 25.59, lon: 85.14 },
  { shape: "Chhattisgarh", name: "Chhattisgarh", capital: "Raipur", kind: "state", lat: 21.25, lon: 81.63 },
  { shape: "Goa", name: "Goa", capital: "Panaji", kind: "state", lat: 15.5, lon: 73.83, note: "Also spelt Panjim" },
  { shape: "Gujarat", name: "Gujarat", capital: "Gandhinagar", kind: "state", lat: 23.22, lon: 72.65 },
  { shape: "Haryana", name: "Haryana", capital: "Chandigarh", kind: "state", lat: 30.73, lon: 76.78, note: "Shared with Punjab" },
  { shape: "Himachal Pradesh", name: "Himachal Pradesh", capital: "Shimla", kind: "state", lat: 31.1, lon: 77.17 },
  { shape: "Jharkhand", name: "Jharkhand", capital: "Ranchi", kind: "state", lat: 23.34, lon: 85.31 },
  { shape: "Karnataka", name: "Karnataka", capital: "Bengaluru", kind: "state", lat: 12.97, lon: 77.59 },
  { shape: "Kerala", name: "Kerala", capital: "Thiruvananthapuram", kind: "state", lat: 8.52, lon: 76.94 },
  { shape: "Madhya Pradesh", name: "Madhya Pradesh", capital: "Bhopal", kind: "state", lat: 23.26, lon: 77.41 },
  { shape: "Maharashtra", name: "Maharashtra", capital: "Mumbai", kind: "state", lat: 19.08, lon: 72.88 },
  { shape: "Manipur", name: "Manipur", capital: "Imphal", kind: "state", lat: 24.82, lon: 93.94 },
  { shape: "Meghalaya", name: "Meghalaya", capital: "Shillong", kind: "state", lat: 25.57, lon: 91.88 },
  { shape: "Mizoram", name: "Mizoram", capital: "Aizawl", kind: "state", lat: 23.73, lon: 92.72 },
  { shape: "Nagaland", name: "Nagaland", capital: "Kohima", kind: "state", lat: 25.67, lon: 94.11 },
  { shape: "Odisha", name: "Odisha", capital: "Bhubaneswar", kind: "state", lat: 20.3, lon: 85.82 },
  { shape: "Punjab", name: "Punjab", capital: "Chandigarh", kind: "state", lat: 30.73, lon: 76.78, note: "Shared with Haryana" },
  { shape: "Rajasthan", name: "Rajasthan", capital: "Jaipur", kind: "state", lat: 26.91, lon: 75.79 },
  { shape: "Sikkim", name: "Sikkim", capital: "Gangtok", kind: "state", lat: 27.33, lon: 88.61 },
  { shape: "Tamil Nadu", name: "Tamil Nadu", capital: "Chennai", kind: "state", lat: 13.08, lon: 80.27 },
  { shape: "Telangana", name: "Telangana", capital: "Hyderabad", kind: "state", lat: 17.39, lon: 78.49 },
  { shape: "Tripura", name: "Tripura", capital: "Agartala", kind: "state", lat: 23.83, lon: 91.28 },
  { shape: "Uttar Pradesh", name: "Uttar Pradesh", capital: "Lucknow", kind: "state", lat: 26.85, lon: 80.95 },
  { shape: "Uttarakhand", name: "Uttarakhand", capital: "Dehradun", kind: "state", lat: 30.32, lon: 78.03 },
  { shape: "West Bengal", name: "West Bengal", capital: "Kolkata", kind: "state", lat: 22.57, lon: 88.36 },

  { shape: "Andaman and Nicobar Islands", name: "Andaman & Nicobar Islands", capital: "Port Blair", kind: "ut", lat: 11.62, lon: 92.73 },
  { shape: "Chandigarh", name: "Chandigarh", capital: "Chandigarh", kind: "ut", lat: 30.73, lon: 76.78, note: "Capital of Punjab and Haryana too" },
  { shape: "Dadra and Nagar Haveli and Daman and Diu", name: "Dadra & Nagar Haveli and Daman & Diu", capital: "Daman", kind: "ut", lat: 20.4, lon: 72.83 },
  { shape: "Delhi", name: "Delhi", capital: "New Delhi", kind: "ut", lat: 28.61, lon: 77.21, note: "Capital of India" },
  { shape: "Jammu and Kashmir", name: "Jammu & Kashmir", capital: "Srinagar", kind: "ut", lat: 34.08, lon: 74.8, note: "Jammu in winter" },
  { shape: "Ladakh", name: "Ladakh", capital: "Leh", kind: "ut", lat: 34.16, lon: 77.58 },
  { shape: "Lakshadweep", name: "Lakshadweep", capital: "Kavaratti", kind: "ut", lat: 10.57, lon: 72.64 },
  { shape: "Puducherry", name: "Puducherry", capital: "Puducherry", kind: "ut", lat: 11.93, lon: 79.83 },
];

export interface Fact {
  /** Bold lead-in, e.g. the name of the person or place. */
  title: string;
  /** Small tag next to the title, e.g. "Father of the Nation". */
  tag?: string;
  /** Photo file in public/leaders. */
  photo?: string;
  lines: string[];
}

export interface FactGroup {
  title: string;
  blurb?: string;
  facts: Fact[];
}

export const PEOPLE: FactGroup[] = [
  {
    title: "Freedom fighters",
    blurb: "Leaders who fought for India's freedom.",
    facts: [
      {
        title: "Mahatma Gandhi",
        photo: "gandhi.jpg",
        tag: "Father of the Nation",
        lines: [
          "Full name: Mohandas Karamchand Gandhi. Everyone also called him Bapu.",
          "Born on 2 October 1869 in Porbandar, Gujarat.",
          "He studied law in England.",
          "He fought the British with Satyagraha and Ahimsa (non-violence).",
        ],
      },
      {
        title: "Bal Gangadhar Tilak",
        photo: "tilak.jpg",
        tag: "Lokmanya",
        lines: [
          "Lokmanya means 'respected by all'.",
          "Slogan: \"Swaraj is my birthright and I shall have it.\"",
          "He started two weekly newspapers: Kesari (Marathi) and Mahratta (English).",
        ],
      },
      {
        title: "Sardar Vallabhbhai Patel",
        photo: "patel.jpg",
        tag: "Iron Man of India",
        lines: ["A lawyer by profession.", "A strong and brave leader.", "He was inspired by Mahatma Gandhi to join the freedom struggle."],
      },
      {
        title: "Sarojini Naidu",
        photo: "naidu.jpg",
        tag: "Nightingale of India",
        lines: ["First woman President of the Indian National Congress.", "First woman Governor of India."],
      },
      {
        title: "Netaji Subhash Chandra Bose",
        photo: "bose.jpg",
        lines: [
          "Born in Odisha.",
          "Slogans: \"Jai Hind\" and \"Give me blood, I will give you freedom.\"",
          "Formed the Indian National Army (Azad Hind Fauj).",
          "Its women's unit was the Rani Jhansi Bahini, led by Captain Lakshmi Sahgal.",
        ],
      },
      {
        title: "Rani Lakshmi Bai",
        photo: "rani.jpg",
        tag: "Queen of Jhansi",
        lines: [
          "She was married to Gangadhar Rao, the King of Jhansi.",
          "She fought the British to save her kingdom in the Revolt of 1857.",
          "She died in 1858.",
        ],
      },
    ],
  },
  {
    title: "Our government today",
    blurb: "As taught in class. These can change after elections, so check with your teacher.",
    facts: [
      { title: "President of India", photo: "murmu.jpg", tag: "Smt. Droupadi Murmu", lines: ["Lives in Rashtrapati Bhawan, New Delhi."] },
      { title: "Vice-President of India", photo: "radhakrishnan.jpg", tag: "C. P. Radhakrishnan", lines: [] },
      { title: "Prime Minister of India", photo: "modi.jpg", tag: "Shri Narendra Modi", lines: ["The Prime Minister and other ministers of the Central Government live in New Delhi."] },
      { title: "Home Minister of India", photo: "shah.jpg", tag: "Shri Amit Shah", lines: [] },
      { title: "Chief Minister of Maharashtra", photo: "fadnavis.jpg", tag: "Shri Devendra Fadnavis", lines: ["Heads the State Government."] },
      { title: "Governor of Maharashtra", photo: "varma.jpg", tag: "Shri Jishnu Dev Varma", lines: ["A Governor lives in the Raj Bhawan of the state."] },
    ],
  },
];

export const GOVERNMENT: Fact[] = [
  { title: "Capital of India", tag: "New Delhi", lines: [] },
  { title: "Independence Day", tag: "15 August 1947", lines: ["India became an independent country on 15th August 1947."] },
  { title: "States and Union Territories", tag: "28 + 8 = 36", lines: ["India has 28 States and 8 Union Territories."] },
  { title: "Parliament", tag: "Law-making body", lines: ["Parliament House (Sansad Bhavan) in New Delhi.", "It has the Lok Sabha and the Rajya Sabha."] },
  { title: "Central Government", lines: ["Like the head of a family, it runs the whole country.", "It looks after the Union Territories."] },
  { title: "State Government", lines: ["Looks after education, health, the welfare of people and law and order in its state."] },
  { title: "Union Territory", lines: ["A small part of India controlled directly by the Central Government.", "Examples: Delhi, Lakshadweep, Puducherry."] },
];

export const PLACES: FactGroup[] = [
  {
    title: "Delhi",
    blurb: "The capital of India. Official name: National Capital Territory of Delhi.",
    facts: [
      { title: "Where", lines: ["On the banks of the River Yamuna.", "Its neighbouring state is Haryana."] },
      { title: "New Delhi", tag: "Lutyens' Delhi", lines: ["Planned and designed by the British architect Sir Edwin Lutyens.", "The British built New Delhi as the capital."] },
      { title: "Mini India", lines: ["People from many states come here for jobs and education."] },
      { title: "Climate", tag: "Extreme", lines: ["Very hot summers and very cold winters.", "Hot, dry winds called loo blow from April to June.", "It rains from July to September."] },
      { title: "Places to see", lines: ["Red Fort, India Gate, Qutub Minar, Nehru Planetarium, Akshardham Temple.", "Jantar Mantar was built by Maharaja Jai Singh II."] },
      { title: "Memorials", lines: ["Raj Ghat: samadhi of Mahatma Gandhi.", "Shanti Van: memorial of Jawaharlal Nehru."] },
      { title: "Government", lines: ["Parliament and the Prime Minister's Office.", "Central Secretariat building (two blocks).", "Embassies / High Commissions: offices of other countries."] },
      { title: "Markets and business", lines: ["Chandni Chowk: one of the oldest and busiest markets.", "Connaught Place: one of the largest business spots."] },
      { title: "Getting around", lines: ["Delhi Metro is fast and cheap.", "Modern roads, bridges and flyovers."] },
      { title: "G20 Summit", tag: "2023", lines: ["Delhi hosted it successfully."] },
    ],
  },
  {
    title: "Mumbai",
    blurb: "The capital of Maharashtra.",
    facts: [
      { title: "Famous as", lines: ["The richest city of India and an important port.", "Entertainment and business capital of India.", "City of Dreams: people come here to work or become actors."] },
      { title: "Places to see", lines: ["Gateway of India, Jehangir Art Gallery, Taraporewala Aquarium, Essel World.", "Marine Drive is called the Queen's Necklace.", "Malabar Hills: the most beautiful view of Mumbai."] },
      { title: "Getting around", lines: ["Local trains are the best public transport.", "Chhatrapati Shivaji Terminus (CST) is one of the busiest railway stations."] },
      { title: "Bombay High", lines: ["Mineral oil is found in the sea bed here.", "It is purified in a refinery."] },
      { title: "Climate", tag: "Warm and humid", lines: ["Winters are pleasant, not very cold."] },
      { title: "Festival", tag: "Ganesh Chaturthi", lines: ["An important festival in Mumbai."] },
    ],
  },
];

export const GEOGRAPHY: FactGroup[] = [
  {
    title: "India's landforms",
    facts: [
      { title: "Himalayas", tag: "Mountains", lines: ["Form the northern boundary of India.", "The world's highest mountain range, mostly covered with snow.", "Foothills at the bottom are covered with forest (Mussoorie and Nainital)."] },
      { title: "Northern Plains", tag: "Plains", lines: ["Flat, fertile land. The Ganga and Yamuna flow through them.", "Thickly populated because plenty of food is grown."] },
      { title: "Deccan Plateau", tag: "Southern Plateau", lines: ["Occupies the largest part of India.", "Its rivers depend on rain, so they dry up in summer and it is not very fertile."] },
      { title: "Vindhya and Satpura", tag: "Central India", lines: ["The two mountain ranges of Central India."] },
      { title: "Desert", lines: ["Dry, hot and sandy with very little rain, so life is tough."] },
      { title: "Coastal plains", lines: ["Neither very hot nor very cold, so no woollens are needed."] },
      { title: "Islands", lines: ["Lakshadweep lies in the Arabian Sea.", "Andaman and Nicobar lie in the Bay of Bengal."] },
      { title: "Kanniyakumari", lines: ["The southernmost tip of the peninsula."] },
    ],
  },
  {
    title: "What do they mean?",
    facts: [
      { title: "Plains", lines: ["Flat and levelled land."] },
      { title: "Plateau", lines: ["Flat land like a tabletop, higher than the land around it. The ground is rough."] },
      { title: "Peninsula", lines: ["Land surrounded by water on three sides."] },
      { title: "Desert", lines: ["A vast area of flat land covered with sand."] },
      { title: "Island", lines: ["Land surrounded by water on all sides."] },
    ],
  },
  {
    title: "Our Earth",
    facts: [
      { title: "7 continents", lines: ["Asia, Africa, North America, South America, Europe, Australia and Antarctica.", "We live in Asia, the largest continent. Australia is the smallest."] },
      { title: "5 oceans", lines: ["Pacific, Atlantic, Indian, Arctic and Antarctic.", "Pacific is the largest and deepest. Arctic is the smallest.", "The Antarctic Ocean is also called the Southern Ocean."] },
      { title: "Mount Everest", lines: ["The highest peak in the world. It is in Nepal."] },
      { title: "Globe, map and atlas", lines: ["A globe is a small round model of the Earth.", "A map is a drawing of places on a flat surface.", "An atlas is a book of maps."] },
      { title: "Directions", lines: ["North, South, East and West.", "The Sun rises in the East and sets in the West.", "A compass needle always points north."] },
    ],
  },
  {
    title: "Transport and road safety",
    facts: [
      { title: "Camel", tag: "Ship of the Desert", lines: [] },
      { title: "Zebra crossing", lines: ["Use it to cross the road safely."] },
      { title: "Subway", lines: ["An underground way to cross the road safely."] },
      { title: "Level crossing", lines: ["A place where a railway line and a road cross each other."] },
    ],
  },
];
