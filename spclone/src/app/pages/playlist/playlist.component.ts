import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HttpClientModule],
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  username: string = '';
  userId: string = '';
  isDropdownOpen: boolean = false;
  favoriteSongs: any[] = [];

  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  currentSong: HTMLAudioElement | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.username = params['username'] || '';
      this.userId = params['userId'] || '';
      this.loadFavoriteSongs();
    });
  }

  loadFavoriteSongs() {
    const apiUrl = `http://localhost:3000/profile`;

    this.http.get<any[]>(apiUrl).subscribe(
      (data: any[]) => {
        this.favoriteSongs = data.filter(favorite => favorite.userId === this.userId);
        console.log('Playlist songs fetched:', this.favoriteSongs);
      },
      (error: any) => {
        console.error('Error fetching playlist songs:', error);
        alert('Failed to load playlist songs.');
      }
    );
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  viewFavorites() {
    this.router.navigate(['/favourites'], { queryParams: { username: this.username, userId: this.userId } });
  }

  viewPlaylist() {
    this.router.navigate(['/playlist'], { queryParams: { username: this.username, userId: this.userId } });
  }

  viewHome() {
    this.router.navigate(['/loginhome'], { queryParams: { username: this.username, userId: this.userId } });
  }

  logout() {
    this.router.navigate(['']);
  }

  playSong(song: any) {
    const audioPlayer = this.audioPlayer?.nativeElement;

    if (!audioPlayer) {
      console.error('Audio player element is not available');
      return;
    }

    if (!song.audio) {
      console.error('No audio URL for this song:', song);
      return;
    }

    if (this.currentSong) {
      this.currentSong.pause();
    }

    audioPlayer.src = song.audio;
    audioPlayer.play()
      .then(() => {
        this.isPlaying = true;
        this.currentSong = audioPlayer;
        this.duration = audioPlayer.duration || 0;
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

  deleteSong(songId: string) {
    if (!songId) {
      console.error('Invalid song ID:', songId);
      alert('Invalid song ID.');
      return;
    }

    const deleteUrl = `http://localhost:3000/profile/${songId}`;
    this.http.delete(deleteUrl).subscribe(
      () => {
        this.favoriteSongs = this.favoriteSongs.filter(favorite => favorite.id !== songId);
        console.log(`Song with ID "${songId}" deleted successfully.`);
      },
      (error: any) => {
        console.error('Error deleting song:', error);
        alert('Failed to delete the song.');
      }
    );
  }
}
