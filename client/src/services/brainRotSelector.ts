import tungSahur from '@/assets/auth/tung sahur.png';
import asinoRagazzo from '@/assets/auth/Asinoooooo Ragazzo.jpeg';
import claudio from "@/assets/auth/Claudiooo L'Asino Intelligente e l'Umorismo Italiano.jpeg";
import donki from '@/assets/auth/Donki donkis Breadi breadis.jpeg';
import karkerkar from '@/assets/auth/Karkerkar Kurkur.webp';
import rarerorirararol from '@/assets/auth/Rarerorirararol.webp';

export interface BrainRotContent {
  image: string;
  alt: string;
  text: string;
}

const brainRotCollection: BrainRotContent[] = [
  {
    image: tungSahur,
    alt: 'Un âne assis à son bureau qui travaille sur un ordinateur',
    text: 'Quand tu passes 8h sur la même chaise, ton dos souffre plus que ton code.',
  },
  {
    image: asinoRagazzo,
    alt: 'Asino Ragazzo',
    text: "Mamma mia, redresse-toi ! Ton dos n'est pas un spaghetti trop cuit.",
  },
  {
    image: claudio,
    alt: "Claudio l'âne intelligent",
    text: "L'intelligence, c'est aussi savoir s'étirer toutes les heures pour préserver ses lombaires.",
  },
  {
    image: donki,
    alt: 'Donki donkis breadi',
    text: 'Gagne ton pain sans y laisser ta colonne vertébrale, amigo.',
  },
  {
    image: karkerkar,
    alt: 'Karkerkar Kurkur',
    text: "Kurkur te regarde... Tiens-toi droit avant qu'il ne s'énerve !",
  },
  {
    image: rarerorirararol,
    alt: 'Rarerorirararol',
    text: "Rarerorirararol... C'est le bruit de tes vertèbres si tu ne fais pas de pauses régulières.",
  },
];

export function getRandomBrainRot(): BrainRotContent {
  const randomIndex = Math.floor(Math.random() * brainRotCollection.length);
  return brainRotCollection[randomIndex];
}
