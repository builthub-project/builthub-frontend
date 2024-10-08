import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { VisibilityService } from 'app/services/visibility.service';

const apiHighchartsServiceURL = 'https://platform.builthub.eu';

@Component({
  selector: 'app-dashboard-machinelearning',
  templateUrl: './dashboard-machinelearning.component.html',
  styleUrls: ['./dashboard-machinelearning.component.css'],
})
export class DashboardMachinelearningComponent implements OnInit, OnDestroy {
  header: any;

  // Form
  machineForm: UntypedFormGroup;
  selectedTraining: any;
  trainingList: any[] = [];
  trainingFilter: any;
  trainingName: any;
  dataTable1: any[] = [];

  // Form2
  machineForm2: UntypedFormGroup;
  selectedTraining2: any;
  trainingList2: any[] = [];
  trainingFilter2: any;
  trainingName2: any;
  dataTable12: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private visibilityService: VisibilityService
  ) {
    // Initialize form
    this.machineForm = new UntypedFormGroup({
      trainingDataset: new UntypedFormControl('', [Validators.required]),
    });

    // Init trainingFilter
    /**/
    this.httpClient
      .get(
        apiHighchartsServiceURL +
          '/highcharts/datamart/machinelearningformoptions',
        { responseType: 'text' }
      )
      .subscribe({
        next: (data) => {
          const list = data.split('\n');
          var isData: boolean = false;

          this.selectedTraining = ['NOMBRE DE OPCIÓN SELECCIONADA'];

          list.forEach((e) => {
            if (isData) {
              const values = e.split(',');
              this.trainingList.push(values[0]);
            } else {
              isData = true;
            }
          });
        },
        error: (error) => {},
      });
    /**/

    // Initialize form2
    this.machineForm2 = new UntypedFormGroup({
      trainingDataset2: new UntypedFormControl('', [Validators.required]),
    });

    // Init trainingFilter
    /**/
    this.httpClient
      .get(
        apiHighchartsServiceURL +
          '/highcharts/datamart/machinelearningformoptions2',
        { responseType: 'text' }
      )
      .subscribe({
        next: (data2) => {
          const list = data2.split('\n');
          var isData: boolean = false;

          this.selectedTraining2 = ['NOMBRE DE OPCIÓN SELECCIONADA'];

          list.forEach((e) => {
            if (isData) {
              const values = e.split(',');
              this.trainingList2.push(values[0]);
            } else {
              isData = true;
            }
          });
        },
        error: (error) => {},
      });
    /**/
  }

  ngOnInit(): void {
    this.visibilityService.changeVisibility(false);
  }

  // Filter change
  onFilterChange() {
    //Form
    if (this.machineForm.get('trainingDataset')?.value != '') {
      // Construir filtro de training
      this.trainingFilter = '?DATASET=%27';
      this.trainingName = '';

      /*for (var i = 0; i<this.machineForm.get('trainingDataset')?.value.length; i++){
        
        if( i == 0){
          
          for(var z = 0; z<this.machineForm.get('trainingDataset')?.value[i].length; z++){
            
            if(this.machineForm.get('trainingDataset')?.value[i][z] == " "){
              this.trainingName += "%20";
            }
            else{
              this.trainingName += this.machineForm.get('trainingDataset')?.value[i][z];
            }
            
          }
          
        }
        else{
          this.trainingName += "%27,%27";
          for(var z = 0; z<this.machineForm.get('trainingDataset')?.value[i].length; z++){
            
            if(this.machineForm.get('trainingDataset')?.value[i][z] == " "){
            
              this.trainingName += "%20";
              
            }
            else{
              this.trainingName +=this.machineForm.get('trainingDataset')?.value[i][z];
            }

          }

        }
      }*/
      this.trainingName = this.machineForm.get('trainingDataset')?.value;
      this.trainingFilter += this.trainingName + '%27';

      console.log(' *** ' + this.trainingFilter);

      this.httpClient
        .get(
          apiHighchartsServiceURL +
            '/highcharts/datamart/machinelearningform' +
            this.trainingFilter,
          { responseType: 'text' }
        )
        .subscribe({
          next: (data) => {
            const list = data.split('\n');
            var isData: boolean = false;

            this.dataTable1 = [];

            list.forEach((e) => {
              if (isData) {
                const values = e.split(',');
                let compref = '';
                for (var i = 7; i < values.length; i++) {
                  compref += values[i];
                }

                const record = {
                  thematic: values[0],
                  reference: values[1],
                  research: values[2],
                  method: values[3],
                  aggregation: values[4],
                  prediction: values[5],
                  training: values[6],
                  ref: compref,
                };

                this.dataTable1.push(record);
              } else {
                isData = true;
              }
            });
          },
          error: (error) => {},
        });
    }
  }

  // Filter change
  onFilterChange2() {
    //Form2
    if (this.machineForm2.get('trainingDataset2')?.value != '') {
      // Construir filtro de training
      this.trainingFilter2 = '?ALG=%27';
      this.trainingName2 = '';

      /*for (var i = 0; i<this.machineForm.get('trainingDataset')?.value.length; i++){
        
        if( i == 0){
          
          for(var z = 0; z<this.machineForm.get('trainingDataset')?.value[i].length; z++){
            
            if(this.machineForm.get('trainingDataset')?.value[i][z] == " "){
              this.trainingName += "%20";
            }
            else{
              this.trainingName += this.machineForm.get('trainingDataset')?.value[i][z];
            }
            
          }
          
        }
        else{
          this.trainingName += "%27,%27";
          for(var z = 0; z<this.machineForm.get('trainingDataset')?.value[i].length; z++){
            
            if(this.machineForm.get('trainingDataset')?.value[i][z] == " "){
            
              this.trainingName += "%20";
              
            }
            else{
              this.trainingName +=this.machineForm.get('trainingDataset')?.value[i][z];
            }

          }

        }
      }*/
      this.trainingName2 = this.machineForm2.get('trainingDataset2')?.value;
      this.trainingFilter2 += this.trainingName2 + '%27';

      console.log(' *** ' + this.trainingFilter2);

      this.httpClient
        .get(
          apiHighchartsServiceURL +
            '/highcharts/datamart/machinelearningform2' +
            this.trainingFilter2,
          { responseType: 'text' }
        )
        .subscribe({
          next: (data2) => {
            const list = data2.split('\n');
            var isData: boolean = false;

            this.dataTable12 = [];

            list.forEach((e) => {
              if (isData) {
                const values = e.split(',');
                let compref = '';
                for (var i = 7; i < values.length; i++) {
                  compref += values[i];
                }

                const record = {
                  thematic: values[0],
                  reference: values[1],
                  research: values[2],
                  method: values[3],
                  aggregation: values[4],
                  prediction: values[5],
                  training: values[6],
                  ref: compref,
                };

                this.dataTable12.push(record);
              } else {
                isData = true;
              }
            });
          },
          error: (error) => {},
        });
    }
  }
  ngOnDestroy() {
    this.visibilityService.changeVisibility(true);
  }
}
