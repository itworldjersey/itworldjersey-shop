// CONFIGURATION
const WA_NUMBER = "601126238907";
const TOTAL_PRODUCTS = 525;
const TOTAL_REELS = 545;
const BASE_PHOTO_URL = "https://photo.itworldjersey.shop/";
const BASE_VIDEO_URL = "https://video.itworldjersey.shop/";

// REEL TITLE MANIFEST
const REEL_TITLES = {
  "0001": "Jersey Printing Process 🔥",
  "0002": "Custom Team Uniform Reveal",
  "0003": "Behind the Scenes: Design Studio",
  "0010": "New Arrival Unboxing",
  "0050": "Customer Review & Feedback"
};

// SMART CATEGORY GENERATOR
function getCategory(id) {
  const num = parseInt(id);
  if (num <= 200) return "Club Teams";
  if (num <= 350) return "National Teams";
  if (num <= 450) return "Training & Custom";
  return "Special Edition";
}

// GENERATE PRODUCTS
const PRODUCTS = [];
for (let i = 1; i <= TOTAL_PRODUCTS; i++) {
  const id = String(i).padStart(4, '0');
  PRODUCTS.push({
    id: id,
    name: `Design ${id}`,
    category: getCategory(id),
    price: "49.99",
    image: `${BASE_PHOTO_URL}${id}.webp`
  });
}

// GENERATE REELS
const REELS = [];
for (let i = 1; i <= TOTAL_REELS; i++) {
  const id = String(i).padStart(4, '0');
  REELS.push({
    id: id,
    title: REEL_TITLES[id] || `Reel ${id}`,
    views: `${(Math.random() * 5 + 0.1).toFixed(1)}M`,
    video: `${BASE_VIDEO_URL}${id}.mp4`
  });
}

// CATEGORIES LIST
const CATEGORIES = ["All", "Club Teams", "National Teams", "Training & Custom", "Special Edition"];
