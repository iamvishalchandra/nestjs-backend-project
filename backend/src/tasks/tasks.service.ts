import { Injectable } from '@nestjs/common';
import { ITask, ETaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: ITask[] = [];

  getAllTasks(): ITask[] {
    return this.tasks;
  }

  getFilteredTasks({ status, search }: GetTasksFilterDto): ITask[] {
    let tasks = this.getAllTasks();
    if (status)
      tasks = tasks.filter(
        (task) => task.status.toLowerCase() === status.toLowerCase(),
      );
    if (search)
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.title.toLowerCase().includes(search.toLowerCase()),
      );
    return tasks;
  }

  getTaskById(id: string): ITask {
    return this.tasks.find((task) => task.id === id);
  }

  createTask({ title, description }: CreateTaskDto): ITask {
    const task: ITask = {
      id: uuid(),
      title: title,
      description: description,
      status: ETaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  deleteTaskById(id: string): void {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  updateTaskStatus(id: string, status: ETaskStatus): ITask {
    const task: ITask = this.getTaskById(id);
    // const newTasks: ITask[] = this.tasks.filter((task) => task.id !== id);
    task.status = status;
    // newTasks.push(task);
    // this.tasks = newTasks;
    return task;
  }
}
