export type UploadDirType = {
  type: string;
  folder: string;
  thumbnail: string;
};

export type FileSchema = {
  id: string;
  originalName: string;
  fileName: string;
  fileType: string;
  category: string;
  size: number;
  extension: string | null;
  path: string;
  url: string | null;
  uploadedBy: string | null;
  uploadDate: string | null;
  updatedAt: string | null;
  isPublic: boolean;
  description: string | null;
  tags: string | null;
  status: string;
  checksum: string | null;
  durationSeconds: number | null;
  width: number | null;
  height: number | null;
  encoding: string | null;
};
