import { Component, OnDestroy, OnInit } from '@angular/core';

import * as Highcharts from 'highcharts';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AbstractControl, FormControl, FormControlName } from '@angular/forms';

import HC_data from 'highcharts/modules/data';

HC_data(Highcharts);

import HighchartsBoost from 'highcharts/modules/boost';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LowerCasePipe } from '@angular/common';
import { VisibilityService } from 'app/services/visibility.service';
HighchartsBoost(Highcharts);
const apiHighchartsServiceURL = 'localhost';

@Component({
  selector: 'app-benchmark',
  templateUrl: './benchmark.component.html',
  styleUrls: ['./benchmark.component.css'],
})
export class BenchmarkComponent implements OnInit, OnDestroy {
  header: any;

  // Form
  benchmarkForm!: FormGroup;
  Highcharts: typeof Highcharts = Highcharts;
  country!: FormControl;

  apiHighchartsServiceURL = 'localhost';

  energyList: any[] = ['Space Heating', 'Space Cooling', 'Domestic Hot Water'];
  energyTypeList: any[] = ['Final Energy Consumption ', 'Useful Energy Demand'];
  benchmarkChartOptions: Highcharts.Options = {};
  showChart: boolean = false;
  nullOptionsChart: Highcharts.Options = {};

  countries: any[] = [];
  isSelectedCountry: boolean = false;
  selectedCountry: any;
  sectors: any[] = ['Residential Sector', 'Service Sector'];
  buildingtypes: any[] = [];
  years: any[] = [
    'Before 1945',
    '1945 – 1969',
    '1970 – 1979',
    '1980 – 1989',
    '1990 – 1999',
    '2000 – 2010',
    'Post 2010',
  ];
  breakpoint: any;
  benchMarkValue!: number;
  buildingValue!: number;
  chartLineColor!: string;
  difference!: number;
  percentage!: number;
  energyType!: string;
  chartTitle!: string;
  yearStart!: string;
  yearEnd!: string;

  constructor(
    private httpClient: HttpClient,
    private formBuilder: FormBuilder,
    private visibilityService: VisibilityService
  ) {
    // Benchcmark Form
    this.benchmarkForm = this.formBuilder.group({
      country: ['', Validators.required],
      sector: ['', Validators.required],
      buildingtype: [{ value: '', disabled: true }],
      floorarea: [{ value: '', disabled: true }],
      year: ['', Validators.required],
      energyuse: ['', Validators.required],
      energytype: ['', Validators.required],
      average: ['', [Validators.required, this.ValidateAverage]],
    });

    // Get the countries
    this.httpClient
      .get(
        apiHighchartsServiceURL + '/highcharts/datamart/tuc_country_filter',
        { responseType: 'text' }
      )
      .subscribe({
        next: (data) => {
          const list = data.split('\n');
          var isData: boolean = false;

          list.forEach((e) => {
            if (isData) {
              const values = e.split(',');
              this.countries.push(values[0]);
              if (this.isSelectedCountry == false) {
                this.selectedCountry = values[0];

                this.isSelectedCountry = true;
                this.benchmarkForm.patchValue({
                  country: this.countries[0],
                });
              }
            } else {
              isData = true;
            }
          });
        },
        error: (error) => {},
      });
  }

  ngOnInit(): void {
    this.visibilityService.changeVisibility(false);

    this.breakpoint = window.innerWidth <= 480 ? 2 : 3;
    this.benchmarkChartOptions = {
      title: {
        text: undefined,
      },
    };
    Highcharts.chart('benchmark-chart', this.benchmarkChartOptions);
  }
  // Change sector selection functionality
  onChangeSector(event: any) {
    this.buildingtypes = [];
    this.benchmarkForm.controls['buildingtype'].enable();
    if (event.source.value == 'Residential Sector') {
      this.buildingtypes = [
        'Single Family and Terraced houses',
        'Multifamily Houses',
        'Apartment Blocks',
      ];
      this.benchmarkForm.controls['floorarea'].disable();
    } else if (event.source.value == 'Service Sector') {
      this.buildingtypes = [
        'Education',
        'Health',
        'Hotels',
        'Restaurants',
        'Offices',
        'Other Non-Residential Buildings',
        'Trade',
      ];
    } else {
    }
  }

