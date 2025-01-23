import { CommonModule } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { FormsModule } from "@angular/forms"
import  { ActivatedRoute, Router } from "@angular/router"
import {  Observable } from "rxjs"
import  { Store } from "@ngrx/store"
import { Chanson } from "src/app/state/chanson/chanson.model"
import {  selectChansonLoading, selectChansonsByAlbumId, selectPagination } from "src/app/state/chanson/chanson.selectors"
import { createChanson, deleteChanson, loadChansons, loadChansonsByAlbumId, updateChanson } from "src/app/state/chanson/chanson.actions"


@Component({
  selector: "app-tracklist",
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: "./track-list.component.html",
  styleUrls: [],
})
export class TrackListComponent implements OnInit {
  chansons$: Observable<Chanson[]> = this.store.select(selectChansonsByAlbumId);
  loading$: Observable<boolean> = this.store.select(selectChansonLoading);
  pagination$ = this.store.select(selectPagination);
  currentPage = 0;
  pageSize = 10;
  showModal = false;
  selectedChanson: Chanson = {} as Chanson;
  audioFile: File | null = null;
  albumId: string | null = null;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.albumId = this.route.snapshot.paramMap.get('albumId');
    if (this.albumId) {
      this.loadPage(this.currentPage);
    }
  }

  loadPage(page: number): void {
    if (this.albumId) {
      this.store.dispatch(loadChansonsByAlbumId({ 
        albumId: this.albumId, 
        page: page, 
        size: this.pageSize, 
        sortBy: 'title' 
      }));
      this.currentPage = page;
    }
  }

  onPageChange(page: number): void {
    this.loadPage(page);
  }
  
  openAddModal(): void {
    this.showModal = true;
    this.selectedChanson = {
      title: '',
      trackNumber: 0,
      duree: '',
      description: '',
      categorie: '',
      albumId: this.albumId ?? '',
      dateAjout: new Date().toISOString(),
    };
    this.audioFile = null; 
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.audioFile = input.files[0];
    }
  }

  viewTracks(albumId: string): void {
    this.router.navigate(['/album', albumId, 'tracks']);
  }

  editChanson(chanson: Chanson): void {
    this.selectedChanson = { ...chanson }; 
    this.showModal = true;
  }

  deleteChanson(id: string): void {
    if (confirm('Are you sure you want to delete this track?')) {
      this.store.dispatch(deleteChanson({ id }));
    }
  }

  onSubmit(): void {
    if (!this.selectedChanson.title || !this.selectedChanson.trackNumber || !this.selectedChanson.duree) {
      console.error('Title, track number, and duration are required for a track');
      return; 
    }
  
    console.log('Selected Chanson:', this.selectedChanson); 
    console.log('Audio File:', this.audioFile);
  
    if (!this.selectedChanson.albumId && this.albumId) {
      this.selectedChanson.albumId = this.albumId; 
    }
  
    if (this.selectedChanson.id) {
      this.store.dispatch(updateChanson({ chanson: this.selectedChanson }));
    } else {
      if (this.audioFile) {
        this.store.dispatch(createChanson({
          chanson: { ...this.selectedChanson, id: undefined }, 
          audioFile: this.audioFile
        }));
      } else {
        console.error('Audio file is required');
      }
    }
  
    this.closeModal();
  }
  
  

  closeModal(): void {
    this.showModal = false;
    this.selectedChanson = {} as Chanson; 
  }
}
