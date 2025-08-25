import { MailerService } from '@nestjs-modules/mailer'; // or your email service
// ... other imports ...

@Injectable()
export class RegistrationsService {
  // Inject MailerService, NotificationService, etc.
  constructor(
    @InjectRepository(Registration) private repo: Repository<Registration>,
    private studentsService: StudentsService,
    private mailer: MailerService,
    // ...other services (e.g. NotificationService, PdfService, EventService)...
  ) {}

  // ...existing code...

  async updateStatus(id: number, dto: UpdateRegistrationStatusDto) {
    const reg = await this.repo.findOne({ where: { id }, relations: ['desired_class', 'desired_section'] });
    if (!reg) throw new NotFoundException();
    reg.status = dto.status;
    reg.admin_note = dto.admin_note ?? reg.admin_note;
    await this.repo.save(reg);

    // If accepted, auto-create student and send onboarding
    if (dto.status === 'accepted') {
      const student = await this.studentsService.create({
        // ...map fields as before...
      });

      // 1. Send welcome email
      if (reg.email) {
        await this.mailer.sendMail({
          to: reg.email,
          subject: 'Welcome to EDU-WISE!',
          text: `Dear ${reg.applicant_name}, your registration has been accepted. Your student ID: ${student.id}`,
          html: `<p>Dear ${reg.applicant_name},<br>Your registration has been accepted. Your student ID: <b>${student.id}</b></p>`,
        });
      }

      // 2. Generate student ID card (PDF) and store/send
      // await pdfService.generateStudentIdCard(student);

      // 3. (Optional) Schedule orientation meeting
      // await eventService.createOrientation(student);

      // 4. (Optional) Send SMS using NotificationService
      // await notificationService.sendSms({...});
    }

    return reg;
  }
}