import { Body, Controller, HttpCode, Post, Query } from '@nestjs/common';
import { NotificationEntity } from '../../entities/notification.entity';
import { NotificationsService } from '../../services/notifications/notifications.service';
import { PageDto } from '../../entities/page.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationService: NotificationsService) {}

  @Post('all')
  @HttpCode(200)
  async findAll(
    @Body() { date }: { date: Date },
    @Query('pageNo') pageNo: number
  ): Promise<PageDto<NotificationEntity>> {
    return this.notificationService.findAll(date, pageNo);
  }

  @Post()
  async create(
    @Body() notificaion: NotificationEntity
  ): Promise<NotificationEntity> {
    const createdNotification = await this.notificationService.create(
      notificaion
    );
    return createdNotification;
  }
}
