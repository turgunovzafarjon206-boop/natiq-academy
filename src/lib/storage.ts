// ============================================================================
//  S3-mos obyekt saqlash abstraksiyasi. Video/PDF/audio fayllar imzolangan
//  (signed) URL orqali beriladi — xavfsiz fayl kirishi.
//  Implementatsiya @aws-sdk/client-s3 bilan yoziladi (MinIO ham mos keladi).
// ============================================================================

export interface StorageAdapter {
  /** Yuklash uchun imzolangan PUT URL. */
  getUploadUrl(key: string, contentType: string, expiresSec?: number): Promise<string>;
  /** Koʻrish/yuklab olish uchun imzolangan GET URL. */
  getSignedUrl(key: string, expiresSec?: number): Promise<string>;
  delete(key: string): Promise<void>;
}

// Namuna stub — env sozlangach haqiqiy S3/MinIO bilan almashtiriladi.
export const storage: StorageAdapter = {
  async getUploadUrl(key) {
    return `${process.env.S3_PUBLIC_URL}/${key}?signature=STUB`;
  },
  async getSignedUrl(key) {
    return `${process.env.S3_PUBLIC_URL}/${key}?signature=STUB`;
  },
  async delete() {
    /* no-op stub */
  },
};
