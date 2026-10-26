// ფილმების სარჩევი, ბარათები და განრიგი ამ მასივიდან აიგება.
const cinemaFilms = [
  {
    id: "divergent",
    title: "დივერგენტი",
    originalTitle: "Divergent",
    year: 2014,
    ageLimit: "12+",
    genre: "ფანტასტიკა / სათავგადასავლო",
    duration: "2სთ 19წთ",
    poster: "images/posters/divergent",
    color: "#655b45",
    sessions: [
      { date: "2026-10-25", times: ["12:00", "17:00", "21:00"] },
      { date: "2026-10-26", times: ["14:00", "19:30"] },
      { date: "2026-10-27", times: ["11:30", "16:00", "20:30"] }
    ]
  },
  {
    id: "hobbit",
    title: "ჰობიტი: მოულოდნელი მოგზაურობა",
    originalTitle: "The Hobbit: An Unexpected Journey",
    year: 2012,
    ageLimit: "12+",
    genre: "ფენტეზი",
    duration: "2სთ 49წთ",
    poster: "images/posters/hobbit",
    color: "#6e583b",
    sessions: [
      { date: "2026-10-25", times: ["10:30", "15:00", "20:00"] },
      { date: "2026-10-26", times: ["12:30", "18:00"] },
      { date: "2026-10-27", times: ["13:00", "17:00", "21:00"] }
    ]
  },
  {
    id: "hunger-games",
    title: "შიმშილის თამაშები",
    originalTitle: "The Hunger Games",
    year: 2012,
    ageLimit: "12+",
    genre: "ფანტასტიკა / დრამა",
    duration: "2სთ 22წთ",
    poster: "images/posters/hunger-games",
    color: "#744b36",
    sessions: [
      { date: "2026-10-25", times: ["11:00", "16:30", "21:30"] },
      { date: "2026-10-26", times: ["10:30", "15:30"] },
      { date: "2026-10-27", times: ["12:00", "17:30", "22:00"] }
    ]
  },
  {
    id: "interstellar",
    title: "ინტერსტელარი",
    originalTitle: "Interstellar",
    year: 2014,
    ageLimit: "12+",
    genre: "სამეცნიერო ფანტასტიკა",
    duration: "2სთ 49წთ",
    poster: "images/posters/interstellar",
    color: "#354d63",
    sessions: [
      { date: "2026-10-25", times: ["13:00", "18:00", "22:00"] },
      { date: "2026-10-26", times: ["11:00", "16:00"] },
      { date: "2026-10-27", times: ["10:30", "15:30", "20:30"] }
    ]
  },
  {
    id: "inception",
    title: "დასაწყისი",
    originalTitle: "Inception",
    year: 2010,
    ageLimit: "12+",
    genre: "სამეცნიერო ფანტასტიკა / თრილერი",
    duration: "2სთ 28წთ",
    poster: "images/posters/inception",
    color: "#46575b",
    sessions: [
      { date: "2026-10-25", times: ["10:00", "14:30", "19:30"] },
      { date: "2026-10-26", times: ["13:00", "18:00"] },
      { date: "2026-10-27", times: ["12:30", "17:00", "21:30"] }
    ]
  },
  {
    id: "shrek",
    title: "შრეკი",
    originalTitle: "Shrek",
    year: 2001,
    ageLimit: "0+",
    genre: "ანიმაცია / კომედია",
    duration: "1სთ 30წთ",
    poster: "images/posters/shrek",
    color: "#48613c",
    sessions: [
      { date: "2026-10-25", times: ["10:00", "13:30", "16:30"] },
      { date: "2026-10-26", times: ["10:00", "14:00"] },
      { date: "2026-10-27", times: ["10:30", "13:30", "16:00"] }
    ]
  }
];

const cinemaPrices = {
  ticket: 12,
  vip: 20
};

const vipRooms = [
  { id: "vip-1", name: "VIP ოთახი 1", capacity: 6 },
  { id: "vip-2", name: "VIP ოთახი 2", capacity: 8 },
  { id: "vip-3", name: "VIP ოთახი 3", capacity: 12 }
];

const vipTimes = [
  { date: "2026-10-25", times: ["12:00", "15:00", "18:00", "21:00"] },
  { date: "2026-10-26", times: ["12:00", "15:00", "18:00", "21:00"] },
  { date: "2026-10-27", times: ["12:00", "15:00", "18:00", "21:00"] }
];
