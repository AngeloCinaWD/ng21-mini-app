import { computed, Injectable, signal } from '@angular/core';
import translations from '../language/translations.json';

export type Lang = 'it' | 'en' | 'es' | 'fr' | 'de';

type TranslationKeys = keyof typeof translations.it;
type Translations = { [K in TranslationKeys]: string };

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private allTranslations = translations as Record<Lang, Translations>;

  currentLang = signal<Lang>('it');

  t = computed<Translations>(() => this.allTranslations[this.currentLang()]);

  setLanguage(lang: Lang) {
    this.currentLang.set(lang);
  }
}