  // Resize the form being responsive for mobile and all the screens
  onResize(event: any) {
    this.breakpoint = event.target.innerWidth <= 480 ? 2 : 3;
  }
  // Validation Average Annual Energy Performance must be between 10-1000 kWh/(m2yr}
  ValidateAverage(control: AbstractControl) {
    if (control.value < 10 || control.value > 1000) {
      return { invalidNumber: true };
    }
    return null;
  }
  // Submit the Benchmarck form and display the chart
  onSubmit() {
    if (this.benchmarkForm.valid) {
      this.showChart = true;

      const period = this.benchmarkForm.value['year'];
      if (period.includes('Before')) {
        this.yearStart = '1900';
        this.yearEnd = '1945';
      } else if (period.includes('Post')) {
        this.yearStart = '2010';
        this.yearEnd = '9999';
      } else {
        const periodArray = period.split(' – ');
        this.yearStart = periodArray[0];
        this.yearEnd = periodArray[1];
      }
      let buildingtype = this.deleteWhiteSpace(
        this.benchmarkForm.value['buildingtype']
      );
      let country = this.deleteWhiteSpace(this.benchmarkForm.value['country']);
      let energytype = this.deleteWhiteSpace(
        this.benchmarkForm.value['energytype']
      );
      let energyuse = this.deleteWhiteSpace(
        this.benchmarkForm.value['energyuse']
      );
      let sector = this.deleteWhiteSpace(this.benchmarkForm.value['sector']);
      const benchmarkFormObject: { [key: string]: string } = {
        BUILDING_TYPE: `http://data.builthub.eu/resource/set/BuildingType/${buildingtype}`,
        COUNTRY: `${country}`,
        ENERGY_TYPE: `http://data.builthub.eu/resource/set/Feature/${energytype}`,
        ENERGY_USE: `http://data.builthub.eu/resource/set/Type/${energyuse}`,
        SECTOR: `http://data.builthub.eu/resource/set/Sector/${sector}`,
        YEAR_START: this.yearStart,
        YEAR_END: this.yearEnd,
      };

      this.selectedCountry = this.benchmarkForm.value['country'];

      this.buildingValue = this.benchmarkForm.value['average'];
      this.energyType = this.benchmarkForm.value['energytype'].toLowerCase();

      let params = new HttpParams();

      Object.keys(benchmarkFormObject).forEach((key) => {
        params = params.append(key, benchmarkFormObject[key]);
      });

      this.httpClient
        .get('localhost/highcharts/graph_benchmark/', {
          params: params,
          responseType: 'text',
        })
        .subscribe({
          next: (data) => {
            const list = data.split('\n');
            list.pop();
            if (list.length > 1) {
              const datalist = list[1].split(',');

              this.benchMarkValue = parseFloat(
                datalist[datalist.length - 1].replace(' kWh/m2/yr/g', '')
              );
              this.percentage =
                (this.buildingValue / this.benchMarkValue) * 100;
              // Calculate the difference between benchmark and your building and display the chart with all the suitable characteristics
              if (this.benchMarkValue > this.buildingValue) {
                this.chartLineColor = '#70AD47';
                this.difference = this.percentage - 100;
              } else if (this.buildingValue > this.benchMarkValue) {
                this.chartLineColor = 'red';
                this.difference = this.percentage - 100;
              } else {
                this.chartLineColor = 'grey';
                this.difference = 0;
              }
              this.chartTitle =
                this.buildingValue === this.benchMarkValue
                  ? `The energy performance of your building is on par with the reference building in the database.`
                  : `Your building requires ${this.percentage.toFixed(
                      2
                    )}% of the ${this.energyType} compared to the benchmark.`;

              // Graph: Benchmark graph
              this.benchmarkChartOptions = {
                chart: {
                  type: 'column',
                },
                colors: ['#2563EB', this.chartLineColor, this.chartLineColor],

                title: {
                  text: this.chartTitle,
                },
                subtitle: {
                  text: undefined,
                },
                legend: {
                  enabled: true,
                },

                xAxis: {
                  crosshair: true,
                  categories: ['Benchmark', 'Your Building'],
                },
                yAxis: {
                  title: {
                    text: 'kWh/(m²yr)',
                  },
                  labels: {
                    format: '{value:.f}',
                  },
                },

                tooltip: {
                  valueSuffix: 'kWh/(m²yr )',
                },
                plotOptions: {
                  column: {
                    pointPadding: 0.3,
                    borderWidth: 0,
                  },
                  series: {
                    stacking: 'normal',
                  },
                },

                series: [
                  {
                    name: 'Benchmark',
                    type: 'column',

                    data: [this.benchMarkValue, 0],
                    tooltip: {
                      valueSuffix: 'kWh/(m²yr )',
                    },
                  },
                  {
                    name: 'Your Building',
                    type: 'column',

                    tooltip: {
                      valueSuffix: 'kWh/(m²yr )',
                    },
                    data: [0, this.buildingValue],
                  },
                  {
                    type: 'spline',

                    name: `Difference: ${this.difference.toFixed(2)}%`,
                    data: [this.benchMarkValue, this.buildingValue],
                  },
                ],
              };
              Highcharts.chart('benchmark-chart', this.benchmarkChartOptions);
            } else {
              this.benchmarkChartOptions = {
                chart: {
                  type: 'column',
                },
                colors: ['grey'],

                title: {
                  text: 'No data found to compare your building against.',
                },
                subtitle: {
                  text: undefined,
                },
                legend: {
                  enabled: true,
                },

                xAxis: {
                  crosshair: true,
                  categories: ['Your Building'],
                },
                yAxis: {
                  title: {
                    text: 'kWh/(m²yr)',
                  },
                  labels: {
                    format: '{value:.f}',
                  },
                },

                tooltip: {
                  valueSuffix: 'kWh/(m²yr )',
                },
                plotOptions: {
                  column: {
                    pointPadding: 0.3,
                    borderWidth: 0,
                  },
                  series: {
                    stacking: 'normal',
                  },
                },

                series: [
                  {
                    name: 'Your Building',
                    type: 'column',

                    tooltip: {
                      valueSuffix: 'kWh/(m²yr )',
                    },
                    data: [this.buildingValue],
                  },
                ],
              };
              Highcharts.chart('benchmark-chart', this.benchmarkChartOptions);
            }
          },
        });
    }
  }

  deleteWhiteSpace(word: string) {
    return word.replace(/ /g, '');
  }
  ngOnDestroy() {
    this.visibilityService.changeVisibility(true);
  }
}
