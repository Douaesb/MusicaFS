import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Album } from 'src/app/state/album/album.models';
import { AlbumState } from 'src/app/state/album/album.reducer';
import * as AlbumActions from 'src/app/state/album/album.action';
import * as AuthActions from 'src/app/state/auth/auth.action';

import {
  selectAllAlbums,
  selectAlbumLoading,
  selectAlbumError,
} from 'src/app/state/album/album.selectors';
import { Router } from '@angular/router';
import { AuthState } from 'src/app/state/auth/auth.reducer';
import { selectIsAdmin } from 'src/app/state/auth/auth.selectors';

@Component({
  selector: 'app-albums',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss'],
})
export class AlbumsComponent {
  @ViewChild('crudModal') crudModal!: ElementRef;

  isAdmin$: Observable<boolean>;

  albums$: Observable<Album[]> = this.store.select(selectAllAlbums);
  loading$: Observable<boolean> = this.store.select(selectAlbumLoading);
  error$: Observable<string | null> = this.store.select(selectAlbumError);

  selectedAlbum: Album | null = null;
  newAlbum: Album = { title: '', artist: '', year: null };

  searchType: string = 'title';
  searchQuery: string = '';
  filterYear: number | null = null;

  private searchTitleSubject = new Subject<string>();
  private searchArtistSubject = new Subject<string>();
  private filterYearSubject = new Subject<number | null>();

  constructor(
    private store: Store<{ album: AlbumState }>,
    private readonly storeAuth: Store<{ auth: AuthState }>,
    private router: Router
  ) {
    this.isAdmin$ = this.storeAuth.select(selectIsAdmin);
  }

  ngOnInit(): void {
    this.loadAlbums();

    // Search logic for title
    this.searchTitleSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((title) => {
        this.store.dispatch(
          AlbumActions.searchAlbumsByTitle({
            title,
            page: 0,
            size: 10,
            sortBy: 'title',
          })
        );
      });

    // Search logic for artist
    this.searchArtistSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((artist) => {
        this.store.dispatch(
          AlbumActions.searchAlbumsByArtist({
            artist,
            page: 0,
            size: 10,
            sortBy: 'title',
          })
        );
      });

    // Listen to year filter changes
    this.filterYearSubject
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((year) => {
        if (year !== null) {
          this.store.dispatch(
            AlbumActions.filterAlbumsByYear({
              year,
              page: 0,
              size: 10,
              sortBy: 'title',
            })
          );
        } else {
          this.loadAlbums();
        }
      });
  }

  loadAlbums(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'title'
  ): void {
    this.store.dispatch(AlbumActions.loadAlbums({ page, size, sortBy }));
    this.searchQuery = ''; // Reset search query
    this.filterYear = null;
  }

  onSearch() {
    if (this.searchType === 'title') {
      this.searchByTitle(this.searchQuery);
    } else if (this.searchType === 'artist') {
      this.searchByArtist(this.searchQuery);
    }
  }

  onSearchTypeChange() {
    this.searchQuery = '';
  }

  searchByTitle(title: string): void {
    this.searchTitleSubject.next(title);
  }

  searchByArtist(artist: string): void {
    if (artist) {
      this.searchArtistSubject.next(artist);
    } else {
      this.loadAlbums();
    }
  }
  filterByYear(year: number | null): void {
    this.filterYearSubject.next(year);
  }

  openCreateModal(): void {
    this.newAlbum = { title: '', artist: '', year: null };
    this.selectedAlbum = null;
    this.showModal();
  }

  openEditModal(album: Album): void {
    this.newAlbum = { ...album };
    this.selectedAlbum = album;
    this.showModal();
  }

  closeModal(): void {
    if (this.crudModal) {
      this.crudModal.nativeElement.classList.add('hidden');
    }
  }

  private showModal(): void {
    if (this.crudModal) {
      this.crudModal.nativeElement.classList.remove('hidden');
    }
  }

  saveAlbum(): void {
    if (this.selectedAlbum) {
      this.updateAlbum();
    } else {
      this.addAlbum();
    }
  }

  private addAlbum(): void {
    this.store.dispatch(AlbumActions.addAlbum({ album: this.newAlbum }));
    this.closeModal();
  }

  private updateAlbum(): void {
    if (this.selectedAlbum) {
      const updatedAlbum: Album = { ...this.selectedAlbum, ...this.newAlbum };
      this.store.dispatch(AlbumActions.updateAlbum({ album: updatedAlbum }));
      this.closeModal();
    }
  }

  deleteAlbum(id: string): void {
    this.store.dispatch(AlbumActions.deleteAlbum({ id }));
  }

  viewTracks(selectedAlbumId: string): void {
    this.router.navigate(['/album', selectedAlbumId, 'tracks']);
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
