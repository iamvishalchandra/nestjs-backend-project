import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { ETaskStatus } from './task-status.enum';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async getTasks({ search, status }: GetTasksFilterDto): Promise<Task[]> {
    const query = this.createQueryBuilder('task');

    if (status) query.andWhere('task.status = :status', { status });

    if (search)
      query.andWhere(
        'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
        { search: `%${search}%` },
      );

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask({ title, description }: CreateTaskDto): Promise<Task> {
    const task = this.create({ title, description, status: ETaskStatus.OPEN });
    await this.save(task);
    return task;
  }
}