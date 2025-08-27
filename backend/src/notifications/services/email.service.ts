import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as Handlebars from 'handlebars';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface EmailOptions {
  to: string | string[];
  subject: string;
  template?: string;
  context?: Record<string, any>;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    path: string;
    contentType?: string;
  }>;
  cc?: string | string[];
  bcc?: string | string[];
  from?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;
  private readonly defaultFrom: string;
  private readonly templatesDir: string;

  constructor(private configService: ConfigService) {
    this.defaultFrom = this.configService.get<string>('EMAIL_FROM') || 'noreply@rexschool.com';
    this.templatesDir = this.configService.get<string>('EMAIL_TEMPLATES_DIR') || 'templates/email';

    // Create transporter
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: this.configService.get<boolean>('EMAIL_SECURE', false),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  /**
   * Verify connection configuration
   */
  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log('Email service connection established successfully');
    } catch (error) {
      this.logger.error(`Failed to establish email service connection: ${error.message}`);
    }
  }

  /**
   * Send an email
   * @param options Email options
   * @returns Information about the sent email
   */
  async sendEmail(options: EmailOptions): Promise<any> {
    try {
      const { to, subject, template, context, html, text, attachments, cc, bcc } = options;

      let htmlContent = html;
      let textContent = text;

      // If template is provided, render it
      if (template) {
        const renderedContent = await this.renderTemplate(template, context || {});
        htmlContent = renderedContent.html;
        textContent = renderedContent.text;
      }

      // Send email
      const result = await this.transporter.sendMail({
        from: options.from || this.defaultFrom,
        to,
        cc,
        bcc,
        subject,
        html: htmlContent,
        text: textContent,
        attachments,
      });

      this.logger.log(`Email sent successfully to ${to}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
      throw error;
    }
  }

  /**
   * Render an email template
   * @param templateName Template name
   * @param context Template context
   * @returns Rendered HTML and text content
   */
  private async renderTemplate(
    templateName: string,
    context: Record<string, any>,
  ): Promise<{ html: string; text: string }> {
    try {
      // Read HTML template
      const htmlTemplate = await fs.readFile(
        path.join(process.cwd(), this.templatesDir, `${templateName}.html`),
        'utf8',
      );

      // Read text template
      let textTemplate: string;
      try {
        textTemplate = await fs.readFile(
          path.join(process.cwd(), this.templatesDir, `${templateName}.txt`),
          'utf8',
        );
      } catch (error) {
        // If text template doesn't exist, use a simple conversion
        textTemplate = htmlTemplate.replace(/<[^>]*>/g, '');
      }

      // Compile templates
      const htmlCompiled = Handlebars.compile(htmlTemplate);
      const textCompiled = Handlebars.compile(textTemplate);

      // Render templates with context
      return {
        html: htmlCompiled(context),
        text: textCompiled(context),
      };
    } catch (error) {
      this.logger.error(`Failed to render template ${templateName}: ${error.message}`);
      throw error;
    }
  }

  /**
   * Send a welcome email to a new user
   * @param email User email
   * @param name User name
   * @param password User password (if applicable)
   * @returns Information about the sent email
   */
  async sendWelcomeEmail(email: string, name: string, password?: string): Promise<any> {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to Rex School Management System',
      template: 'welcome',
      context: {
        name,
        password,
        loginUrl: this.configService.get<string>('FRONTEND_URL') + '/login',
      },
    });
  }

  /**
   * Send a password reset email
   * @param email User email
   * @param name User name
   * @param resetToken Reset token
   * @returns Information about the sent email
   */
  async sendPasswordResetEmail(email: string, name: string, resetToken: string): Promise<any> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL')}/reset-password?token=${resetToken}`;

    return this.sendEmail({
      to: email,
      subject: 'Password Reset Request',
      template: 'password-reset',
      context: {
        name,
        resetUrl,
        expiresIn: '1 hour',
      },
    });
  }

  /**
   * Send a notification about a new document upload
   * @param email User email
   * @param name User name
   * @param documentTitle Document title
   * @param studentName Student name
   * @returns Information about the sent email
   */
  async sendDocumentUploadNotification(
    email: string,
    name: string,
    documentTitle: string,
    studentName: string,
  ): Promise<any> {
    return this.sendEmail({
      to: email,
      subject: `New Document Uploaded: ${documentTitle}`,
      template: 'document-upload',
      context: {
        name,
        documentTitle,
        studentName,
        documentsUrl: this.configService.get<string>('FRONTEND_URL') + '/documents',
      },
    });
  }

  /**
   * Send a notification about a document verification
   * @param email User email
   * @param name User name
   * @param documentTitle Document title
   * @param verificationStatus Verification status
   * @param verificationNotes Verification notes
   * @returns Information about the sent email
   */
  async sendDocumentVerificationNotification(
    email: string,
    name: string,
    documentTitle: string,
    verificationStatus: boolean,
    verificationNotes?: string,
  ): Promise<any> {
    return this.sendEmail({
      to: email,
      subject: `Document Verification: ${documentTitle}`,
      template: 'document-verification',
      context: {
        name,
        documentTitle,
        verificationStatus,
        verificationNotes,
        documentsUrl: this.configService.get<string>('FRONTEND_URL') + '/documents',
      },
    });
  }

  /**
   * Send a bulk email to multiple recipients
   * @param recipients Array of recipient objects with email and context
   * @param subject Email subject
   * @param template Template name
   * @returns Array of results for each recipient
   */
  async sendBulkEmail(
    recipients: Array<{ email: string; context: Record<string, any> }>,
    subject: string,
    template: string,
  ): Promise<any[]> {
    const sendPromises = recipients.map(recipient => 
      this.sendEmail({
        to: recipient.email,
        subject,
        template,
        context: recipient.context,
      })
    );

    return Promise.all(sendPromises);
  }
}

