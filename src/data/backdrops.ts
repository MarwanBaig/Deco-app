import mountainDawnImg from '../assets/images/hero_mountain_dawn_1794740494760.jpg';
import pineForestImg from '../assets/images/bg_pine_forest_1794740494803.jpg';
import calmLakeImg from '../assets/images/bg_calm_lake_1794740495651.jpg';
import goldenSunsetImg from '../assets/images/bg_golden_sunset_1794740495895.jpg';
import { StudyBackdropId } from '../types/academic';

export interface StudyBackdropOption {
  id: StudyBackdropId;
  label: string;
  description: string;
  imageUrl: string | null;
}

export const STUDY_BACKDROPS: StudyBackdropOption[] = [
  {
    id: 'mountains',
    label: 'Misty Mountain Dawn',
    description: 'Calm highland peaks with pine foothills in soft morning light.',
    imageUrl: mountainDawnImg
  },
  {
    id: 'forest',
    label: 'Quiet Pine Forest',
    description: 'Filtered sunlight through tranquil moss and woodland trees.',
    imageUrl: pineForestImg
  },
  {
    id: 'lake',
    label: 'Calm Alpine Lake',
    description: 'Mirror-still teal water reflecting mountain pines and sky.',
    imageUrl: calmLakeImg
  },
  {
    id: 'sunset',
    label: 'Golden Valley Sunset',
    description: 'Gentle green hills and winding river under warm evening clouds.',
    imageUrl: goldenSunsetImg
  },
  {
    id: 'minimal',
    label: 'Clean Minimal (No Photo)',
    description: 'Pure warm ivory or woodland slate canvas with zero photography.',
    imageUrl: null
  }
];

export function getBackdropOption(id: StudyBackdropId): StudyBackdropOption {
  return STUDY_BACKDROPS.find((b) => b.id === id) || STUDY_BACKDROPS[0];
}
