@Injectable()
export class NotificationService {
  // ...inject repos, mailer, sms, etc.

  async resendNotification(logId: number) {
    const log = await this.logRepo.findOne({ where: { id: logId }, relations: ['parent', 'student'] });
    if (!log) throw new NotFoundException('Notification log not found');
    // Re-send as appropriate (email, sms, etc.) and log the new attempt
    // ...
    // Return new status
    return { status: 'resent' };
  }

  async sendReminderToParent(parentId: number, examId: number) {
    // Find parent, get preferred notification channels, send reminder
    // ...
    return { status: 'reminder_sent' };
  }
}