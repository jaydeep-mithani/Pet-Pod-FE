import { api } from "@/lib/api/client";

export interface UploadSignature {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
  transformation: string;
}

export interface UploadedPhoto {
  url: string;
  publicId: string;
  width: number;
  height: number;
  bytes: number;
}

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  bytes: number;
}

const uploadEndpoint = (cloudName: string) =>
  `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

export const uploadsService = {
  getSignature: () => api.post<UploadSignature>("/uploads/signature"),

  /**
   * Uploads a single file directly to Cloudinary using a server-signed payload.
   * Progress is reported via the optional callback (0-1).
   */
  uploadToCloudinary: (
    file: File,
    signature: UploadSignature,
    onProgress?: (fraction: number) => void,
  ): Promise<UploadedPhoto> => {
    return new Promise((resolve, reject) => {
      const form = new FormData();
      form.append("file", file);
      form.append("api_key", signature.apiKey);
      form.append("timestamp", String(signature.timestamp));
      form.append("folder", signature.folder);
      form.append("transformation", signature.transformation);
      form.append("signature", signature.signature);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", uploadEndpoint(signature.cloudName));

      if (onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            onProgress(event.loaded / event.total);
          }
        };
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(
              xhr.responseText,
            ) as CloudinaryUploadResponse;
            resolve({
              url: data.secure_url,
              publicId: data.public_id,
              width: data.width,
              height: data.height,
              bytes: data.bytes,
            });
          } catch {
            reject(new Error("Cloudinary returned an unexpected response"));
          }
        } else {
          let message = `Upload failed (${xhr.status})`;
          try {
            const data = JSON.parse(xhr.responseText) as {
              error?: { message?: string };
            };
            if (data.error?.message) message = data.error.message;
          } catch {
            /* ignore */
          }
          reject(new Error(message));
        }
      };

      xhr.onerror = () => reject(new Error("Network error during upload"));
      xhr.send(form);
    });
  },
};
