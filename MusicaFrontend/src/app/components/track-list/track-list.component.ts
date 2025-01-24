import { CommonModule } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { FormsModule } from "@angular/forms"
import  { ActivatedRoute, Router } from "@angular/router"
import {  map, Observable } from "rxjs"
import  { Store } from "@ngrx/store"
import { Chanson } from "src/app/state/chanson/chanson.model"
import {  selectChansonLoading, selectChansonsByAlbumId, selectPagination } from "src/app/state/chanson/chanson.selectors"
import { createChanson, deleteChanson, loadChansons, loadChansonsByAlbumId, searchChansonsByTitle, updateChanson } from "src/app/state/chanson/chanson.actions"
import { AudioPlayerComponent } from "../audio-player/audio-player.component"


@Component({
  selector: "app-tracklist",
  standalone: true,
  imports: [FormsModule, CommonModule, AudioPlayerComponent],
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
  searchQuery = ""
  currentChansonIndex = 0;

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


playTrack(index: number): void {
  this.currentChansonIndex = index;
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

  // searchChansons(page: number): void {
  //   this.store.dispatch(
  //     searchChansonsByTitle({
  //       title: this.searchQuery,
  //       page: page,
  //       size: this.pageSize,
  //       sortBy: "title",
  //     }),
  //   )
  // }
  

  searchChansons(page: number): void {
    this.store.dispatch(
      searchChansonsByTitle({
        title: this.searchQuery,
        page: page,
        size: this.pageSize,
        sortBy: "title",
      })
    );

    // Combine search results with album filter
    this.chansons$ = this.store.select(selectChansonsByAlbumId).pipe(
      map((chansons) =>
        this.albumId
          ? chansons.filter((chanson) => chanson.albumId === this.albumId)
          : chansons
      )
    );
  }


  onSearch(): void {
    this.currentPage = 0
    this.searchChansons(this.currentPage)
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
      
      const audio = new Audio(URL.createObjectURL(this.audioFile));
      audio.addEventListener('loadedmetadata', () => {
        const durationInSeconds = Math.floor(audio.duration);
        this.selectedChanson.duree = durationInSeconds.toString(); 
        console.log('Audio Duration:', durationInSeconds);
      });
    }
  }  
  
  viewTracks(albumId: string): void {
    this.router.navigate(['/album', albumId, 'tracks']);
  }

 editChanson(chanson: Chanson): void {
    this.selectedChanson = { ...chanson }; 
    this.audioFile = null; 
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
      this.store.dispatch(updateChanson({ 
        chanson: this.selectedChanson,
        audioFile: this.audioFile || undefined 
      }));
    } else {
      if (this.audioFile) {
        this.store.dispatch(createChanson({
          chanson: { ...this.selectedChanson, id: undefined }, 
          audioFile: this.audioFile
        }));
      } else {
        console.error('Audio file is required for new tracks');
      }
    }
  
    this.closeModal();
  }
  
  
  

  closeModal(): void {
    this.showModal = false;
    this.selectedChanson = {} as Chanson; 
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
}
