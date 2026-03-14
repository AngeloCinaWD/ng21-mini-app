import { Component, inject, input, output } from '@angular/core';
import { LanguageService } from '../../service/language.service';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css',
})
export class ConfirmModalComponent {
  lang = inject(LanguageService);
  message = input.required<string>();
  confirm = output<void>();
  cancel = output<void>();
}
