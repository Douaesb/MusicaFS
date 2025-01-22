import { CommonModule } from "@angular/common"
import { Component, type ElementRef, ViewChild } from "@angular/core"
import { FormsModule } from "@angular/forms"
import type { Observable } from "rxjs"
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Store } from "@ngrx/store"
import type { Album } from "src/app/state/album/album.models"
import type { AlbumState } from "src/app/state/album/album.reducer"
import * as AlbumActions from "src/app/state/album/album.action"
import { selectAllAlbums, selectAlbumLoading, selectAlbumError } from "src/app/state/album/album.selectors"

@Component({
  selector: "app-albums",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./albums.component.html",
  styleUrls: ["./albums.component.scss"],
})
export class AlbumsComponent {
  @ViewChild("crudModal") crudModal!: ElementRef

  albums$: Observable<Album[]> = this.store.select(selectAllAlbums)
  loading$: Observable<boolean> = this.store.select(selectAlbumLoading)
  error$: Observable<string | null> = this.store.select(selectAlbumError)

  selectedAlbum: Album | null = null

  newAlbum: Album = {
    title: "",
    artist: "",
    year: null,
  }

  searchTitle = ""
  searchArtist = ""
  filterYear: number | null = null

  private searchTitleSubject = new Subject<string>();
  private searchArtistSubject = new Subject<string>();
  private filterYearSubject = new Subject<number | null>();

  constructor(private store: Store<{ album: AlbumState }>) {}

  ngOnInit(): void {
    this.loadAlbums()

    this.searchTitleSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(title => {
      this.store.dispatch(AlbumActions.searchAlbumsByTitle({ 
        title, 
        page: 0, 
        size: 10, 
        sortBy: 'title' 
      }));
    });

    this.searchArtistSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(artist => {
      this.store.dispatch(AlbumActions.searchAlbumsByArtist({ 
        artist, 
        page: 0, 
        size: 10, 
        sortBy: 'title' 
      }));
    });

    this.filterYearSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(year => {
      if (year !== null) {
        this.store.dispatch(AlbumActions.filterAlbumsByYear({ 
          year, 
          page: 0, 
          size: 10, 
          sortBy: 'title' 
        }));
      } else {
        this.loadAlbums();
      }
    });
  }

  loadAlbums(page: number = 0, size: number = 10, sortBy: string = 'title'): void {
    this.store.dispatch(AlbumActions.loadAlbums({ page, size, sortBy }));
    this.searchTitle = '';
    this.searchArtist = '';
    this.filterYear = null;
  }

  searchByTitle(title: string): void {
    this.searchTitleSubject.next(title);
  }

  searchByArtist(artist: string): void {
    this.searchArtistSubject.next(artist);
  }

  filterByYear(year: number | null): void {
    this.filterYearSubject.next(year);
  }


  openCreateModal(): void {
    this.newAlbum = { title: "", artist: "", year: null }
    this.selectedAlbum = null
    this.showModal()
  }

  openEditModal(album: Album): void {
    this.newAlbum = { ...album }
    this.selectedAlbum = album
    this.showModal()
  }

  closeModal(): void {
    if (this.crudModal) {
      this.crudModal.nativeElement.classList.add("hidden")
    }
  }

  private showModal(): void {
    if (this.crudModal) {
      this.crudModal.nativeElement.classList.remove("hidden")
    }
  }

  saveAlbum(): void {
    if (this.selectedAlbum) {
      this.updateAlbum()
    } else {
      this.addAlbum()
    }
  }

  private addAlbum(): void {
    this.store.dispatch(AlbumActions.addAlbum({ album: this.newAlbum }))
    this.closeModal()
  }

  private updateAlbum(): void {
    if (this.selectedAlbum) {
      const updatedAlbum: Album = { ...this.selectedAlbum, ...this.newAlbum }
      this.store.dispatch(AlbumActions.updateAlbum({ album: updatedAlbum }))
      this.closeModal()
    }
  }

  deleteAlbum(id: string): void {
    this.store.dispatch(AlbumActions.deleteAlbum({ id }))
  }
}
