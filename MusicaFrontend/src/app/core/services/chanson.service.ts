import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Chanson } from 'src/app/state/chanson/chanson.model';

@Injectable({
  providedIn: 'root',
})
export class ChansonService {
  private apiUrl = 'http://localhost:8080/api/admin/chansons';

  constructor(private http: HttpClient) {}

  getAllChansons(page: number, size: number, sortBy: string): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}?page=${page}&size=${size}&sortBy=${sortBy}`
    );
  }

  searchChansonsByTitle(
    title: string,
    page: number,
    size: number,
    sortBy: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/search?title=${title}&page=${page}&size=${size}&sortBy=${sortBy}`
    );
  }

  getChansonsByAlbumId(
    albumId: string,
    page: number,
    size: number,
    sortBy: string
  ): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/album?albumId=${albumId}&page=${page}&size=${size}&sortBy=${sortBy}`
    );
  }

  createChanson(chanson: Chanson, audioFile: File): Observable<Chanson> {
    const formData = new FormData();
    formData.append('chanson', JSON.stringify(chanson)); 
    formData.append('audioFile', audioFile, audioFile.name);
    return this.http.post<Chanson>(this.apiUrl, formData);
}

updateChanson(id: string, chanson: Chanson, audioFile?: File): Observable<Chanson> {
  const formData = new FormData();
  formData.append('chanson', JSON.stringify(chanson));
  if (audioFile) {
    formData.append('audioFile', audioFile, audioFile.name);
  }
  return this.http.put<Chanson>(`${this.apiUrl}/${id}`, formData);
}

  deleteChanson(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getChansonAudio(audioFileId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/audio/${audioFileId}`, {
      responseType: 'blob',
    });
  }
}
