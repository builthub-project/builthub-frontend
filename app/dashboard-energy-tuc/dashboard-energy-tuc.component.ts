import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  FormControl,
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';

import * as Highcharts from 'highcharts';
import HC_data from 'highcharts/modules/data';
import { ThisReceiver } from '@angular/compiler';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ChangeDetectorRef } from '@angular/core';
import * as L from 'leaflet';
import { VisibilityService } from 'app/services/visibility.service';

HC_data(Highcharts);

const apiHighchartsServiceURL = 'localhost';
//const apiHighchartsServiceURL = "http://localhost:9094";

@Component({
  selector: 'app-dashboard-energy-tuc',
  templateUrl: './dashboard-energy-tuc.component.html',
  styleUrls: ['./dashboard-energy-tuc.component.css'],
})
export class DashboardEnergyTucComponent implements OnInit, OnDestroy {
  // Highcharts
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  chartOptions2: Highcharts.Options = {};
  chartOptions3: Highcharts.Options = {};

  // ************************************************** TUC1

  // PaginationlectedCountry
  p: number = 1;
  total: number = 0;

  yearsControl = new FormControl();
  regionControl = new FormControl();
  nameRegion: any;
  nameTopic: any;

  // Filters
  countryFilter: any;
  topicFilter: any;
  regionFilter: any;
  yearFilter: any;
  nutFilter: any;
  alert1: any;
  listNut3: any[] = [];
  urlFilter: any;
  selectedRegion: any[] = [];

  // Table1
  dtOptions: DataTables.Settings = {};
  dataTable1: any[] = [];
  pageSize: any[] = [5, 10, 25, 100];
  // Map1
  map: any;
  urlMap: any;
  marker = new Array();
  dataPolygon: any;
  namePolygon: any;
  tuc: any;
  average: any;
  coordPolygon: any;
  latlngs: any[] = [];
  typeMap: any;
  polygonGroup: any;
  subpolygon: any;
  subpolygon2: any;
  subpolygon3: any;
  subpolygon4: any;

  // ************************************************** TUC2
  // Form2
  yearsControl2 = new FormControl();

  // Filters
  countryFilter2: any;
  topicFilter2: any;
  yearFilter2: any;
  nameTopic2: any;
  selectedCountry2: any[] = ['Austria'];
  selectedYear2: any[] = ['2020', '2019', '2018'];
  nameCountry2: any;

  // Data
  dataTable2: any[] = [];

  // Graph2
  graphCategories2: any[] = [];
  isRepeat: boolean = false;
  graphSeries2: any[] = [];
  isRepeatSeries: boolean = false;
  chartData2: Map<string, string[]> = new Map([]);
  seriesGraph2: any[] = [];
  alert2: any;
  allGraph2: any;
  selectedTopic: any;

  // ************************************************** TUC3
  // Form3
  regionControl3 = new FormControl();
  yearsControl3 = new FormControl();

  // Graph3
  regions3: any[] = [];
  regionSelected3: any[] = [];
  graphCategories3: any[] = [];
  graphSeries3: any[] = [];
  isRepeat3: boolean = false;
  isRepeatSeries3: boolean = false;
  seriesGraph3: any[] = [];
  chartData3: Map<string, string[]> = new Map([]);

  alert3: any;
  allGraph3: any;

  // Filters
  countryFilter3: any;
  topicFilter3: any;
  nameTopic3: any;
  yearFilter3: any;
  nameCountry3: any;
  regionFilter3: any;
  nameRegion3: any;
  selectedYear3: any[] = ['2020', '2019', '2018'];
  selectedCountry3: any;

  // ************************************************** DOWNLOAD
  filterDownload: any;
  typeDownload: any;
  numberDownload: any;

