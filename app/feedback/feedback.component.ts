import {
  HttpClient,
  HttpEvent,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { VisibilityService } from 'app/services/visibility.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})
export class FeedbackComponent implements OnInit, OnDestroy {
  feedBackForm!: FormGroup;
  currentFile: File | null = null;
  progress = 0;
  message = '';
  showName = false;
  fileBase64: any;
  showForm = true;
  showAlert = false;
  showAlertError = false;
  fileName: any;
  sections: any[] = [
    'Homepage',
    'Data Library',
    'Graphs',
    'Stories',
    'Benchmark',
    'Other',
  ];
  currentUrl: string = '';
  breakpoint: any;
  feedbackPageClass: string = '';
  invalidFile!: boolean;
  section!: FormControl;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private visibilityService: VisibilityService
  ) {
    this.feedBackForm = this.formBuilder.group({
      section: ['', Validators.required],
      message: ['', [Validators.required, Validators.maxLength(5000)]],
      fileupload: [''],
    });
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
    if (this.currentUrl !== '/feedback') {
      this.visibilityService.changeVisibility(false);
    } else {
      this.feedbackPageClass = 'feedbackPage';
      this.visibilityService.changeVisibility(true);
    }
  }
  selectFile(event: any): void {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file: File = event.target.files[0];
      this.currentFile = file;

      this.fileName = this.currentFile.name;

      if (file.size > 5 * 1024 * 1024) {
        this.invalidFile = true;
        this.feedBackForm.controls['fileupload'].reset();
        this.currentFile = null;
      } else {
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.invalidFile = false;
          this.showName = true;
          let base64String = reader.result as string;
          this.fileBase64 = base64String;
          this.fileName = file.name;
        };
      }
    } else {
      this.fileName = 'Select File';
    }
  }
  deleteFile() {
    this.feedBackForm.controls['fileupload'].reset();
    this.currentFile = null;
    this.showName = false;
    this.fileName = undefined;
    this.fileBase64 = undefined;
  }

  onSubmit() {
    if (this.feedBackForm.valid) {
      const feedbackObject: { [key: string]: string } = {
        section: this.deleteWhiteSpace(this.feedBackForm.value.section),
        'feedback-text': this.feedBackForm.value.message,
      };
      if (this.fileName !== undefined && this.fileBase64 !== undefined) {
        Object.assign(
          feedbackObject,
          { 'image-name': this.fileName },
          { 'image-base64': this.fileBase64 }
        );
      }

      const body = this.deleteWhiteSpace(JSON.stringify(feedbackObject)); // replace with your JSON object
      this.http
        .post('localhost/frontend-services/feedback/', feedbackObject)
        .subscribe(
          (data) => {
            this.showForm = false;
            this.showAlert = true;
          },
          (error) => {
            if (error.status == '200') {
              this.showForm = false;
              this.showAlert = true;
            } else {
              this.showForm = false;
              this.showAlertError = true;
            }
          }
        );
    }
  }

  closeAlert() {
    this.showAlert = false;
    this.showAlertError = false;
    this.feedBackForm.reset();
    this.feedBackForm.controls['fileupload'].reset();
    this.currentFile = null;
    this.showName = false;
    this.showForm = true;
    this.fileName = undefined;
    this.fileBase64 = undefined;
  }

  deleteWhiteSpace(word: string) {
    return word.replace(/ /g, '');
  }
  ngOnDestroy() {
    this.visibilityService.changeVisibility(true);
  }
}
