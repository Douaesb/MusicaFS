import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, take } from 'rxjs';
import { Chanson } from 'src/app/state/chanson/chanson.model';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/state/auth/auth.reducer';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class ChansonService {
  private apiUrl = 'http://localhost:8080/api';

  private userRole: string = '';
    constructor(private readonly http: HttpClient , private store: Store<{ auth: AuthState }>) {
      this.store.select(state => state.auth).pipe(
        take(1),
        map(authState => {
          if (authState.token) {
            const decodedToken: any = jwtDecode(authState.token);
            this.userRole = decodedToken.roles?.[0] || '';
          }
        })
      ).subscribe();
    }
  
    private getEndpoint(prefix: string): string {
      return this.userRole === 'ROLE_ADMIN' ? `${this.apiUrl}/admin${prefix}` : `${this.apiUrl}/user${prefix}`;
    }
  

    getAllChansons(page: number, size: number, sortBy: string): Observable<any> {
      const endpoint = this.getEndpoint(`/chansons?page=${page}&size=${size}&sortBy=${sortBy}`);
      return this.http.get<any>(endpoint);
    }


 searchChansonsByTitle(
    title: string,
    page: number,
    size: number,
    sortBy: string
  ): Observable<any> {
    const endpoint = this.getEndpoint(
      `/chansons/search?title=${title}&page=${page}&size=${size}&sortBy=${sortBy}`
    );
    return this.http.get<any>(endpoint);
  }

  getChansonsByAlbumId(
    albumId: string,
    page: number,
    size: number,
    sortBy: string
  ): Observable<any> {
    const endpoint = this.getEndpoint(
      `/chansons/album?albumId=${albumId}&page=${page}&size=${size}&sortBy=${sortBy}`
    );
    return this.http.get<any>(endpoint);
  }

  createChanson(chanson: Chanson, audioFile: File): Observable<Chanson> {
    const formData = new FormData();
    formData.append('chanson', JSON.stringify(chanson)); 
    formData.append('audioFile', audioFile, audioFile.name);
    // formData.forEach((value, key) => {console.log(key + ' ' + value)}); 
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
    const endpoint = this.getEndpoint(`/chansons/audio/${audioFileId}`);
    return this.http.get(endpoint, { responseType: 'blob' });
  }
}
