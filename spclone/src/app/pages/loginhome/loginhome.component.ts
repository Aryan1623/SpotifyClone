import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HttpClientModule],
  templateUrl: './Loginhome.component.html',
  styleUrls: ['./Loginhome.component.css']
})
export class LoginhomeComponent implements OnInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  username: string = '';
  userId: string = '';
  isDropdownOpen: boolean = false;

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
      audio: 'assets/audio/Aayi Nahi_128-(DJMaza).mp3'
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

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // Retrieve query parameters
    this.route.queryParams.subscribe(params => {
      this.username = params['username'] || 'Guest';
      this.userId = params['userId'] || 'Unknown ID';
    });
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

  addSongToFavorites(song: any) {
    // Step 1: Fetch existing favorites for the user
    this.http.get<any[]>(`http://localhost:3000/posts?userId=${this.userId}`).subscribe(
      (favorites) => {
        // Step 2: Check for duplicates based on 'song.name' and 'song.artist'
        const isDuplicate = favorites.some(fav =>
          fav.song.name === song.name && fav.song.artist === song.artist
        );

        if (isDuplicate) {
          alert('This song is already in your favorites!');
          return;
        }

        // Step 3: Add the song if it's not a duplicate
        const favoriteData = {
          id: this.generateUniqueId(), // Ensure unique ID
          userId: this.userId,         // Dynamic userId
          song: song                   // Song data
        };

        this.http.post('http://localhost:3000/posts', favoriteData).subscribe(
          response => {
            console.log('Song added to favorites:', response);
            alert('Song added to favorites successfully!');
          },
          error => {
            console.error('Error adding song to favorites:', error);
            alert('Failed to add song to favorites.');
          }
        );
      },
      error => {
        console.error('Error fetching favorites:', error);
        alert('Failed to check for duplicate entries.');
      }
    );
  }

  // Helper function to generate a unique ID (you can replace this with any UUID generator)
  generateUniqueId(): string {
    return Math.random().toString(36).substring(2, 10); // Generates a random string
  }

  addSongToPlaylist(song: any) {
    // Step 1: Fetch existing songs in the playlist for the current user
    this.http.get<any[]>(`http://localhost:3000/profile?userId=${this.userId}`).subscribe(
      (playlist) => {
        // Step 2: Check for duplicates based on 'song.name' and 'song.artist'
        const isDuplicate = playlist.some(item =>
          item.song.name === song.name && item.song.artist === song.artist
        );

        if (isDuplicate) {
          alert('This song is already in your playlist!');
          return;
        }

        // Step 3: Add the song if it's not a duplicate
        const playlistData = {
          id: this.generateUniqueId(), // Generate unique ID for the playlist entry
          userId: this.userId,         // Dynamic userId
          song: song                   // Song data
        };

        this.http.post('http://localhost:3000/profile', playlistData).subscribe(
          response => {
            console.log('Song added to playlist:', response);
            alert('Song added to playlist successfully!');
          },
          error => {
            console.error('Error adding song to playlist:', error);
            alert('Failed to add song to playlist.');
          }
        );
      },
      error => {
        console.error('Error fetching playlist:', error);
        alert('Failed to check for duplicate entries.');
      }
    );
  }




}

