import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Chanson } from 'src/app/state/chanson/chanson.model';
import { ChansonService } from 'src/app/core/services/chanson.service';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-player.component.html',
})
export class AudioPlayerComponent {
  @Input() chansons: Chanson[] = [];
  @Input() currentChansonIndex = 0;

  audio: HTMLAudioElement | null = null;
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  volume = 1;

  constructor(private chansonService: ChansonService) {}

  ngOnInit(): void {
    if (this.chansons.length > 0) {
      this.playChanson(this.chansons[this.currentChansonIndex]);
    }
  }

  playChanson(chanson: Chanson): void {
    this.isPlaying = false;
    this.audio?.pause();
    if (chanson.audioFileId) {
      this.chansonService.getChansonAudio(chanson.audioFileId).subscribe((audioFile) => {
        const audioUrl = URL.createObjectURL(audioFile);
        this.audio = new Audio(audioUrl);
        this.audio.volume = this.volume;
        this.audio.play();
        this.isPlaying = true;

        this.audio.onloadedmetadata = () => {
          this.duration = this.audio?.duration || 0;
        };

        this.audio.ontimeupdate = () => this.onTimeUpdate();
        this.audio.onended = () => this.nextChanson();
      });
    }
  }

  onTimeUpdate(): void {
    this.currentTime = this.audio?.currentTime || 0;
  }

  onSeek(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (this.audio) {
      this.audio.currentTime = Number(input.value);
    }
  }

  onVolumeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.volume = Number(input.value);
    if (this.audio) {
      this.audio.volume = this.volume;
    }
  }

  togglePlay(): void {
    if (this.audio) {
      if (this.isPlaying) {
        this.audio.pause();
        this.isPlaying = false;
      } else {
        this.audio.play();
        this.isPlaying = true;
      }
    }
  }

  nextChanson(): void {
    if (this.chansons.length > 0) {
      this.currentChansonIndex = (this.currentChansonIndex + 1) % this.chansons.length;
      this.playChanson(this.chansons[this.currentChansonIndex]);
    }
  }

  previousChanson(): void {
    if (this.chansons.length > 0) {
      this.currentChansonIndex = (this.currentChansonIndex - 1 + this.chansons.length) % this.chansons.length;
      this.playChanson(this.chansons[this.currentChansonIndex]);
    }
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }
}

