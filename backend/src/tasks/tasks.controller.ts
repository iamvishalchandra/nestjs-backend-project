import { Controller, Get } from '@nestjs/common';
import { ITask } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}
  @Get()
  getAllTasks(): ITask[] {
    return this.tasksService.getAllTasks();
  }
}
