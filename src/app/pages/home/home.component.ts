import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { TasksService } from '../../service/tasks.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  authService = inject(AuthService);
  tasksService = inject(TasksService);

  today = new Date().toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  ngOnInit() {
    this.tasksService.loadTasks();
  }
}
