import { Component, input, output } from '@angular/core';
import { UserJP } from '../../interface/userJp';

@Component({
  selector: 'app-user-modal',
  imports: [],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.css',
})
export class UserModalComponent {
  user = input.required<UserJP>();
  close = output<void>();
}
