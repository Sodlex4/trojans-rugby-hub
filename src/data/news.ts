import heroSlide4 from "@/assets/hero-slide-4.jpg";
import sami from "@/assets/sami.jpg";
import jere9 from "@/assets/jere9.jpg";

export interface NewsItem {
  id: number;
  date: string;
  title: string;
  description: string;
  image: string;
}

export const newsItems: NewsItem[] = [
  {
    id: 1,
    date: "21. DECEMBER 2025",
    title: "Trojans Win BingwaFest Kenya Championship!",
    description:
      "Historic victory at BingwaFest Kenya with 250,000 KES prize money! Our team showed exceptional skill and determination throughout the tournament.",
    image: heroSlide4,
  },
  {
    id: 2,
    date: "21. DECEMBER 2025",
    title: "celebrations of tears and joy from Trojans captain Sam ",
    description:
      "From the final whistle to the celebrations that followed, captain Sam's tears of joy captured the passion, sacrifice, and unity of the Trojans.",
    image: sami,
  },
  {
    id: 3,
    date: "21. DECEMBER 2025",
    title: "BingwaFest Kenya - Road to Finals",
    description:
      "Relive our incredible journey through the BingwaFest Kenya tournament. From group stages to the grand finale!",
    image: jere9,
  },
  {
    id: 4,
    date: "10. DECEMBER 2024",
    title: "Youth Academy Opens Enrollment",
    description:
      "Join our youth development program and train with the best coaches in Central Kenya. Ages 8-18 welcome!",
    image: "https://images.unsplash.com/photo-1512719994953-eabf50895df7?w=600&q=80",
  },
  {
    id: 5,
    date: "21. DECEMBER 2025",
    title: "Trojans Win BingwaFest Kenya Championship!",
    description:
      "Historic victory at BingwaFest Kenya with 250,000 KES prize money! Our team showed exceptional skill and determination throughout the tournament.",
    image: heroSlide4,
  },
];