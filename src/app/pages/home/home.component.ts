import { Component, inject } from '@angular/core';
import { UsersService } from '../../service/users-service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  usersService = inject(UsersService);
  authService = inject(AuthService);
}
