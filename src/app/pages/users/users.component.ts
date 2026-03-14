import { Component, inject, signal } from '@angular/core';
import { UsersService } from '../../service/users-service';
import { UserModalComponent } from '../../components/user-modal/user-modal.component';
import { LanguageService } from '../../service/language.service';
import { UserJP } from '../../interface/userJp';

@Component({
  selector: 'app-users',
  imports: [UserModalComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  usersService = inject(UsersService);
  lang = inject(LanguageService);

  selectedUser = signal<UserJP | null>(null);

  openUserDetail(userId: number) {
    this.usersService.getUserById(userId).subscribe((user) => {
      this.selectedUser.set(user);
    });
  }

  closeModal() {
    this.selectedUser.set(null);
  }
}
