import configData from './data/wedding_config.json';

export interface WeddingConfig {
  openingBackgroundImageUrl: string;
  openingSealImageUrl: string;
  openingVideoUrl: string;
  bride: {
    name: string;
    fatherName: string;
    motherName: string;
    imageUrl: string;
    bio: string;
  };
  groom: {
    name: string;
    fatherName: string;
    motherName: string;
    imageUrl: string;
    bio: string;
  };
  weddingDate: string;
  displayDate: string;
  hashtag: string;
  musicUrl: string;
  youtubeEmbedUrl: string;
  envelopeIconUrl?: string;
  thankYouImageUrl?: string;
  heroTagline: string;
  heroImageUrl?: string;
  heroSettings: {
    shloka: string;
    introText: string;
    brideParents: string;
    groomParents: string;
    showPetals: boolean;
    ganeshaIconUrl?: string;
    bgVideoUrl?: string;
  };
  gallerySubtitle: string;
  galleryImages: {
    url: string;
    caption: string;
  }[];
  weddingEvents: {
    eventName: string;
    time: string;
    venueName: string;
    venueAddress: string;
    mapEmbedUrl: string;
    mapDirectionsUrl: string;
    thumbnailUrl?: string;
  }[];
  timeline?: {
    id: string;
    title: string;
    icon: string;
    description: string;
    date: string;
  }[];
  engagementDetails?: {
    time: string;
    mapDirectionsUrl: string;
    venueAddress: string;
    mapEmbedUrl: string;
    venueName: string;
  };
  socialLinks: {
    facebook: string;
    instagram: string;
  };
  familyDetails: {
    message: string;
    welcomingText: string;
    names: string[];
  };
  welcomeMessage: {
    title: string;
    subtitle: string;
    text: string;
  };
}

export const weddingConfig: WeddingConfig = configData as unknown as WeddingConfig;
