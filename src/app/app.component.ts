import { Component } from '@angular/core';
import { FileUploadService } from './services/file-upload.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pcb_fault_detection_ui';
  imageUrl: string | ArrayBuffer | null = "../assets/static_pcb.jpg";
  imageSelected: boolean = false;
  resultsFetched: boolean = false;
  resultString: string = "Detected fault is : NA";
  selectedFile:File | undefined;
  inputElement: HTMLInputElement | null = null;
  pcbFault:string = "NA";
  predictionText: string = ""
  showLoading:boolean = false;

  constructor(public fileUploadService:FileUploadService){
    document.addEventListener('DOMContentLoaded', () => {
      this.inputElement = document.getElementById('file-upload') as HTMLInputElement;
      if (this.inputElement) {
        console.log("Element with id 'file-upload' found");

        this.inputElement.addEventListener('change', this.onImageSelected.bind(this));
      } else {
        console.error("Element with id 'file-upload' not found");
      }
    });
  }
  
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
        this.imageSelected = true;
        this.selectedFile = file
      };
      reader.readAsDataURL(file);
    } else {
      this.imageUrl = null;
      this.imageSelected = false;
    }
  }
  
  onImageSelected(event: Event): void {
    console.log("onImageSelected!");

    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      const file = files[0];
      console.log("Valid file selected!");
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
        this.imageSelected = true;
        this.showLoading = false;
        this.selectedFile = file
        console.log("Selected file name:"+file.name)
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No file selected!");
      this.imageUrl = null;
      this.imageSelected = false;
      this.showLoading = false;
    }
  }


  sendFileToServer(){
    console.log("Sending file to servier")
    this.showLoading = true
    this.resultsFetched = false
    if (this.selectedFile) {
      this.fileUploadService.uploadFile(this.selectedFile)
        .subscribe(response => {
          // Handle response if needed
          let jsonData = JSON.parse(JSON.stringify(response))
          console.log("Resp:" +JSON.stringify(response));
          this.pcbFault = jsonData['pcbFault']
          if(this.pcbFault == "None"){
            this.predictionText = "Unknown or unable to parse PCB";
          }
          else{
            this.predictionText = "Selected PCB image has fault :\n"+this.pcbFault+" ";
          }
          
          console.log(this.resultString);
          this.resultsFetched = true;
          this.showLoading = false;
        }, error => {
          console.error('Error uploading file:', error);
        });
    }
  }    
}
