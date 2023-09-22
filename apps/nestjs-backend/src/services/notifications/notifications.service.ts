import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationEntity } from '../../entities/notification.entity';
import { LessThan, Repository } from 'typeorm';
import { PageDto } from '../../entities/page.dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>
  ) {}

  async findAll(date: Date, pageNo = 0): Promise<PageDto<NotificationEntity>> {
    const pageSize = 10;
    const [notifications, totalCount] =
      await this.notificationRepository.findAndCount({
        where: {
          date: LessThan(date),
        },
        order: {
          date: 'DESC',
        },
        skip: +pageNo * pageSize,
        take: pageSize,
      });

    const totalPages = Math.ceil(totalCount / pageSize);
    const last = (+pageNo + 1) * pageSize > totalCount;

    const pageDto = new PageDto<NotificationEntity>({
      content: notifications,
      pageNo: +pageNo,
      pageSize,
      totalPages,
      totalElements: totalCount,
      last,
    });

    return pageDto;
  }

  async create(
    notification: Partial<NotificationEntity>
  ): Promise<NotificationEntity> {
    const newNotification = this.notificationRepository.create(notification);
    return this.notificationRepository.save(newNotification);
  }
}
