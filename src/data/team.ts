import steveOdongo from "@/assets/steve-odongo.jpg";
import jere9 from "@/assets/jere9.jpg";
import bradley from "@/assets/Bradley-Thomas.jpg";
import cliford from "@/assets/clifford-mukaria.jpg";
import MARK from "@/assets/MARK-NGUGI.jpg";
import Elvis from "@/assets/Elvis-Obiero.jpg";
import ANDRE from "@/assets/andre-obure.jpg";
import Anyega from "@/assets/Anyega-NEWTON.jpg";
import isaac from "@/assets/Isaac-waraba.jpg";
import jeremiah from "@/assets/jeremiah- ogutu.jpg";
import reagan from "@/assets/reagan.jpg";
import Worship from "@/assets/worship.jpg";
import sami from "@/assets/sami.jpg";
import Dennis from "@/assets/Dennis-Otieno.jpg";
import simon from "@/assets/koigi-simon.jpg";
import Brian from "@/assets/Brian-selete.jpg";
import Cornelius from "@/assets/cornelius-Kiptum.jpg";
import Patrick from "@/assets/Patrick-Apiri.jpg";
import Hanish from "@/assets/Hanish-Ochieng.jpg";
import peter from "@/assets/Peter-Mwendwa.jpg";
import Ireri from "@/assets/Ireri-bRIAN.jpg";
import James from "@/assets/James-Waithaka.jpg";
import Samuel from "@/assets/Samuel-Nyanga.jpg";
import Kelvin from "@/assets/Kelvin-Xavier.jpg";

export interface TeamMember {
  id: number;
  name: string;
  position: string;
  number: string;
  image: string;
  category: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Andre Obure",
    position: "Prop",
    number: "1",
    image: ANDRE,
    category: "Forwards",
  },
  {
    id: 2,
    name: "Steve Odongo",
    position: "Hooker",
    number: "2",
    image: steveOdongo,
    category: "Forwards",
  },
  {
    id: 3,
    name: "Anyega Newton",
    position: "Prop",
    number: "3",
    image: Anyega,
    category: "Forwards",
  },
  {
    id: 4,
    name: "Waraba Isaac",
    position: "Lock",
    number: "4",
    image: isaac,
    category: "Forwards",
  },
  {
    id: 9,
    name: "Bradley Thomas",
    position: "Lock",
    number: "5",
    image: bradley,
    category: "Forwards",
  },
  {
    id: 6,
    name: "Dennis Otieno",
    position: "Flanker",
    number: "6",
    image: Dennis,
    category: "Forwards",
  },
  {
    id: 7,
    name: "Simon koigi",
    position: "Flanker",
    number: "7",
    image: simon,
    category: "Forwards",
  },
  {
    id: 8,
    name: "Peter Mwendwa",
    position: "wing",
    number: "11",
    image: peter,
    category: "Forwards",
  },
  {
    id: 5,
    name: "Hanish-Ochieng",
    position: "Flanker",
    number: "7",
    image: Hanish,
    category: "Forwards",
  },
  {
    id: 13,
    name: "Corneilius Kiptum",
    position: "centre",
    number: "12",
    image: Cornelius,
    category: "Backs",
  },
  {
    id: 14,
    name: "Clifford Mukuria",
    position: "Wing",
    number: "11",
    image: cliford,
    category: "Backs",
  },
  {
    id: 15,
    name: "MARK NGUGI",
    position: "PROP",
    number: "1",
    image: MARK,
    category: "Forwards",
  },
  {
    id: 16,
    name: "Elvis Obiero",
    position: "Centre",
    number: "13",
    image: Elvis,
    category: "Backs",
  },
  {
    id: 17,
    name: "Patrick Apiri",
    position: "Centre",
    number: "12",
    image: Patrick,
    category: "Backs",
  },
  {
    id: 18,
    name: "Brian-Selete",
    position: "Full-Back",
    number: "15",
    image: Brian,
    category: "Backs",
  },
  {
    id: 10,
    name: "Kelvin Xavier",
    position: "Head Coach",
    number: "",
    image: Kelvin,
    category: "Staff",
  },
  {
    id: 11,
    name: "reagan kamau",
    position: "Manager",
    number: "",
    image: reagan,
    category: "Staff",
  },
  {
    id: 12,
    name: "Worship",
    position: "Physio",
    number: "",
    image: Worship,
    category: "Staff",
  },
  {
    id: 19,
    name: "jeremy Ogutu",
    position: "Scrum-Half",
    number: "9",
    image: jeremiah,
    category: "Backs",
  },
  {
    id: 20,
    name: "Brian Ireri",
    position: "Wing",
    number: "14",
    image: Ireri,
    category: "Backs",
  },
  {
    id: 50,
    name: "James Waithaka",
    position: "Scrum-Half",
    number: "9",
    image: James,
    category: "Backs",
  },
  {
    id: 49,
    name: "Sam Nyanga",
    position: "Fly-Half",
    number: "10",
    image: Samuel,
    category: "Backs",
  },
];

export const positionSuggestions = [
  "Hooker",
  "Flanker",
  "Prop",
  "Lock",
  "Number 8",
  "Scrum-Half",
  "Fly-Half",
  "Centre",
  "Wing",
  "Full-Back",
  "Head Coach",
  "Manager",
  "Physio",
];

export const primaryFilters = ["All", "Forwards", "Backs", "Staff"];