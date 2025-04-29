import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="spotify-home">
      <header class="header">
        <div class="logo">
          <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" alt="Spotify Logo" />
        </div>
        <a class="login-button" routerLink="/login">Log In</a>
      </header>

      <main class="hero-section">
        <h1>Trending Songs</h1>
        <div class="trending-songs">
          <div class="song-card" *ngFor="let song of trendingSongs">
            <img [src]="song.image" alt="Song Image" class="song-image" />
            <div class="song-details">
              <p class="song-name">{{ song.name }}</p>
              <p class="artist-name">{{ song.artist }}</p>
            </div>
            <button class="play-button" (click)="playSong(song)">Play</button>
          </div>
        </div>

        <!-- Playbar -->
        <div class="playbar" *ngIf="currentSong">
          <!-- Timeline above the controls -->
          <input
            type="range"
            min="0"
            [max]="duration"
            [(ngModel)]="currentTime"
            (input)="seek($event)"
            class="timeline"
          />
          <!-- Play controls -->
          <div class="controls">
            <button (click)="skip(-10)" class="control-button">⏪ 10s</button>
            <button (click)="togglePlay()" class="play-pause-button">
              <ng-container *ngIf="isPlaying; else playIcon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              </ng-container>
              <ng-template #playIcon>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
              </ng-template>
            </button>
            <button (click)="skip(10)" class="control-button">10s ⏩</button>
          </div>
          <!-- Display current time and duration -->
          <div class="time-info">
            <span>{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
          </div>
        </div>

        <audio #audioPlayer controls style="display: none;" (timeupdate)="updateTime()"></audio>
      </main>

      <footer class="footer">
        <p>&copy; 2024 Spotify AB</p>
      </footer>
    </div>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  trendingSongs = [
    {
      name: 'Aaj ki Raat',
      artist: 'Sachin-Jigar',
      image: 'https://images.ottplay.com/images/big/stree-2-new-poster-1721216275.jpeg',
      audio: 'assets/audio/Aaj Ki Raat-(SambalpuriStar.In).mp3'
    },
    {
      name: 'Aayi Nahi',
      artist: 'Sachin-Jigar',
      image: 'https://i.ytimg.com/vi/K3CL3Rb4_E0/maxresdefault.jpg',
      audio: '../../../assets/audio/Aayi Nahi_128-(DJMaza).mp3'
    },
    {
      name: 'Tauba Tauba',
      artist: 'Karan Aujla',
      image: 'https://ca.billboard.com/media-library/vicky-kaushal-and-karan-aujla-tauba-taubaa-from-bad-newz.jpg?id=52824944&width=1200&height=800&quality=90&coordinates=78%2C0%2C122%2C0',
      audio: 'assets/audio/Tauba Tauba-(SambalpuriStar.In).mp3'
    },
    {
      name: 'Let Me Down x Aaja Ve Mahiye',
      artist: 'Custom created',
      image: 'https://tse1.mm.bing.net/th?id=OIP.EU5_mIukT_Nrfiwtjl9U9gHaEK&pid=Api&P=0&h=180',
      audio: 'assets/audio/Let Me Down Slowly x Aaja Ve Mahiya-(SambalpuriStar.In).mp3'
    },
    {
      name: 'Maan Meri Jaan',
      artist: 'King',
      image: 'https://tse4.mm.bing.net/th?id=OIP.Q-PjslM8HugzxHgpLTO25AHaEK&pid=Api&P=0&h=180',
      audio: 'assets/audio/Maan Meri Jaan-(SambalpuriStar.In).mp3'
    },
    {
      name: 'Dil Dooba',
      artist: 'Sonu Nigam',
      image: 'https://i.ytimg.com/vi/gU3fw_c6cf4/maxresdefault.jpg',
      audio: 'assets/audio/Dil Dooba (SoundEdits Hip HopTrap Mix)-(SambalpuriStar.In).mp3'
    },
    {
      name: 'Hamari Adhuri Kahani',
      artist: 'Arijit Singh',
      image: 'https://wallpaperaccess.com/full/12235332.jpg',
      audio: 'spclone/src/assets/audio/Hamari Adhuri Kahani-(SambalpuriStar.In).mp3'
    },
    {
      name: 'Pasoori',
      artist: 'Arijit Singh',
      image: 'https://www.postoast.com/wp-content/uploads/2022/05/pasoori-lyrics-meaning.jpg',
      audio: 'assets/audio/Mere Dhol Judaiyan De-(SambalpuriStar.In).mp3'
    },
    {
      name: 'Heeriye',
      artist: 'Arijit Singh',
      image: 'https://i.ytimg.com/vi/RLzC55ai0eo/maxresdefault.jpg',
      audio: 'assets/audio/Teri Hoke Maraan Jind Jaan Karaan-(SambalpuriStar.In).mp3'
    },
    {
      name: 'Lovely',
      artist: 'Billie Eilish',
      image: 'https://i.ytimg.com/vi/Uy-4f6V17MM/maxresdefault.jpg',
      audio: 'assets/audio/Lovely-(SambalpuriStar.In).mp3'
    }
  ];

  isPlaying = false;
  currentTime = 0;
  duration = 0;
  currentSong: HTMLAudioElement | null = null;

  playSong(song: any) {
    const audioPlayer = this.audioPlayer.nativeElement;

    if (this.currentSong) {
      this.currentSong.pause();
    }

    audioPlayer.src = song.audio;
    audioPlayer.play()
      .then(() => {
        this.isPlaying = true;
        this.currentSong = audioPlayer;
        this.duration = audioPlayer.duration;
        audioPlayer.onended = () => this.resetPlayer();
      })
      .catch(error => {
        console.error('Error playing audio:', error);
      });
  }

  togglePlay() {
    if (this.currentSong) {
      if (this.isPlaying) {
        this.currentSong.pause();
      } else {
        this.currentSong.play();
      }
      this.isPlaying = !this.isPlaying;
    }
  }

  skip(seconds: number) {
    if (this.currentSong) {
      this.currentSong.currentTime = Math.min(
        Math.max(0, (this.currentSong.currentTime || 0) + seconds),
        this.duration
      );
    }
  }

  updateTime() {
    if (this.currentSong) {
      this.currentTime = this.currentSong.currentTime || 0;
    }
  }

  seek(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = Number(target.value);
    if (this.currentSong) {
      this.currentSong.currentTime = value;
    }
  }

  resetPlayer() {
    this.isPlaying = false;
    this.currentTime = 0;
    this.duration = 0;
    this.currentSong = null;
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}
