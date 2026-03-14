import { Component, inject, input, output } from '@angular/core';
import { UserJP } from '../../interface/userJp';
import { LanguageService } from '../../service/language.service';

@Component({
  selector: 'app-user-modal',
  imports: [],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.css',
})
export class UserModalComponent {
  lang = inject(LanguageService);
  user = input.required<UserJP>();
  close = output<void>();
}
