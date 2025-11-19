export type Phone = {
  id?: number;
  brand: string;
  name: string;
  yearStart: number;
  yearEnd: number | null;
  kept: boolean;
  liked: boolean;
  image: string;
  createdAt?: string;
  updatedAt?: string;

  // Mon avis
  review?: string | null;

  // Réseau
  networkTechnology?: string | null;

  // Lancement
  launchDateInternational?: string | null;
  launchDateFrance?: string | null;

  // Corps
  dimensions?: string | null;
  weight?: string | null;
  sim?: string | null;

  // Écran
  displayType?: string | null;
  displaySize?: string | null;
  displayResolution?: string | null;
  displayProtection?: string | null;

  // Plateforme
  os?: string | null;
  osVersion?: string | null;
  chipset?: string | null;
  cpu?: string | null;
  gpu?: string | null;

  // Mémoire
  internalMemory?: string | null;
  ram?: string | null;

  // Caméra principale
  mainCameraSpecs?: string | null;
  mainCameraVideo?: string | null;

  // Caméra Selfie
  selfieCameraSpecs?: string | null;
  selfieCameraVideo?: string | null;

  // Son
  speakers?: string | null;
  jack35mm?: string | null;

  // Communication
  wlan?: string | null;
  bluetooth?: string | null;
  positioning?: string | null;
  nfc?: string | null;
  infraredPort?: string | null;
  radio?: string | null;
  usb?: string | null;

  // Fonctionnalités
  sensors?: string | null;

  // Batterie
  batteryType?: string | null;
  batteryCapacity?: string | null;

  // Mon téléphone
  myPhoneColor?: string | null;
  myPhoneStorage?: string | null;
};
