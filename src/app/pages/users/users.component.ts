import { Component, inject } from '@angular/core';
import { UsersService } from '../../service/users-service';

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  usersService = inject(UsersService);
}
