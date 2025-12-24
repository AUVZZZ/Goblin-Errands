export type AttributeType = 'arms' | 'legs' | 'eyes' | 'mouth';

export interface AttributeData {
  value: number;
  descriptor: string;
}

export interface Specialty {
  name: string;
  description: string;
  type: 'starting' | 'advanced';
  effect?: string; // e.g., "+1 Arms"
  sourceRole?: string; // Added to track which role this came from in cross-class selection
}

export interface Role {
  id: string;
  name: string; // e.g., "捣蛋鬼"
  englishName: string; // e.g., "Rowdy"
  tagline: string; // e.g., "勇敢且机智"
  description: string;
  attributeDescriptors: {
    arms: string[];
    legs: string[];
    eyes: string[];
    mouth: string[];
  };
  startingSpecialties: Specialty[];
  advancedSpecialties: Specialty[];
  suggestedNames: string[];
}

export interface TitleData {
  name: string;
  grantedSpecialty?: Specialty;
  dateObtained: string;
  type: 'mission' | 'achievement_merge';
}

export interface GoblinCharacter {
  name: string;
  roleId: string;
  // Attributes
  attributes: {
    arms: AttributeData;
    legs: AttributeData;
    eyes: AttributeData;
    mouth: AttributeData;
  };
  // Identity
  appearance: string;
  bodyDescriptor: string; // New: 体格描述
  mindDescriptor: string; // New: 心灵描述
  
  // Progression
  selectedAdvancedSpecialty: string; // The starting advanced specialty
  extraSpecialties: Specialty[]; // Specialties gained via Titles
  
  // Campaign State
  pendingAchievements: [string, string]; // Fixed 2 slots for achievements
  titles: TitleData[]; // Earned titles
  
  // Legacy / Meta
  isHeir: boolean; // Does this character get the bonus point?
  heirBonusApplied?: AttributeType; // Which stat got the bonus?
  isRetired: boolean;
  generation: number; // 1st gen, 2nd gen...
}