import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ETaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({ getTasks: jest.fn(), findOne: jest.fn() });
const mockUser = {
  name: 'user',
  id: 'randomId',
  password: 'password',
  tasks: [],
};

describe('TaskServices', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository },
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  });

  describe('getTasks', () => {
    it('calls tasksRepository.getTasks and returns their result', async () => {
      tasksRepository.getTasks.mockResolvedValue('Tasks');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('Tasks');
    });
  });

  describe('getTasksById', () => {
    it('calls TasksRepository.findOne and returns result', async () => {
      const mockTask = {
        title: 'Test',
        description: 'Test description.',
        id: 'taskId',
        status: ETaskStatus.OPEN,
      };

      tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('taskId', mockUser);
      expect(result).toEqual(mockTask);
    });
    it('calls TasksRepository.findOne and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('taskId', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
