import { Component, OnInit, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// Serice APIs
const apiIntegrationServiceURL = 'localhost/integration';
//const apiIntegrationServiceURL = "http://localhost:9091";

@Component({
  selector: 'app-save-query-dialog',
  templateUrl: './save-query-dialog.component.html',
  styleUrls: ['./save-query-dialog.component.css'],
  template: 'passed in {{ data.query }}',
})
export class SaveQueryDialogComponent implements OnInit {
  // Form
  saveQueryForm: UntypedFormGroup;
  // Default values
  idNewQuery: any;
  titleNewQuery: any;
  descriptionNewQuery: any;

  newQuery: any;

  constructor(
    // Pasar como referencia la clase
    public dialogRef: MatDialogRef<SaveQueryDialogComponent>,
    // Inyectamos el mensaje
    @Inject(MAT_DIALOG_DATA) public data: { query: any },
    // Required components
    private http: HttpClient
  ) {
    //this.idPattern = "^[A-Za-z0-9]";
    this.saveQueryForm = new UntypedFormGroup({
      idQuery: new UntypedFormControl(
        data.query.id,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[A-Za-z0-9_:-]{1,128}$'),
        ])
      ),
      titleQuery: new UntypedFormControl(data.query.title, [
        Validators.required,
      ]),
      descriptionQuery: new UntypedFormControl(data.query.description, [
        Validators.required,
      ]),
    });

    this.newQuery = data.query;
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // Modify the new query with the form values
    this.newQuery.id = this.saveQueryForm.controls['idQuery'].value;
    this.newQuery.title = this.saveQueryForm.controls['titleQuery'].value;
    this.newQuery.description =
      this.saveQueryForm.controls['descriptionQuery'].value;

    /* Save new query */
    this.http
      .put(apiIntegrationServiceURL + '/SparQLQuery', this.newQuery, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .subscribe({
        next: (data) => {
          this.dialogRef.close({ query: data, error: undefined });
        },
        error: (error) => {
          this.dialogRef.close({ query: undefined, error: error });
        },
      });
  }
}
