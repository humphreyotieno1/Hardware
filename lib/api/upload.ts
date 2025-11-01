import { getApiClient } from "./client"

export interface UploadedFile {
  public_id: string
  url: string
  secure_url: string
  format: string
  width: number
  height: number
  bytes: number
  filename: string
  size: number
}

export interface UploadResponse {
  message: string
  file: UploadedFile
}

export interface MultipleUploadResponse {
  message: string
  files: UploadedFile[]
  count: number
}

export interface DeleteResponse {
  message: string
  public_id: string
}

class UploadApiClient {
  private apiClient = getApiClient()

  async uploadFile(file: File, folder?: string): Promise<UploadedFile> {
    const formData = new FormData()
    formData.append('file', file)
    if (folder) {
      formData.append('folder', folder)
    }

    const response = await this.apiClient.post<UploadResponse>('/upload/file', formData)
    return response.data!.file
  }

  async uploadFiles(files: File[], folder?: string): Promise<UploadedFile[]> {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })
    if (folder) {
      formData.append('folder', folder)
    }

    const response = await this.apiClient.post<MultipleUploadResponse>('/upload/files', formData)
    return response.data!.files
  }

  async deleteFile(publicId: string): Promise<void> {
    await this.apiClient.delete<DeleteResponse>(`/upload/file/${encodeURIComponent(publicId)}`)
  }
}

export const uploadApi = new UploadApiClient()
