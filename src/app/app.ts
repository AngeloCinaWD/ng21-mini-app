import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UsersService } from './service/users-service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  usersService = inject(UsersService);
}
