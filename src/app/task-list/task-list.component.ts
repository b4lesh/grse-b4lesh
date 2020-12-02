import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Task } from '../interfaces/task';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CrudService } from '../services/crud.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit, OnDestroy {
  currentUser: string;

  subscription: Subscription | null = null; // Подписка для taskList
  taskList: Array<Task> = []; // Полный список задач

  searchText = ''; // Поле для поиска задач
  sortDateStart = ''; // Поле для ввода начальной даты для фильтрации списка
  sortDateEnd = ''; // Тоже самое поле только для конечной даты
  sortOrder: 'text' | 'isDone' | 'dateCreated' = 'dateCreated'; // Принимает какое поле сортировать
  directionSort: 'asc' | 'desc' = 'asc';

  idTaskChange = ''; // ID задачи которую хотим изменить
  isUnhideAddChangeTaskContainer = false; // Отвечает за отображение секции для записи/редактировании новой задачи
  addChangeTaskGroup: FormGroup; // Объединяет одно поле ввода или изменения задачи
  btnInputName: 'Добавить' | 'Сохранить' | undefined; // Что отображается на кнопке
  action: 'add' | 'change' | undefined; // Какое действие выполнится при нажатии кнопки

  constructor(
    private formBuilder: FormBuilder,
    private crudService: CrudService,
    private auth: AuthenticationService
  ) {
    this.currentUser = (this.auth.getCurrentUser() as string).toLowerCase();

    this.addChangeTaskGroup = this.formBuilder.group({
      taskText: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.subscription = this.crudService
      .getAllTasks(this.currentUser)
      .subscribe((data) => {
        this.taskList = data.map((element: any) => {
          const task = element.payload.doc.data();
          task.dateCreated = task.dateCreated.toDate();
          task.id = element.payload.doc.id;
          return task;
        });
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  displayInputTaskContainer(
    action: 'add' | 'change',
    id?: string,
    originalText?: string
  ): void {
    this.isUnhideAddChangeTaskContainer = true;
    this.action = action;
    if (action === 'add') {
      this.btnInputName = 'Добавить';
      this.addChangeTaskGroup.patchValue({ taskText: '' });
    } else if (action === 'change') {
      this.btnInputName = 'Сохранить';
      this.idTaskChange = id as string;
      this.addChangeTaskGroup.patchValue({ taskText: originalText });
    }
  }

  addChangeTextTask(): void {
    const currentDate = new Date();
    currentDate.setSeconds(0, 0);
    if (this.action === 'add') {
      const newTask: {
        text: string;
        isDone: boolean;
        dateCreated: Date;
        username: string;
      } = {
        text: this.addChangeTaskGroup.value.taskText,
        isDone: false,
        dateCreated: currentDate,
        username: this.currentUser,
      };
      this.crudService.addTask(newTask).catch((error) => console.error(error));
    } else if (this.action === 'change') {
      // TODO: объявлять конкретно change или можно просто else
      const id = this.idTaskChange;
      const modifiedTextTask = {
        text: this.addChangeTaskGroup.value.taskText,
      };
      this.crudService
        .updateTask(id, modifiedTextTask)
        .catch((error) => console.error(error));
    }
    this.addChangeTaskGroup.patchValue({ taskText: '' });
    this.isUnhideAddChangeTaskContainer = false;
  }

  changeIsDoneTask(id: string, currentIsDone: boolean): void {
    const modifiedIsDoneTask = {
      isDone: !currentIsDone,
    };
    this.crudService
      .updateTask(id, modifiedIsDoneTask)
      .catch((error) => console.error(error));
  }

  deleteTask(id: string): void {
    this.crudService.deleteTask(id).catch((error) => console.error(error));
    this.isUnhideAddChangeTaskContainer = false;
  }

  sortTable(sortOrder: 'isDone' | 'text' | 'dateCreated'): void {
    if (this.sortOrder === sortOrder) {
      this.directionSort = this.directionSort === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortOrder = sortOrder;
      this.directionSort = 'asc';
    }
    this.crudService.setSortQuery(this.sortOrder, this.directionSort);
  }

  setSearchText(): void {
    this.crudService.setSearchQuery(this.searchText);
  }

  changeDate(): void {
    this.crudService.setDate(this.sortDateStart, this.sortDateEnd);
  }
}