  constructor(
    private httpClient: HttpClient,
    private visibilityService: VisibilityService
  ) {
    // *********************** COUNTRY ***********************
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
                this.selectedCountry3 = values[0];
                this.isSelectedCountry = true;

                this.initTable(this.selectedCountry);
                this.initGraph2(this.selectedCountry);
                this.initGraph3(this.selectedCountry);

                this.chartOptions = {
                  chart: {
                    type: 'column',
                  },
                  title: {
                    text: '',
                  },
                  subtitle: {
                    text: ' ',
                  },
                  credits: {
                    enabled: false,
                  },
                  xAxis: {
                    title: {
                      text: 'Region',
                    },
                  },
                  yAxis: {
                    title: {
                      text: 'Watt-jour/yr',
                    },
                    scrollbar: {
                      enabled: true,
                    },
                  },
                  data: {
                    csvURL:
                      apiHighchartsServiceURL +
                      '/highcharts/datamart/tuc_graph1_init?COUNTRY=%27' +
                      this.selectedCountry +
                      '%27',
                  },
                  series: [
                    {
                      type: 'column',
                      name: 'TUC',
                    },
                    {
                      type: 'spline',
                      name: 'Average',
                    },
                  ],
                  tooltip: {
                    headerFormat:
                      '<span style = "font-size:10px">{point.key}</span><table>',
                    pointFormat:
                      '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
                      '<td style = "padding:0"><b>{point.y:.2f} koe</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true,
                  },
                  plotOptions: {
                    bar: {
                      dataLabels: {
                        enabled: false,
                      },
                    },
                  },
                };
                Highcharts.chart('chart-container', this.chartOptions);
              }
            } else {
              isData = true;
            }
          });
        },
        error: (error) => {},
      });

    // *********************** CONSUMPTION ***********************
    this.selectedTopic = 'Total';
    this.httpClient
      .get(
        apiHighchartsServiceURL + '/highcharts/datamart/tuc_consumption_filter',
        { responseType: 'text' }
      )
      .subscribe({
        next: (data) => {
          const list = data.split('\n');
          var isData: boolean = false;

          list.forEach((e) => {
            if (isData) {
              const values = e.split(',');
              this.consumptions.push(values[0]);
            } else {
              isData = true;
            }
          });
        },
        error: (error) => {},
      });

    // *********************** YEARS ***********************
    this.httpClient
      .get(apiHighchartsServiceURL + '/highcharts/datamart/tuc_year_filter', {
        responseType: 'text',
      })
      .subscribe({
        next: (data) => {
          const list = data.split('\n');
          var isData: boolean = false;
          list.forEach((e) => {
            if (isData) {
              const values = e.split(',');

              this.years.push(values[0]);
            } else {
              isData = true;
            }
          });
        },
        error: (error) => {},
      });

    // ************************************************** TUC1 **************************************************
    this.isSelectedCountry = false;

    // Table Options
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
    };

    this.tuc1 = new UntypedFormGroup({
      country: new UntypedFormControl('', [Validators.required]),
      consumption: new UntypedFormControl('', [Validators.required]),
      nut: new UntypedFormControl('', [Validators.required]),
    });

    // ************************************************** TUC2

    this.tuc2 = new UntypedFormGroup({
      country2: new UntypedFormControl('', [Validators.required]),
      consumption2: new UntypedFormControl('', [Validators.required]),
    });

    // ************************************************** TUC3
    this.tuc3 = new UntypedFormGroup({
      country3: new UntypedFormControl('', [Validators.required]),
      consumption3: new UntypedFormControl('', [Validators.required]),
    });

    this.updateFilterRegion3('Austria');
  }

  initGraph2(country: any) {
    this.httpClient
      .get(
        apiHighchartsServiceURL +
          '/highcharts/datamart/tuc_graph2?COUNTRY=%27' +
          country +
          '%27&TOPIC=%27Total%27&YEAR=2018,2019,2020',
        { responseType: 'text' }
      )
      .subscribe({
        next: (data) => {
          this.alert2 = document.getElementById('alert2');
          this.alert2.style.display = 'none';

          const list = data.split('\n');
          var isData: boolean = false;
          this.graphCategories2 = [];
          this.graphSeries2 = [];
          this.chartData2.clear();
          list.forEach((e) => {
            this.isRepeat = false;
            this.isRepeatSeries = false;

            if (isData) {
              const values = e.split(',');

              // MAP
              if (this.chartData2.has(values[1])) {
                const serie = this.chartData2.get(values[1]);

                if (serie) {
                  serie.push(values[2]);
                }
              } else {
                this.chartData2.set(values[1], [values[2]]);
              }

              // MAP

              // Value[0] --> countries - categories
              if (values[0] != '') {
                for (
                  var i = 0;
                  i < this.graphCategories2.length && this.isRepeat == false;
                  i++
                ) {
                  if (this.graphCategories2[i] == values[0]) {
                    this.isRepeat = true;
                  }
                }
                if (this.isRepeat == false) {
                  this.graphCategories2.push(values[0]);
                }
              }
            } else {
              isData = true;
            }
          });

          // using Entries
          this.seriesGraph2 = [];
          for (let entry of this.chartData2.entries()) {
            if (entry[0] != undefined) {
              var datos: any = {
                name: entry[0],
                data: [],
              };

              for (var z = 0; z < entry[1].length; z++) {
                datos.data.push(parseFloat(entry[1][z]));
              }

              this.seriesGraph2.push(datos);
            }
          }

          this.updateGraph2(this.graphCategories2, this.seriesGraph2, 'Total');
        },
        error: (error) => {},
      });
  }

  updateGraph2(categoriesList: any[], seriesList: any[], type: any) {
    this.chartOptions2 = {
      chart: {
        type: 'column',
      },
      title: {
        text: '',
      },
      subtitle: {
        text: type,
      },
      xAxis: {
        categories: categoriesList,
        crosshair: true,
      },
      yAxis: {
        title: {
          useHTML: true,
          text: 'Watt-jour/yr',
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} Watt-jour/yr</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: seriesList,
    };
    Highcharts.chart('chart-container2', this.chartOptions2);
  }

  ngAfterViewInit() {
    this.loadMap('initial');
  }
  loadMap1() {
    this.map.setView([47.3333, 13.3333], 4);
  }

  public loadMap(msj: any): void {
    if (msj == 'initial') {
      this.map = L.map('map', { attributionControl: false }).setView(
        [47.3333, 13.3333],
        4
      );
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
      }).addTo(this.map);
    } else {
      this.map.remove();

      this.map = L.map('map', { attributionControl: false }).setView(
        [47.3333, 13.3333],
        4
      );
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,

        tileSize: 512,
        zoomOffset: -1,
      }).addTo(this.map);

      if (this.tuc1.get('nut')?.value == '5') {
        this.urlMap = 'tuc_map1_nuts5';
      } else {
        this.urlMap = 'tuc_map1';
      }

      this.httpClient
        .get(
          apiHighchartsServiceURL + '/highcharts/datamart/' + this.urlMap + msj,
          { responseType: 'text' }
        )
        .subscribe({
          next: (data) => {
            const list = data.split('\n');
            var isData: boolean = false;

            list.forEach((e) => {
              if (isData) {
                // POLYGON
                if (e.includes('MULTIPOLYGON') == false) {
                  this.typeMap = ',POLYGON((';
                }

                // MULTIPOLYGON
                else {
                  this.typeMap = ',MULTIPOLYGON(';
                }

                const values = e.split(this.typeMap);

                // Information (name, area)
                this.dataPolygon = values[0].split(',');
                this.namePolygon = this.dataPolygon[0];
                this.tuc = this.dataPolygon[1];
                this.average = this.dataPolygon[2];

                // POLYGON
                if (e.includes('MULTIPOLYGON') == false) {
                  this.coordPolygon = values[1]
                    .substring(values[1].indexOf('(('), values[1].indexOf('))'))
                    .split(',');

                  this.latlngs = [];

                  for (var i = 0; i < this.coordPolygon.length; i++) {
                    const points = this.coordPolygon[i].split(' ');
                    this.map.setView(
                      [
                        points[1].replace('))', ''),
                        points[0].replace('((', ''),
                      ],
                      8
                    );
                    this.latlngs.push([
                      points[1].replace('))', ''),
                      points[0].replace('((', ''),
                    ]);
                  }

                  L.polygon(this.latlngs, { color: '#FF000090' })
                    .addTo(this.map)
                    .bindTooltip(
                      this.namePolygon +
                        '<br>TUC: ' +
                        this.tuc +
                        ' koe <br>Average: ' +
                        this.average +
                        ' koe '
                    );
                }

                // MULTIPOLYGON
                else {
                  this.polygonGroup = values[1].split(')),((');

                  for (var i = 0; i < this.polygonGroup.length; i++) {
                    if (this.polygonGroup[i].includes('),(')) {
                      this.subpolygon2 = this.polygonGroup[i].split('),(');
                      for (var z = 0; z < this.subpolygon2.length; z++) {
                        this.subpolygon3 = this.subpolygon2[z].split(',');
                        this.latlngs = [];
                        for (var x = 0; x < this.subpolygon3.length; x++) {
                          const points = this.subpolygon3[x].split(' ');
                          this.map.setView(
                            [
                              points[1].replace(')))', ''),
                              points[0].replace('((', ''),
                            ],
                            8
                          );
                          this.latlngs.push([
                            points[1].replace(')))', ''),
                            points[0].replace('((', ''),
                          ]);
                        }
                        L.polygon(this.latlngs, { color: '#FF000090' })
                          .addTo(this.map)
                          .bindTooltip(
                            this.namePolygon +
                              '<br>TUC: ' +
                              this.tuc +
                              ' koe <br>Average: ' +
                              this.average +
                              ' koe '
                          );
                      }
                    } else {
                      this.subpolygon = this.polygonGroup[i].split(',');
                      this.latlngs = [];
                      for (var z = 0; z < this.subpolygon.length; z++) {
                        const points = this.subpolygon[z].split(' ');
                        this.map.setView(
                          [
                            points[1].replace(')))', ''),
                            points[0].replace('((', ''),
                          ],
                          8
                        );
                        this.latlngs.push([
                          points[1].replace(')))', ''),
                          points[0].replace('((', ''),
                        ]);
                      }
                      L.polygon(this.latlngs, { color: '#FF000090' })
                        .addTo(this.map)
                        .bindTooltip(
                          this.namePolygon +
                            '<br>TUC: ' +
                            this.tuc +
                            ' koe <br>Average: ' +
                            this.average +
                            ' koe '
                        );
                    }
                  }
                }
              } else {
                isData = true;
              }
            });
          },
          error: (error) => {},
        });
    }
  }

  header: any;

  // Forms
  tuc1: UntypedFormGroup;
  tuc2: UntypedFormGroup;
  tuc3: UntypedFormGroup;

  // ************************************************** TUC1
  // Initialize forms
  countries: Array<any> = [];
  isSelectedCountry: boolean;
  selectedCountry: any;
  selectedNuts: any;
  listNuts = ['0', '1', '2', '3', '5'];
  consumptions: Array<any> = [];
  regions: Array<any> = [];
  years: Array<any> = [];

  // Initialize forms
  countryControl: any;
  consumptionControl: any;
  nutsLevelControl: any;
  provinceControl: any;

  // ************************************************** TUC2
  // ************************************************** TUC3

  ngOnInit(): void {
    // ************************************************** TUC1
    // Forms
    this.countryControl = new FormControl();
    this.consumptionControl = new FormControl();
    this.nutsLevelControl = new FormControl();
    this.provinceControl = new FormControl();

    this.visibilityService.changeVisibility(false);
  }

  // ************************************************** TUC1 **************************************************
  // Init table (by country)
  initTable(country: any) {
    this.dataTable1 = [];

    // Init table
    this.httpClient
      .get(
        apiHighchartsServiceURL +
          '/highcharts/datamart/tuc_table_init?COUNTRY=%27' +
          country +
          '%27',
        { responseType: 'text' }
      )
      .subscribe({
        next: (data) => {
          const list = data.split('\n');
          var isData: boolean = false;

          list.forEach((e) => {
            if (isData) {
              const values = e.split(',');

              if (values[0] != '') {
                const record = {
                  country: values[0],
                  topic: values[1],
                  value_consumption: values[2],
                  unit: values[3],
                  tuc: values[4],
                  region: values[5],
                  nut_lvl: values[6],
                  nut_population: values[7],
                  country_population: values[8],
                  year: values[9],
                };

                this.dataTable1.push(record);
              }
            } else {
              isData = true;
            }
          });
          this.dtOptions = {
            pagingType: 'full_numbers',
            pageLength: 5,
            processing: true,
          };
        },
        error: (error) => {},
      });
  }

  // Init graph1
  initGraph(country: any) {}

  // *********************** ONCHANGE COUNTRY ***********************
  onCountryChange(event: any) {
    this.chartOptions.data = {
      csvURL:
        apiHighchartsServiceURL +
        '/highcharts/datamart/tuc_graph1_init?COUNTRY=%27' +
        event.value +
        '%27',
    };
    Highcharts.chart('chart-container', this.chartOptions);

    if (this.tuc1.get('nut')?.value == '5') {
      this.selectedRegion = [];
      this.updateProvince();
    } else {
      this.updateFilterRegion(
        this.tuc1.get('country')?.value,
        this.tuc1.get('nut')?.value
      );
    }
    this.initTable(this.tuc1.get('country')?.value);
  }

  // *********************** ONCHANGE CONSUMPTION ***********************
  onConsumptionChange(event: any): void {
    this.updateTable();
  }

  onRegionChange(event: any): void {
    if (event.value == 'all') {
      this.selectedRegion = this.regions;
    }
    this.updateTable();
  }

  // *********************** ONCHANGE NUTS ***********************
  onNUTSLevelChange(event: any): void {
    if (event.value == '5') {
      this.provinceControl.enable();
      this.updateProvince();
    } else {
      this.provinceControl.reset();
      this.provinceControl.disable();
      this.updateFilterRegion(this.tuc1.get('country')?.value, event.value);
      this.updateTable();
    }

    /*
    if (event.value == "0") {
      this.chartOptions.data = {
        csvURL: apiHighchartsServiceURL + "/highcharts/datamart/dashboard_energy_tuc.test?POP_NUTS_LEVEL='" + event.value + "'"
      }
      this.countryControl.disable();
    } else {
      this.chartOptions.data = {
        csvURL: apiHighchartsServiceURL + "/highcharts/datamart/dashboard_energy_tuc.test3?COUNTRY='" + this.countryControl.value + "'&POP_NUTS_LEVEL='" + event.value + "'"
      }
      this.countryControl.enable();
    }
    Highcharts.chart('chart-container', this.chartOptions);*/
  }

  onYearsChange(event: any) {
    this.updateTable();
  }

  // *********************** UPDATE NUT3 ***********************
  updateProvince() {
    this.listNut3 = [];
    this.httpClient
      .get(
        apiHighchartsServiceURL +
          '/highcharts/datamart/tuc_region_filter?COUNTRY=%27' +
          this.tuc1.get('country')?.value +
          '%27&NUTS_LVL=3',
        { responseType: 'text' }
      )
      .subscribe({
        next: (data) => {
          const list = data.split('\n');

          var isData: boolean = false;

          list.forEach((e) => {
            if (isData) {
              const values = e.split(',');

              this.listNut3.push(values[0]);
            } else {
              isData = true;
            }
          });
        },
        error: (error) => {},
      });
  }

  onNut3Change() {
    this.updateFilterRegion(this.tuc1.get('country')?.value, '5');
  }

  // *********************** UPDATE REGION ***********************
  updateFilterRegion(country: any, nut: any) {
    if (nut == '5') {
      this.urlFilter =
        'tuc_region_filter2?NUTS3=%27' + this.provinceControl.value + '%27';
    } else {
      this.urlFilter =
        'tuc_region_filter?COUNTRY=%27' + country + '%27&NUTS_LVL=' + nut;
    }

    // *********************** REGION ***********************
    this.httpClient
      .get(apiHighchartsServiceURL + '/highcharts/datamart/' + this.urlFilter, {
        responseType: 'text',
      })
      .subscribe({
        next: (data) => {
          const list = data.split('\n');

          var isData: boolean = false;
          this.regions = [];

          list.forEach((e) => {
            if (isData) {
              const values = e.split(',');

              this.regions.push(values[0]);
            } else {
              isData = true;
            }
          });
        },
        error: (error) => {},
      });
  }

  updateTable() {
    if (
      this.tuc1.get('country')?.value != null &&
      this.tuc1.get('country')?.value != '' &&
      this.tuc1.get('consumption')?.value != null &&
      this.tuc1.get('consumption')?.value != '' &&
      this.tuc1.get('nut')?.value != null &&
      this.tuc1.get('nut')?.value != '' &&
      this.yearsControl.value != null &&
      this.yearsControl.value != '' &&
      this.regionControl.value != null &&
      this.regionControl.value != ''
    ) {
      this.alert1 = document.getElementById('alert1');
      this.alert1.style.display = 'none';

      // QUERY
      // localhost
      // /highcharts/datamart/tuc_table?
      // COUNTRY=%27Spain%27&
      // NUTS=2&
      // TOPIC=%27Cooking%27&
      // REGION=%27Canarias%27,%27Barcelona%27&
      // YEAR=2019,2020

      this.countryFilter =
        '?COUNTRY=%27' +
        this.tuc1.get('country')?.value.replace(' ', '%20') +
        '%27&';
      this.nameTopic = '';
      for (var i = 0; i < this.tuc1.get('consumption')?.value.length; i++) {
        if (this.tuc1.get('consumption')?.value[i] == ' ') {
          this.nameTopic += '%20';
        } else {
          this.nameTopic += this.tuc1.get('consumption')?.value[i];
        }
      }

      this.topicFilter = 'TOPIC=%27' + this.nameTopic + '%27&';
      this.nutFilter = 'NUTS=' + this.tuc1.get('nut')?.value + '&';
      this.regionFilter = 'REGION=%27';
      this.nameRegion = '';

      if (this.regionControl.value != 'all') {
        for (var i = 0; i < this.regionControl.value.length; i++) {
          if (i == 0) {
            for (var z = 0; z < this.regionControl.value[i].length; z++) {
              if (
                this.regionControl.value[i][z] == ' ' ||
                this.regionControl.value[i][z] == "'"
              ) {
                if (this.regionControl.value[i][z] == "'") {
                  this.nameRegion += '%27%27';
                } else {
                  this.nameRegion += '%20';
                }
              } else {
                this.nameRegion += this.regionControl.value[i][z];
              }
            }
          } else {
            this.nameRegion += '%27,%27';
            for (var z = 0; z < this.regionControl.value[i].length; z++) {
              if (
                this.regionControl.value[i][z] == ' ' ||
                this.regionControl.value[i][z] == "'"
              ) {
                if (this.regionControl.value[i][z] == "'") {
                  this.nameRegion += '%27%27';
                } else {
                  this.nameRegion += '%20';
                }
              } else {
                this.nameRegion += this.regionControl.value[i][z];
              }
            }
          }
        }
        this.regionFilter += this.nameRegion + '%27&';
      } else {
        for (var i = 0; i < this.regions.length; i++) {
          if (i == 0) {
            for (var z = 0; z < this.regions[i].length; z++) {
              if (this.regions[i][z] == ' ' || this.regions[i][z] == "'") {
                if (this.regions[i][z] == "'") {
                  this.nameRegion += '%27%27';
                } else {
                  this.nameRegion += '%20';
                }
              } else {
                this.nameRegion += this.regions[i][z];
              }
            }
          } else {
            this.nameRegion += '%27,%27';

            for (var z = 0; z < this.regions[i].length; z++) {
              if (this.regions[i][z] == ' ' || this.regions[i][z] == "'") {
                if (this.regions[i][z] == "'") {
                  this.nameRegion += '%27%27';
                } else {
                  this.nameRegion += '%20';
                }
              } else {
                this.nameRegion += this.regions[i][z];
              }
            }
          }
        }
        this.regionFilter += this.nameRegion + '%27&';
        this.selectedRegion = this.regions;
      }

      this.yearFilter = 'YEAR=' + this.yearsControl.value;

      this.chartOptions.data = {
        csvURL:
          apiHighchartsServiceURL +
          '/highcharts/datamart/tuc_graph1' +
          this.countryFilter +
          this.nutFilter +
          this.topicFilter +
          this.regionFilter +
          this.yearFilter,
      };
      Highcharts.chart('chart-container', this.chartOptions);

      this.dataTable1 = [];

      var msj =
        this.countryFilter +
        this.nutFilter +
        this.topicFilter +
        this.regionFilter +
        this.yearFilter;
      this.loadMap(msj);

      this.httpClient
        .get(
          apiHighchartsServiceURL +
            '/highcharts/datamart/tuc_table1' +
            this.countryFilter +
            this.nutFilter +
            this.topicFilter +
            this.regionFilter +
            this.yearFilter,
          { responseType: 'text' }
        )
        .subscribe({
          next: (data) => {
            const list = data.split('\n');
            var isData: boolean = false;

            list.forEach((e) => {
              if (isData) {
                const values = e.split(',');

                const record = {
                  country: values[0],
                  topic: values[1],
                  value_consumption: values[2],
                  unit: values[3],
                  tuc: values[4],
                  region: values[5],
                  nut_lvl: values[6],
                  nut_population: values[7],
                  country_population: values[8],
                  year: values[9],
                };

                this.dataTable1.push(record);
              } else {
                isData = true;
              }
            });
          },
          error: (error) => {},
        });
    } else {
      this.alert1 = document.getElementById('alert1');
      this.alert1.style.display = 'block';
    }
  }

  // ************************************************** TUC2 **************************************************

  updateTable2() {
    if (
      this.tuc2.get('country2')?.value != null &&
      this.tuc2.get('country2')?.value != '' &&
      this.tuc2.get('consumption2')?.value != null &&
      this.tuc2.get('country2')?.value != '' &&
      this.yearsControl2.value != null &&
      this.yearsControl2.value != ''
    ) {
      this.alert2 = document.getElementById('alert2');
      this.alert2.style.display = 'none';

      this.allGraph2 = document.getElementById('allGraph2');
      this.allGraph2.style.display = 'block';

      this.countryFilter2 = '?COUNTRY=%27';
      this.nameCountry2 = '';

      for (var i = 0; i < this.tuc2.get('country2')?.value.length; i++) {
        if (i == 0) {
          for (var z = 0; z < this.tuc2.get('country2')?.value[i].length; z++) {
            if (this.tuc2.get('country2')?.value[i][z] == ' ') {
              this.nameCountry2 += '%20';
            } else {
              this.nameCountry2 += this.tuc2.get('country2')?.value[i][z];
            }
          }
        } else {
          this.nameCountry2 += '%27,%27';
          for (var z = 0; z < this.tuc2.get('country2')?.value[i].length; z++) {
            if (this.tuc2.get('country2')?.value[i][z] == ' ') {
              this.nameCountry2 += '%20';
            } else {
              this.nameCountry2 += this.tuc2.get('country2')?.value[i][z];
            }
          }
        }
      }
      this.countryFilter2 += this.nameCountry2 + '%27&';

      this.topicFilter2 = 'TOPIC=%27';
      this.nameTopic2 = '';
      for (var i = 0; i < this.tuc2.get('consumption2')?.value.length; i++) {
        if (this.tuc2.get('consumption2')?.value[i] == ' ') {
          this.nameTopic2 += '%20';
        } else {
          this.nameTopic2 += this.tuc2.get('consumption2')?.value[i];
        }
      }

      this.topicFilter2 = 'TOPIC=%27' + this.nameTopic2 + '%27&';

      this.yearFilter2 = 'YEAR=' + this.yearsControl2.value;

      this.httpClient
        .get(
          apiHighchartsServiceURL +
            '/highcharts/datamart/tuc_graph2' +
            this.countryFilter2 +
            this.topicFilter2 +
            this.yearFilter2,
          { responseType: 'text' }
        )
        .subscribe({
          next: (data) => {
            const list = data.split('\n');
            var isData: boolean = false;
            this.graphCategories2 = [];
            this.graphSeries2 = [];
            this.chartData2.clear();
            list.forEach((e) => {
              this.isRepeat = false;
              this.isRepeatSeries = false;

              if (isData) {
                const values = e.split(',');

                // MAP
                if (this.chartData2.has(values[1])) {
                  const serie = this.chartData2.get(values[1]);

                  if (serie) {
                    serie.push(values[2]);
                  }
                } else {
                  this.chartData2.set(values[1], [values[2]]);
                }

                // MAP

                // Value[0] --> countries - categories
                if (values[0] != '') {
                  for (
                    var i = 0;
                    i < this.graphCategories2.length && this.isRepeat == false;
                    i++
                  ) {
                    if (this.graphCategories2[i] == values[0]) {
                      this.isRepeat = true;
                    }
                  }
                  if (this.isRepeat == false) {
                    this.graphCategories2.push(values[0]);
                  }
                }

                // Value[1] --> years - series
                if (values[1] != '') {
                  for (
                    var i = 0;
                    i < this.graphSeries2.length &&
                    this.isRepeatSeries == false;
                    i++
                  ) {
                    if (this.graphSeries2[i] == values[1]) {
                      this.isRepeatSeries = true;
                    }
                  }
                  if (this.isRepeatSeries == false) {
                    this.graphSeries2.push(values[1]);
                  }
                }
              } else {
                isData = true;
              }
            });

            // using Entries
            this.seriesGraph2 = [];
            for (let entry of this.chartData2.entries()) {
              if (entry[0] != undefined) {
                var datos: any = {
                  name: entry[0],
                  data: [],
                };

                for (var z = 0; z < entry[1].length; z++) {
                  datos.data.push(parseFloat(entry[1][z]));
                }

                this.seriesGraph2.push(datos);
              }
            }

            this.updateGraph2(
              this.graphCategories2,
              this.seriesGraph2,
              decodeURIComponent(this.nameTopic2)
            );
          },
          error: (error) => {},
        });
    } else {
      this.allGraph2 = document.getElementById('alert2');
      this.allGraph2.style.display = 'block';

      this.alert2 = document.getElementById('allGraph2');
      this.alert2.style.display = 'none';
    }
  }

  // ************************************************** TUC3 **************************************************
  updateGraph3(categoriesList: any[], seriesList: any[], subtitleText: any) {
    this.chartOptions3 = {
      chart: {
        type: 'bar',
      },
      title: {
        text: ' ',
      },
      subtitle: {
        text: subtitleText,
      },
      xAxis: {
        categories: categoriesList,
        title: {
          text: 'NUTS 3',
        },
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Watt-jour/yr',
        },
        labels: {
          overflow: 'justify',
        },
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} Watt-jour/yr</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: false,
          },
        },
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        shadow: true,
      },
      credits: {
        enabled: false,
      },

      series: seriesList,
    };
    Highcharts.chart('chart-container3', this.chartOptions3);
  }

  onCountryChange3(event: any) {
    this.updateFilterRegion3(event.value);
    this.updateTable3();
  }

  updateFilterRegion3(newCountry: any) {
    this.httpClient
      .get(
        apiHighchartsServiceURL +
          '/highcharts/datamart/tuc_region_filter?COUNTRY=%27' +
          newCountry +
          '%27&NUTS_LVL=3',
        { responseType: 'text' }
      )
      .subscribe({
        next: (data) => {
          const list = data.split('\n');

          var isData: boolean = false;
          this.regions3 = [];
          this.regionSelected3 = [];
          this.regionSelected3.push(list[1]);

          list.forEach((e) => {
            if (isData) {
              const values = e.split(',');

              this.regions3.push(values[0]);
            } else {
              isData = true;
            }
          });
        },
        error: (error) => {},
      });
  }

  initGraph3(country: any) {
    this.alert3 = document.getElementById('alert3');
    this.alert3.style.display = 'none';

    this.httpClient
      .get(
        apiHighchartsServiceURL +
          '/highcharts/datamart/tuc_graph3?COUNTRY=%27' +
          country +
          '%27&TOPIC=%27Total%27&YEAR=2018,2019,2020&REGION=%27Außerfern%27',
        { responseType: 'text' }
      )
      .subscribe({
        next: (data) => {
          const list = data.split('\n');
          var isData: boolean = false;
          this.graphCategories3 = [];
          this.graphSeries3 = [];
          this.chartData3.clear();
          list.forEach((e) => {
            this.isRepeat3 = false;
            this.isRepeatSeries3 = false;

            if (isData) {
              const values = e.split(',');

              // MAP
              if (this.chartData3.has(values[1])) {
                const serie = this.chartData3.get(values[1]);

                if (serie) {
                  serie.push(values[2]);
                }
              } else {
                this.chartData3.set(values[1], [values[2]]);
              }

              // MAP

              // Value[0] --> countries - categories
              if (values[0] != '') {
                for (
                  var i = 0;
                  i < this.graphCategories3.length && this.isRepeat3 == false;
                  i++
                ) {
                  if (this.graphCategories3[i] == values[0]) {
                    this.isRepeat3 = true;
                  }
                }
                if (this.isRepeat3 == false) {
                  this.graphCategories3.push(values[0]);
                }
              }
            } else {
              isData = true;
            }
          });
          // using Entries
          this.seriesGraph3 = [];
          for (let entry of this.chartData3.entries()) {
            if (entry[0] != undefined) {
              var datos: any = {
                name: entry[0],
                data: [],
              };

              for (var z = 0; z < entry[1].length; z++) {
                datos.data.push(parseFloat(entry[1][z]));
              }

              this.seriesGraph3.push(datos);
            }
          }

          this.updateGraph3(this.graphCategories3, this.seriesGraph3, 'Total');
        },
        error: (error) => {},
      });
  }

  updateTable3() {
    if (
      this.tuc3.get('country3')?.value != null &&
      this.tuc3.get('country3')?.value != '' &&
      this.regionControl3.value != null &&
      this.regionControl3.value != '' &&
      this.tuc3.get('consumption3')?.value != null &&
      this.tuc3.get('consumption3')?.value != '' &&
      this.yearsControl3.value != null &&
      this.yearsControl3.value != ''
    ) {
      this.alert3 = document.getElementById('alert3');
      this.alert3.style.display = 'none';

      this.allGraph3 = document.getElementById('allGraph3');
      this.allGraph3.style.display = 'block';

      // Country Filter
      this.countryFilter3 = '?COUNTRY=%27';
      this.nameCountry3 = '';

      for (var i = 0; i < this.tuc3.get('country3')?.value.length; i++) {
        if (this.tuc3.get('country3')?.value[i] == ' ') {
          this.nameCountry3 += '%20';
        } else {
          this.nameCountry3 += this.tuc3.get('country3')?.value[i];
        }
      }
      this.countryFilter3 += this.nameCountry3 + '%27&';

      // Topic Filter
      this.topicFilter3 = 'TOPIC=%27';
      this.nameTopic3 = '';
      for (var i = 0; i < this.tuc3.get('consumption3')?.value.length; i++) {
        if (this.tuc3.get('consumption3')?.value[i] == ' ') {
          this.nameTopic3 += '%20';
        } else {
          this.nameTopic3 += this.tuc3.get('consumption3')?.value[i];
        }
      }

      this.topicFilter3 = 'TOPIC=%27' + this.nameTopic3 + '%27&';

      // Region Filter
      this.regionFilter3 = 'REGION=%27';
      this.nameRegion3 = '';
      for (var i = 0; i < this.regionControl3.value.length; i++) {
        if (i == 0) {
          for (var z = 0; z < this.regionControl3.value[i].length; z++) {
            if (this.regionControl3.value[i][z] == ' ') {
              this.nameRegion3 += '%20';
            } else {
              this.nameRegion3 += this.regionControl3.value[i][z];
            }
          }
        } else {
          this.nameRegion3 += '%27,%27';
          for (var z = 0; z < this.regionControl3.value[i].length; z++) {
            if (this.regionControl3.value[i][z] == ' ') {
              this.nameRegion3 += '%20';
            } else {
              this.nameRegion3 += this.regionControl3.value[i][z];
            }
          }
        }
      }
      this.regionFilter3 += this.nameRegion3 + '%27&';
      // Year Filter

      this.yearFilter3 = 'YEAR=' + this.yearsControl3.value;

      this.httpClient
        .get(
          apiHighchartsServiceURL +
            '/highcharts/datamart/tuc_graph3' +
            this.countryFilter3 +
            this.topicFilter3 +
            this.regionFilter3 +
            this.yearFilter3,
          { responseType: 'text' }
        )
        .subscribe({
          next: (data) => {
            const list = data.split('\n');
            var isData: boolean = false;
            this.graphCategories3 = [];
            this.graphSeries3 = [];
            this.chartData3.clear();
            list.forEach((e) => {
              this.isRepeat3 = false;
              this.isRepeatSeries3 = false;

              if (isData) {
                const values = e.split(',');

                // MAP
                if (this.chartData3.has(values[1])) {
                  const serie = this.chartData3.get(values[1]);

                  if (serie) {
                    serie.push(values[2]);
                  }
                } else {
                  this.chartData3.set(values[1], [values[2]]);
                }

                // MAP

                // Value[0] --> countries - categories
                if (values[0] != '') {
                  for (
                    var i = 0;
                    i < this.graphCategories3.length && this.isRepeat3 == false;
                    i++
                  ) {
                    if (this.graphCategories3[i] == values[0]) {
                      this.isRepeat3 = true;
                    }
                  }
                  if (this.isRepeat3 == false) {
                    this.graphCategories3.push(values[0]);
                  }
                }

                // Value[1] --> years - series
                if (values[1] != '') {
                  for (
                    var i = 0;
                    i < this.graphSeries3.length &&
                    this.isRepeatSeries3 == false;
                    i++
                  ) {
                    if (this.graphSeries3[i] == values[1]) {
                      this.isRepeatSeries3 = true;
                    }
                  }
                  if (this.isRepeatSeries3 == false) {
                    this.graphSeries3.push(values[1]);
                  }
                }
              } else {
                isData = true;
              }
            });

            // using Entries
            this.seriesGraph3 = [];
            for (let entry of this.chartData3.entries()) {
              if (entry[0] != undefined) {
                var datos: any = {
                  name: entry[0],
                  data: [],
                };

                for (var z = 0; z < entry[1].length; z++) {
                  datos.data.push(parseFloat(entry[1][z]));
                }

                this.seriesGraph3.push(datos);
              }
            }

            this.updateGraph3(
              this.graphCategories3,
              this.seriesGraph3,
              decodeURIComponent(this.nameTopic3)
            );
          },
          error: (error) => {},
        });
    } else {
      this.allGraph3 = document.getElementById('alert3');
      this.allGraph3.style.display = 'block';

      this.alert3 = document.getElementById('allGraph3');
      this.alert3.style.display = 'none';
    }
  }

  // ************************************************** DOWNLOAD
  downloadData(format: any, number: any) {
    if (number == '3') {
      this.numberDownload = number;
      // Country Filter
      this.countryFilter3 = '&COUNTRY=%27';
      this.nameCountry3 = '';

      for (var i = 0; i < this.tuc3.get('country3')?.value.length; i++) {
        if (this.tuc3.get('country3')?.value[i] == ' ') {
          this.nameCountry3 += '%20';
        } else {
          this.nameCountry3 += this.tuc3.get('country3')?.value[i];
        }
      }
      this.countryFilter3 += this.nameCountry3 + '%27&';

      // Topic Filter
      this.topicFilter3 = 'TOPIC=%27';
      this.nameTopic3 = '';
      for (var i = 0; i < this.tuc3.get('consumption3')?.value.length; i++) {
        if (this.tuc3.get('consumption3')?.value[i] == ' ') {
          this.nameTopic3 += '%20';
        } else {
          this.nameTopic3 += this.tuc3.get('consumption3')?.value[i];
        }
      }

      this.topicFilter3 = 'TOPIC=%27' + this.nameTopic3 + '%27&';

      // Region Filter
      this.regionFilter3 = 'REGION=%27';
      this.nameRegion3 = '';

      if (this.regionControl3.value != null) {
        for (var i = 0; i < this.regionControl3.value.length; i++) {
          if (i == 0) {
            for (var z = 0; z < this.regionControl3.value[i].length; z++) {
              if (this.regionControl3.value[i][z] == ' ') {
                this.nameRegion3 += '%20';
              } else {
                this.nameRegion3 += this.regionControl3.value[i][z];
              }
            }
          } else {
            this.nameRegion3 += '%27,%27';
            for (var z = 0; z < this.regionControl3.value[i].length; z++) {
              if (this.regionControl3.value[i][z] == ' ') {
                this.nameRegion3 += '%20';
              } else {
                this.nameRegion3 += this.regionControl3.value[i][z];
              }
            }
          }
        }
        this.regionFilter3 += this.nameRegion3 + '%27&';
      } else {
        this.regionFilter3 = 'REGION=%27Außerfern%27&';
      }

      // Year Filter

      this.yearFilter3 = 'YEAR=' + this.yearsControl3.value;

      this.filterDownload =
        this.countryFilter3 +
        this.topicFilter3 +
        this.regionFilter3 +
        this.yearFilter3;
      this.typeDownload = 'tuc_graph';
    }

    if (number == '2') {
      this.numberDownload = number;

      this.countryFilter2 = '&COUNTRY=%27';
      this.nameCountry2 = '';

      for (var i = 0; i < this.tuc2.get('country2')?.value.length; i++) {
        if (i == 0) {
          for (var z = 0; z < this.tuc2.get('country2')?.value[i].length; z++) {
            if (this.tuc2.get('country2')?.value[i][z] == ' ') {
              this.nameCountry2 += '%20';
            } else {
              this.nameCountry2 += this.tuc2.get('country2')?.value[i][z];
            }
          }
        } else {
          this.nameCountry2 += '%27,%27';
          for (var z = 0; z < this.tuc2.get('country2')?.value[i].length; z++) {
            if (this.tuc2.get('country2')?.value[i][z] == ' ') {
              this.nameCountry2 += '%20';
            } else {
              this.nameCountry2 += this.tuc2.get('country2')?.value[i][z];
            }
          }
        }
      }
      this.countryFilter2 += this.nameCountry2 + '%27&';

      this.topicFilter2 = 'TOPIC=%27';
      this.nameTopic2 = '';
      for (var i = 0; i < this.tuc2.get('consumption2')?.value.length; i++) {
        if (this.tuc2.get('consumption2')?.value[i] == ' ') {
          this.nameTopic2 += '%20';
        } else {
          this.nameTopic2 += this.tuc2.get('consumption2')?.value[i];
        }
      }
      this.topicFilter2 = 'TOPIC=%27' + this.nameTopic2 + '%27&';
      this.yearFilter2 = 'YEAR=' + this.yearsControl2.value;

      this.filterDownload =
        this.countryFilter2 + this.topicFilter2 + this.yearFilter2;
      this.typeDownload = 'tuc_graph';
    }

    // Graph
    if (number[0] == '1') {
      this.numberDownload = number[0];

      this.countryFilter =
        '&COUNTRY=%27' +
        this.tuc1.get('country')?.value.replace(' ', '%20') +
        '%27&';
      this.nameTopic = '';
      for (var i = 0; i < this.tuc1.get('consumption')?.value.length; i++) {
        if (this.tuc1.get('consumption')?.value[i] == ' ') {
          this.nameTopic += '%20';
        } else {
          this.nameTopic += this.tuc1.get('consumption')?.value[i];
        }
      }

      this.topicFilter = 'TOPIC=%27' + this.nameTopic + '%27&';
      this.nutFilter = 'NUTS=' + this.tuc1.get('nut')?.value + '&';
      this.regionFilter = 'REGION=%27';
      this.nameRegion = '';
      for (var i = 0; i < this.regionControl.value.length; i++) {
        if (i == 0) {
          for (var z = 0; z < this.regionControl.value[i].length; z++) {
            if (this.regionControl.value[i][z] == ' ') {
              this.nameRegion += '%20';
            } else {
              this.nameRegion += this.regionControl.value[i][z];
            }
          }
        } else {
          this.nameRegion += '%27,%27';
          for (var z = 0; z < this.regionControl.value[i].length; z++) {
            if (this.regionControl.value[i][z] == ' ') {
              this.nameRegion += '%20';
            } else {
              this.nameRegion += this.regionControl.value[i][z];
            }
          }
        }
      }
      this.regionFilter += this.nameRegion + '%27&';
      this.yearFilter = 'YEAR=' + this.yearsControl.value;
      this.filterDownload =
        this.countryFilter +
        this.nutFilter +
        this.topicFilter +
        this.regionFilter +
        this.yearFilter;

      // Graph
      if (number == '1_1') {
        this.typeDownload = 'tuc_graph';
      }
      // Table
      if (number == '1_2') {
        this.typeDownload = 'table';
      }
    }

    let downloadLink = document.createElement('a');
    downloadLink.href =
      'localhost/highcharts/datamart/' +
      this.typeDownload +
      this.numberDownload +
      '?format=' +
      format +
      this.filterDownload;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  // Page configuration
  pageChangeEvent(event: any) {
    this.p = event;
  }

  ngOnDestroy() {
    this.visibilityService.changeVisibility(true);
  }
}
