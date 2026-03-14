import { Component, inject, input, output, signal, OnInit, AfterViewInit, viewChild, ElementRef } from '@angular/core';
import { FormField, form, required } from '@angular/forms/signals';
import { Task } from '../../interface/task';
import { TasksService } from '../../service/tasks.service';
import { LanguageService } from '../../service/language.service';

@Component({
  selector: 'app-task-form-modal',
  imports: [FormField],
  templateUrl: './task-form-modal.component.html',
  styleUrl: './task-form-modal.component.css',
})
export class TaskFormModalComponent implements OnInit, AfterViewInit {
  private tasksService = inject(TasksService);
  lang = inject(LanguageService);

  task = input<Task | null>(null);
  close = output<void>();
  saved = output<void>();

  formModel = signal({ name: '', description: '', priority: '' });

  taskForm = form(this.formModel, (f) => {
    required(f.name);
    required(f.description);
    required(f.priority);
  });

  descriptionTextarea = viewChild<ElementRef<HTMLTextAreaElement>>('descriptionRef');

  isEdit = signal(false);
  error = signal('');

  ngOnInit() {
    const t = this.task();
    if (t) {
      this.isEdit.set(true);
      this.formModel.set({
        name: t.attributes.name,
        description: t.attributes.description,
        priority: t.attributes.priority,
      });
    }
  }

  ngAfterViewInit() {
    this.autoResizeTextarea();
  }

  autoResizeTextarea() {
    const el = this.descriptionTextarea()?.nativeElement;
    if (el) {
      el.style.height = 'auto';
      el.style.height = el.scrollHeight + 'px';
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();
    if (this.taskForm().invalid()) {
      return;
    }
    this.error.set('');
    const data = this.taskForm().value();

    if (this.isEdit()) {
      const t = this.task()!;
      this.tasksService.updateTask(t.id, data).subscribe({
        next: () => this.saved.emit(),
        error: (err) => this.error.set(err.error?.message ?? this.lang.t().task_form_save_error),
      });
    } else {
      this.tasksService.createTask(data).subscribe({
        next: () => this.saved.emit(),
        error: (err) => this.error.set(err.error?.message ?? this.lang.t().task_form_create_error),
      });
    }
  }
}
