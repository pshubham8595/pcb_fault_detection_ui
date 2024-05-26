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

  constructor(public fileUploadService:FileUploadService){}
  
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
