import { Component, input, output } from '@angular/core';
import { User } from '../../interface/user';

@Component({
  selector: 'app-user-modal',
  imports: [],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.css',
})
export class UserModalComponent {
  user = input.required<User>();
  close = output<void>();
}
