export enum PackagingStyle {
  FUTURISTIC = "Futuristic",
  POP_ART = "Pop Art",
  VINTAGE_WOODEN = "Vintage Wooden",
  NEO_MODERNIST = "Neo-Modernist",
  URBAN_COLLECTIBLE = "Urban Collectible",
  INDUSTRIAL_BRUTALIST = "Industrial Brutalist",
  LEGO_ICONIC = "LEGO Iconic",
  MATTEL_VIBRANT = "Mattel Vibrant",
  HASBRO_CINEMATIC = "Hasbro Cinematic",
  TOYSRUS_PLAYFUL = "Toys R Us Playful",
  POPMART_COLLECTIBLE = "Pop Mart Collectible",
  ZURU_VIBRANT = "ZURU Vibrant",
}

export interface ToyAnalysis {
  name: string;
  description: string;
  category: string;
  targetAudience: string;
}

export interface DesignResult {
  imageUrl: string;
  prompt: string;
}
