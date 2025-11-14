import { Expose } from 'class-transformer';

export class UploadPhotosRdo {
  @Expose()
  public photos: string[];
}
