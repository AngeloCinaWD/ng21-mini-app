import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { LanguageService, Lang } from '../../service/language.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  authService = inject(AuthService);
  lang = inject(LanguageService);

  dropdownOpen = signal(false);

  flags: { lang: Lang; flag: string; label: string }[] = [
    { lang: 'it', flag: '🇮🇹', label: 'Italiano' },
    { lang: 'en', flag: '🇬🇧', label: 'English' },
    { lang: 'es', flag: '🇪🇸', label: 'Español' },
    { lang: 'fr', flag: '🇫🇷', label: 'Français' },
    { lang: 'de', flag: '🇩🇪', label: 'Deutsch' },
  ];

  get currentFlag() {
    return this.flags.find((f) => f.lang === this.lang.currentLang())!;
  }

  get otherFlags() {
    return this.flags.filter((f) => f.lang !== this.lang.currentLang());
  }

  toggleDropdown() {
    this.dropdownOpen.update((v) => !v);
  }

  selectLanguage(lang: Lang) {
    this.lang.setLanguage(lang);
    this.dropdownOpen.set(false);
  }
}
