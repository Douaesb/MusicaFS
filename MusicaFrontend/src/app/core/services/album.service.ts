import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthState } from 'src/app/state/auth/auth.reducer';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  private readonly baseUrl = 'http://localhost:8080/api';

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
    return this.userRole === 'ROLE_ADMIN' ? `${this.baseUrl}/admin${prefix}` : `${this.baseUrl}/user${prefix}`;
  }

  getAllAlbums(page: number = 0, size: number = 10, sortBy: string = 'title'): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy);
      return this.http.get<any>(this.getEndpoint('/albums'), { params });
  }


  searchAlbumsByTitle(title: string, page: number = 0, size: number = 10, sortBy: string = 'title'): Observable<any> {
    const params = new HttpParams()
      .set('title', title)
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy);
      return this.http.get<any>(this.getEndpoint('/albums/search'), { params });
  }


  searchAlbumsByArtist(artist: string, page: number = 0, size: number = 10, sortBy: string = 'title'): Observable<any> {
    const params = new HttpParams()
      .set('artist', artist)
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy);

      return this.http.get<any>(this.getEndpoint('/albums/artist'), { params });
  }

 
  filterAlbumsByYear(year: number, page: number = 0, size: number = 10, sortBy: string = 'title'): Observable<any> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy);
      return this.http.get<any>(this.getEndpoint('/albums/year'), { params });
  }


  addAlbum(album: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/admin/albums`, album);
  }

  updateAlbum(id: string, album: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/admin/albums/${id}`, album);
  }

  deleteAlbum(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/albums/${id}`);
  }
}
