import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  private readonly baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAllAlbums(page: number = 0, size: number = 10, sortBy: string = 'title'): Observable<any> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy);

    return this.http.get<any>(`${this.baseUrl}/admin/albums`, { params });
  }


  searchAlbumsByTitle(title: string, page: number = 0, size: number = 10, sortBy: string = 'title'): Observable<any> {
    const params = new HttpParams()
      .set('title', title)
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy);

    return this.http.get<any>(`${this.baseUrl}/admin/albums/search`, { params });
  }


  searchAlbumsByArtist(artist: string, page: number = 0, size: number = 10, sortBy: string = 'title'): Observable<any> {
    const params = new HttpParams()
      .set('artist', artist)
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy);

    return this.http.get<any>(`${this.baseUrl}/admin/albums/artist`, { params });
  }

 
  filterAlbumsByYear(year: number, page: number = 0, size: number = 10, sortBy: string = 'title'): Observable<any> {
    const params = new HttpParams()
      .set('year', year.toString())
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy);

    return this.http.get<any>(`${this.baseUrl}/admin/albums/year`, { params });
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
