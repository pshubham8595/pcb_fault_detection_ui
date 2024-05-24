import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

constructor(private http: HttpClient) { }

uploadFile(file: File) {
  const formData: FormData = new FormData();
  formData.append('file', file);
  const headers = { 'content-type': 'application/json'}  
  return this.http.post('http://127.0.0.1:5000/upload', formData);
}


}
