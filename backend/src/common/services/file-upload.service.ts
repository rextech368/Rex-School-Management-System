import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync } from 'fs';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs/promises';
import * as mime from 'mime-types';

export interface FileUploadOptions {
  allowedMimeTypes?: string[];
  maxFileSize?: number; // in bytes
  customFileName?: string;
  subDirectory?: string;
}

export interface UploadedFileInfo {
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
}

@Injectable()
export class FileUploadService {
  private readonly uploadDir: string;
  private readonly baseUrl: string;
  
  // Default options
  private readonly defaultOptions: FileUploadOptions = {
    allowedMimeTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
    ],
    maxFileSize: 10 * 1024 * 1024, // 10MB
  };

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR') || 'uploads';
    this.baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost:3000';
    
    // Ensure upload directory exists
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Upload a file to the server
   * @param file The file to upload
   * @param options Upload options
   * @returns Information about the uploaded file
   */
  async uploadFile(
    file: Express.Multer.File,
    options: FileUploadOptions = {},
  ): Promise<UploadedFileInfo> {
    // Merge default options with provided options
    const mergedOptions = { ...this.defaultOptions, ...options };
    
    // Validate file
    this.validateFile(file, mergedOptions);
    
    // Create subdirectory if specified
    const targetDir = mergedOptions.subDirectory 
      ? join(this.uploadDir, mergedOptions.subDirectory)
      : this.uploadDir;
    
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }
    
    // Generate unique filename or use custom one
    const fileExtension = extname(file.originalname);
    const fileName = mergedOptions.customFileName 
      ? `${mergedOptions.customFileName}${fileExtension}`
      : `${uuidv4()}${fileExtension}`;
    
    const filePath = join(targetDir, fileName);
    
    try {
      // Write file to disk
      await fs.writeFile(filePath, file.buffer);
      
      // Generate URL
      const relativePath = mergedOptions.subDirectory 
        ? `${mergedOptions.subDirectory}/${fileName}`
        : fileName;
      
      const url = `${this.baseUrl}/uploads/${relativePath}`;
      
      return {
        fileName,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: filePath,
        url,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  /**
   * Upload multiple files to the server
   * @param files The files to upload
   * @param options Upload options
   * @returns Information about the uploaded files
   */
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    options: FileUploadOptions = {},
  ): Promise<UploadedFileInfo[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, options));
    return Promise.all(uploadPromises);
  }

  /**
   * Delete a file from the server
   * @param filePath The path to the file
   * @returns True if the file was deleted successfully
   */
  async deleteFile(filePath: string): Promise<boolean> {
    try {
      await fs.unlink(filePath);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, consider it deleted
        return true;
      }
      throw new InternalServerErrorException('Failed to delete file');
    }
  }

  /**
   * Validate a file against the provided options
   * @param file The file to validate
   * @param options The validation options
   */
  private validateFile(file: Express.Multer.File, options: FileUploadOptions): void {
    // Check file size
    if (options.maxFileSize && file.size > options.maxFileSize) {
      throw new BadRequestException(
        `File size exceeds the maximum allowed size of ${options.maxFileSize / (1024 * 1024)}MB`,
      );
    }
    
    // Check mime type
    if (
      options.allowedMimeTypes &&
      options.allowedMimeTypes.length > 0 &&
      !options.allowedMimeTypes.includes(file.mimetype)
    ) {
      throw new BadRequestException(
        `File type not allowed. Allowed types: ${options.allowedMimeTypes.join(', ')}`,
      );
    }
  }

  /**
   * Get the full path to a file
   * @param fileName The name of the file
   * @param subDirectory Optional subdirectory
   * @returns The full path to the file
   */
  getFilePath(fileName: string, subDirectory?: string): string {
    return subDirectory
      ? join(this.uploadDir, subDirectory, fileName)
      : join(this.uploadDir, fileName);
  }

  /**
   * Get the URL for a file
   * @param fileName The name of the file
   * @param subDirectory Optional subdirectory
   * @returns The URL for the file
   */
  getFileUrl(fileName: string, subDirectory?: string): string {
    const relativePath = subDirectory
      ? `${subDirectory}/${fileName}`
      : fileName;
    
    return `${this.baseUrl}/uploads/${relativePath}`;
  }

  /**
   * Check if a file exists
   * @param filePath The path to the file
   * @returns True if the file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file information
   * @param filePath The path to the file
   * @returns Information about the file
   */
  async getFileInfo(filePath: string): Promise<UploadedFileInfo> {
    try {
      const stats = await fs.stat(filePath);
      const fileName = filePath.split('/').pop();
      const mimeType = mime.lookup(filePath) || 'application/octet-stream';
      
      // Determine subdirectory if any
      const relativePath = filePath.replace(`${this.uploadDir}/`, '');
      const subDirectory = relativePath.includes('/')
        ? relativePath.substring(0, relativePath.lastIndexOf('/'))
        : '';
      
      return {
        fileName,
        originalName: fileName,
        mimeType,
        size: stats.size,
        path: filePath,
        url: this.getFileUrl(fileName, subDirectory),
      };
    } catch (error) {
      throw new BadRequestException('File not found');
    }
  }
}

