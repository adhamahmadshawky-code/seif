// Local audio tracks. No external streaming, no bundled copyrighted music.
// Add your permitted files to public/audio/ and match the `src` values below.
//
// BASE_URL keeps these paths correct whether the app is served from "/" or a
// sub-path (base: './' in vite.config.ts).

export type Track = {
  id: string;
  title: string;
  src: string;
};

const base = import.meta.env.BASE_URL;
const file = (name: string) => `${base}audio/${name}`;

export const TRACKS: Track[] = [
  { id: 'night', title: 'Khanza2or', src: file('Khanza2or.mp3') },
  { id: 'rooftop', title: 'PRIMPERAN', src: file('PRIMPERAN.mp3') },
  { id: 'chill', title: 'Gaw Br2', src: file('Gaw Br2.mp3') },
];
