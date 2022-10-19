import { Component, Inject } from '@angular/core';
import { getAllGames } from '../fake-api';
import { formatRating } from '@bg-hoard/store/util-formatters';
import { HttpClient } from '@angular/common/http';
import { Game } from '@bg-hoard/util-interface';

@Component({
  selector: 'bg-hoard-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  formatRating = formatRating;
  title = `Dave's board games v2`;
  games = this.http.get<Game[]>(`${this.baseUrl}/api/games`);
  constructor(private http: HttpClient, @Inject('baseUrl') private baseUrl: string) {
    console.log('we need to go faster');
  }
}
