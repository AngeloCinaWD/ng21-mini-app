import { HttpClient, HttpHeaders, httpResource } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { User } from '../interface/user';
import { Error } from '../interface/error';
import { map } from 'rxjs';
import { HTTPHEADERREQUEST } from '../helper/httpHeaderRequest';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private urlJsonPlaceholder = 'https://jsonplaceholder.typicode.com/users';

  private http = inject(HttpClient);

  private users = signal<User[]>([]);

  usersPublic = computed<User[]>(() => this.users());

  usersHttpResource = httpResource<User[]>(() => this.urlJsonPlaceholder);

  usernameUsers = computed<User['username'][]>(() =>
    (this.usersHttpResource.value() ?? []).map((user: User) => user.username)
  );

  private error = signal<Error>({
    status: false,
  });

  errorPublic = computed<Error>(() => this.error());

  private bearer_token = signal<string>('');

  logged = computed<boolean>(
    () => typeof this.bearer_token() === 'string' && this.bearer_token().trim() !== ''
  );

  constructor() {
    this.http
      .get<User[]>(this.urlJsonPlaceholder)
      .pipe(map((users) => users))
      .subscribe({
        next: (data) => this.users.set(data),
        error: (err) =>
          this.error.update((current: Error) => {
            return {
              ...current,
              status: true,
              message: err.message,
            };
          }),
      });

    console.log(this.usersHttpResource.value());
    console.log(this.usersHttpResource.error());
    console.log(this.usersHttpResource.status());
    console.log(this.usersHttpResource.error());
    console.log(this.usersHttpResource.headers());
    console.log(this.usersHttpResource.hasValue());
  }

  login() {
    // const headers = new HttpHeaders({
    //   Accept: 'application/vnd.api+json',
    //   'Content-Type': 'application/vnd.api+json',
    // });

    const data = {
      email: 'angelo@angelo.angelo',
      password: '123456abcd',
    };

    this.http
      .post<{ data: { token: string } }>('http://127.0.0.1:8000/api/login', data, {
        headers: HTTPHEADERREQUEST,
      })
      .subscribe((res) => this.bearer_token.set(res.data.token));
  }

  loggaTasks() {
    // const headers = new HttpHeaders({
    //   Accept: 'application/vnd.api+json',
    //   'Content-Type': 'application/vnd.api+json',
    //   Authorization: `Bearer ${this.bearer_token()}`,
    // });

    this.http
      .get<{ data: { id: string; user: { id: string; name: string } }[] }>(
        'http://127.0.0.1:8000/api/tasks',
        {
          headers: HTTPHEADERREQUEST.set('Authorization', `Bearer ${this.bearer_token()}`),
        }
      )
      .pipe(map((res) => res.data.map((task) => task.user.name)))
      .subscribe({
        next: (res) => console.log(res),
        error: (err) =>
          this.error.update((current: Error) => {
            return {
              ...current,
              status: true,
              message: err.message,
            };
          }),
      });
  }
}
