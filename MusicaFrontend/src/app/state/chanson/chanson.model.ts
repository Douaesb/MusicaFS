export interface Chanson {
  id?: string;
  title: string;
  duree: string;
  trackNumber: number; 
  description: string;
  categorie: string;
  albumId: string;
  audioFileId?: string; 
  dateAjout: string; 
}
