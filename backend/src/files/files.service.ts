import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class FilesService {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  async uploadToSupabase(file: Express.Multer.File) {
    const filePath = `uploads/${Date.now()}-${file.originalname}`;
    const { data, error } = await this.supabase.storage
      .from(process.env.SUPABASE_STORAGE_BUCKET!)
      .upload(filePath, file.buffer, { contentType: file.mimetype });

    if (error) throw error;
    // Get the public URL (if bucket is public) or signed URL
    const { data: publicUrlData } = this.supabase
      .storage
      .from(process.env.SUPABASE_STORAGE_BUCKET!)
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl };
  }
}