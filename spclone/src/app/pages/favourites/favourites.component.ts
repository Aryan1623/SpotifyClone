import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HttpClientModule],
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavoritesComponent implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  username: string = ''; // Will be set from query parameters
  userId: string = ''; // Will be set from query parameters
  isDropdownOpen: boolean = false;
  favoriteSongs: any[] = []; // Array to store favorite songs

  isPlaying = false;
  currentTime = 0;
  duration = 0;
  currentSong: HTMLAudioElement | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Retrieve username and userId from the query parameters
    this.route.queryParams.subscribe(params => {
      this.username = params['username'] || '';
      this.userId = params['userId'] || '';

      // Fetch favorite songs for the logged-in user
      this.loadFavoriteSongs();
    });
  }

  loadFavoriteSongs() {
    const apiUrl = `http://localhost:3000/posts`; // Replace with your actual API endpoint

    this.http.get<any[]>(apiUrl).subscribe(
      (data: any[]) => {
        // Filter the favorite songs associated with the logged-in user
        this.favoriteSongs = data
          .filter(favorite => favorite.userId === this.userId) // Filter by userId
          .map(favorite => ({ ...favorite.song, id: favorite.id })); // Include song and post ID

        // Log the fetched favorite songs for debugging
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

  deleteSong(songId: string) {
    const deleteUrl = `http://localhost:3000/posts/${songId}`; // API endpoint to delete a song
    this.http.delete(deleteUrl).subscribe(
      () => {
        // Update the local favoriteSongs array after deletion
        this.favoriteSongs = this.favoriteSongs.filter(song => song.id !== songId);
        console.log(`Song with id "${songId}" deleted successfully.`);
      },
      (error: any) => {
        console.error('Error deleting song:', error);
        alert('Failed to delete the song.');
      }
    );
  }

  playSong(song: any) {
    const audioPlayer = this.audioPlayer?.nativeElement;

    if (!audioPlayer) {
      console.error('Audio player element is not available');
      return;
    }

    if (this.currentSong) {
      this.currentSong.pause();
    }

    audioPlayer.src = song.audio; // Use the audio URL from the song object
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
}

