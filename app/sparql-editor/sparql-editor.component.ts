import { Component, HostListener, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { KeycloakService } from 'keycloak-angular';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SaveQueryDialogComponent } from 'app/save-query-dialog/save-query-dialog.component';

// Serice APIs
const apiIntegrationServiceURL = 'localhost/integration';
//const apiIntegrationServiceURL = "http://localhost:9091";
const defaultSparqlEndpoint = 'localhost/integration/sparql';

declare var Yasgui: any;

@Component({
  selector: 'app-sparql-editor',
  templateUrl: './sparql-editor.component.html',
  styleUrls: ['./sparql-editor.component.css'],
})
export class SparqlEditorComponent implements OnInit {
  // List of dataset
  optionsDataset: any[] = [];
  jsonTool: JSON = JSON;

  // Form
  sparqlForm: UntypedFormGroup;

  // Default queries available in the database
  availableQueries: any[] = [];
  //eventDelete2: any;
  yasgui: any;

  constructor(
    private http: HttpClient,
    private keycloakService: KeycloakService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.sparqlForm = new UntypedFormGroup({
      datasetSPQL: new UntypedFormControl('optionDataset', [
        Validators.required,
      ]),
      pruebaSPQL: new UntypedFormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.refreshQueries();

    this.yasgui = new Yasgui(document.getElementById('yasgui'), {
      requestConfig: {
        endpoint: defaultSparqlEndpoint,
      },
      copyEndpointOnNewTab: false,
    });
  }

  @HostListener('window:sparql.query.delete', ['$event'])
  onQueryDelete(event: any): void {
    this.http
      .delete(apiIntegrationServiceURL + '/SparQLQuery/' + event.detail.id)
      .subscribe({
        next: (data) => {
          this._snackBar.open(
            'The query "' + event.detail.title + '" has been deleted',
            '',
            { duration: 8000, panelClass: ['builthub-info-snackbar'] }
          );
          this.refreshQueries();
          // Close the tab window
          this.yasgui.getTab(event.detail.id).close();
        },
        error: (error) => {
          switch (error.status) {
            case 404:
              this._snackBar.open(error.error.message, error.error.error, {
                duration: 8000,
                panelClass: ['builthub-error-snackbar'],
              });
              break;
            case 403:
              this._snackBar.open(error.error.message, error.error.error, {
                duration: 8000,
                panelClass: ['builthub-error-snackbar'],
              });
              break;
            default:
              this._snackBar.open(
                error.error.message + ' (' + error.status + ')',
                error.error.error,
                { duration: 8000, panelClass: ['builthub-error-snackbar'] }
              );
              break;
          }
        },
      });
  }

  @HostListener('window:sparql.editor.addSavedQueryTab', ['$event'])
  onNewTab(event: any): void {
    this.yasgui.addTab(
      true,
      {
        ...Yasgui.Tab.getDefaults(),

        // Assign dataset name
        id: event.detail.id,
        name: event.detail.title,
        data: event.detail,
        // Assign default endpoint
        requestConfig: {
          endpoint: defaultSparqlEndpoint,
        },
      },
      this.yasgui.getTab(event.detail.id)
    );

    this.yasgui.getTab(event.detail.id).yasqe.setValue(event.detail.query);
  }

  @HostListener('window:sparql.query.save', ['$event'])
  onQuerySave(event: any): void {
    const tabId = event.detail.id;

    const dialogRef = this.dialog.open(SaveQueryDialogComponent, {
      data: { query: event.detail },
    });
    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data != undefined) {
          if (data.query != undefined) {
            this._snackBar.open(
              'The query "' + data.query.title + '" has been saved',
              '',
              { duration: 8000, panelClass: ['builthub-info-snackbar'] }
            );

            var tab = this.yasgui.getTab(tabId);
            if (tabId === data.query.id) {
              tab.setName(data.query.title);
              tab.persistentJson.data = data.query;
            } else {
              this.yasgui.addTab(
                true,
                {
                  ...Yasgui.Tab.getDefaults(),
                  id: data.query.id,
                  name: data.query.title,
                  data: data.query,
                  /* */
                  // Assign default endpoint
                  requestConfig: {
                    endpoint: defaultSparqlEndpoint,
                  },
                  /* */
                },
                this.yasgui.getTab(data.query.id)
              );

              this.yasgui
                .getTab(data.query.id)
                .yasqe.setValue(decodeURI(data.query.query));
              //tab.close();
            }

            this.refreshQueries();
          } else {
            this._snackBar.open(
              data.error.message + ' (' + data.error.status + ')',
              '',
              { duration: 8000, panelClass: ['builthub-error-snackbar'] }
            );
          }
        }
      },
      error: (error) => {
        this._snackBar.open(
          error.error.message + ' (' + error.status + ')',
          '',
          { duration: 8000, panelClass: ['builthub-error-snackbar'] }
        );
      },
    });
  }

  refreshQueries(): void {
    this.http
      .get(apiIntegrationServiceURL + '/SparQLQuery', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .subscribe({
        next: (data: any) => {
          console.log('next');
          this.availableQueries = data;
        },
        error: (error) => {
          this._snackBar.open(
            error.error.message + ' (' + error.status + ')',
            error.error.error,
            { duration: 8000, panelClass: ['builthub-error-snackbar'] }
          );
        },
      });
  }
}
