import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as Highcharts from 'highcharts';
//import { Map, tileLayer, polygon  } from 'leaflet';
import * as L from 'leaflet';
import {
  FormControl,
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
} from '@angular/forms';
import { VisibilityService } from 'app/services/visibility.service';

//import { AnimationTriggerNames } from '@angular/compiler';

const apiHighchartsServiceURL = 'localhost';

@Component({
  selector: 'app-dashboard-bereel',
  templateUrl: './dashboard-bereel.component.html',
  styleUrls: ['./dashboard-bereel.component.css'],
})
export class DashboardBereelComponent implements OnInit, OnDestroy {
  // **************************** Tables1 ****************************
  //Table1_1
  dtOptions: DataTables.Settings = {};
  dataTable1_1: Array<any> = [];
  categoriesTable1_1: Array<any> = [];
  totalTable1_1: Array<any> = [];
  filterPeriod: any;
  chartOptions1_1: Highcharts.Options = {};

  // Table1_2
  dataTable1_2: Array<any> = [];
  categoriesTable1_2: Array<any> = [];
  totalTable1_2: Array<any> = [];

  // Graph1_2 Highcharts
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions1_2: Highcharts.Options = {};

  // Map1_3_1 Leaflet
  dataPolygon_1: any[];
  optionMap: any;
  namePolygon_1: string;
  total_energy_consumption_1: string;
  total_reduction_potential_1: string;
  coordPolygon_1: any[];
  latlngs_1: any[];
  cont: any = 1;
  //map1_3_2: any;
  map1_3: any;

  // **************************** Tables2 ****************************
  filtersTable2: Array<any> = [];
  optionsSelected: any[];
  selectedTable2: any[] = [];
  preSelect2: any;
  beReel2: UntypedFormGroup;
  listTables2: any[] = [];
  tableSelected2: any;
  districtControl = new FormControl();
  districtsSelected: any[] = [];
  titleTable2: any;
  allTable2: any;
  alert2: any;
  chartOptions2: Highcharts.Options = {};
  yAxis2: any;
  unit2: any;
  districtSelected: any[] = [];

  // Table2_1
  filter: string;
  dataTable2_1: Array<any> = [];
  totalTable2_1: Array<any> = [];

  // Table2_2
  dataTable2_2: Array<any> = [];
  totalTable2_2: Array<any> = [];

  // Table2_3
  dataTable2_3: Array<any> = [];
  totalTable2_3: Array<any> = [];

  // Table2_4
  dataTable2_4: Array<any> = [];
  totalTable2_4: Array<any> = [];

  // Table2_5
  dataTable2_5: Array<any> = [];
  totalTable2_5: Array<any> = [];

  // **************************** Tables3 ****************************
  filtersTable3: Array<any> = [];
  listTables3: any[] = [];
  tableSelected3: any;
  beReel3: UntypedFormGroup;
  sectorControl = new FormControl();
  sectorsSelected: any[] = [];
  titleTable3: any;
  allTable3: any;
  alert3: any;
  chartOptions3: Highcharts.Options = {};
  yAxis3: any;
  unit3: any;
  sectorSelected: any[] = [];

  // Table3_1
  dataTable3_1: Array<any> = [];
  totalTable3_1: Array<any> = [];

  // Table3_2
  dataTable3_2: Array<any> = [];
  totalTable3_2: Array<any> = [];

  // Table3_3
  dataTable3_3: Array<any> = [];
  totalTable3_3: Array<any> = [];

  // Table3_4
  dataTable3_4: Array<any> = [];
  totalTable3_4: Array<any> = [];

  // Table3_5
  dataTable3_5: Array<any> = [];
  totalTable3_5: Array<any> = [];
  optionsDownload: any;

  //Download
  tableDownload: any;
  filterDownload: any;

  public rows: Array<any> = [];
  public numElement = 4; // No of elements per Row

  constructor(
    private httpClient: HttpClient,
    private visibilityService: VisibilityService
  ) {
    this.optionsSelected = [];
    this.filter = '';
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
    };
    // Table1_1
    this.httpClient
      .get(apiHighchartsServiceURL + '/highcharts/datamart/table1_1', {
        responseType: 'text',
      })
      .subscribe({
        next: (data) => {
          const list = data.split('\n');

          const catValues = list[0].split(',');
          for (var i = 0; i < catValues.length; i++) {
            const nameCategories = { name: catValues[i] };
            this.categoriesTable1_1.push(nameCategories);
          }

          // Data Table1_1
          var isData: boolean = false;
          list.forEach((e) => {
            if (isData) {
              const values = e.split(',');

              if (values[0] == '0000-1900') {
                this.filterPeriod = 'Before 1900';
              } else {
                this.filterPeriod = values[0];
              }

              const record = {
                period: this.filterPeriod,
                closed: values[1],
                halfopen: values[2],
                open: values[3],
                apartment: values[4],
                other: values[5],
                total: values[6],
              };

              // Total columns (tfoot)
              if (values[0] != 'Total') {
                this.dataTable1_1.push(record);
              } else {
                this.totalTable1_1.push(record);
              }
            } else {
              isData = true;
            }
          });
        },
        error: (error) => {},
      });
    this.chartOptions1_1 = {
      chart: {
        type: 'column',
      },
      title: {
        text: ' ',
      },
      subtitle: {
        text: ' ',
      },
      legend: {
        enabled: true,
      },
      xAxis: {
        crosshair: true,
      },
      yAxis: {
        title: {
          text: 'Number of households',
        },
      },
      data: {
        csvURL: 'localhost/highcharts/datamart/graph1_1',
      },

      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
    };

    //Highcharts.chart('container1_1', this.chartOptions1_1);

    // Table1_2
    this.httpClient
      .get(apiHighchartsServiceURL + '/highcharts/datamart/table1_2', {
        responseType: 'text',
      })
      .subscribe({
        next: (data) => {
          const list = data.split('\n');

          // Categories Table1_2

          const catValues = list[0].split(',');
          for (var i = 0; i < catValues.length; i++) {
            const nameCategories = { name: catValues[i] };
            this.categoriesTable1_2.push(nameCategories);
          }

          // Data Table1_2
          var isData: boolean = false;
          list.forEach((e) => {
            if (isData) {
              const values = e.split(',');

              const record = {
                houses: values[0],
                units: values[1],
                averageArea: values[2],
                totalArea: values[3],
                specificConsumption: values[4],
                totalConsumptionC: values[5],
                totalConsumptionK: values[6],
                reductionPotential: values[7],
              };

              // Total columns (tfoot)
              if (values[0] != 'Total') {
                this.dataTable1_2.push(record);
              } else {
                this.totalTable1_2.push(record);
              }
            } else {
              isData = true;
            }
          });
        },
        error: (error) => {},
      });

    // Graph1_2
    this.chartOptions1_2 = {
      chart: {
        zoomType: 'xy',
      },
      title: {
        text: '  ',
        align: 'left',
      },
      subtitle: {
        text: ' ',
        align: 'left',
      },
      yAxis: [
        {
          // Primary yAxis
          labels: {
            format: '{value}%',
          },
          title: {
            text: '',
          },
          opposite: true,
          max: 100,
        },
        {
          // Secondary yAxis
          gridLineWidth: 0,
          labels: {
            format: '{value}',
          },
          title: {
            text: 'Reduction potential (kWh/yr/m2)',
          },
        },
        {
          // Terciary yAxis
          gridLineWidth: 0,
          labels: {
            format: '{value}%',
          },
          title: {
            text: ' ',
          },
          opposite: true,
          visible: false,
          max: 100,
        },
      ],
      tooltip: {
        shared: true,
      },
      data: {
        csvURL: 'localhost/highcharts/datamart/graph1_2',
      },
      series: [
        {
          type: 'column',
          yAxis: 1,
          tooltip: {
            valueSuffix: ' kWh/yr/m2',
          },
        },
        {
          type: 'spline',
          yAxis: 2,
          marker: {
            enabled: false,
          },
          tooltip: {
            valueSuffix: ' %',
          },
        },
        {
          type: 'spline',
          tooltip: {
            valueSuffix: '%',
          },
        },
        {
          type: 'spline',
          tooltip: {
            valueSuffix: ' MWh/yr',
          },
        },
        {
          type: 'spline',
          tooltip: {
            valueSuffix: ' MWh/yr',
          },
        },
        {
          type: 'spline',
          tooltip: {
            valueSuffix: ' ',
          },
        },
      ],
    };

    // Map1_3_1
    this.dataPolygon_1 = [];
    this.namePolygon_1 = '';
    this.total_energy_consumption_1 = '';
    this.total_reduction_potential_1 = '';
    this.coordPolygon_1 = [];
    this.latlngs_1 = [];

    // Tables2
    this.beReel2 = new UntypedFormGroup({
      table: new UntypedFormControl('', [Validators.required]),
    });

    this.listTables2 = [
      {
        idTable: '2_1',
        title:
          '2.1 Typology of the building stock at district level (number of households)',
        yAxis: 'Number of households',
        unit: ' ',
      },
      {
        idTable: '2_2',
        title:
          '2.2 Total energy consumption, by building type and construction period (MWh/year)',
        yAxis: 'MWh/year',
        unit: 'MWh/year',
      },
      {
        idTable: '2_3',
        title:
          '2.3 Average specific energy consumption, by building type and construction period (kWh/m2)',
        yAxis: 'kWh/m2',
        unit: 'kWh/m2',
      },
      {
        idTable: '2_4',
        title:
          '2.4 Total reduction potential, by building type and construction period (MWh/year)',
        yAxis: 'MWh/year',
        unit: 'MWh/year',
      },
      {
        idTable: '2_5',
        title:
          '2.5 Reduction potential per residential unit, per building type and construction period (MWh/year/unit)',
        yAxis: 'MWh/year/unit',
        unit: 'MWh/year/unit',
      },
    ];

    this.tableSelected2 = '2_1';
    this.httpClient
      .get(apiHighchartsServiceURL + '/highcharts/datamart/get_districts', {
        responseType: 'text',
      })
      .subscribe({
        next: (data) => {
          const list = data.split('\n');
          // Filter --> Table2_1, Table2_2, Table2_3, Table2_4, Table2_5
          var isData: boolean = false;
          this.districtSelected.push(list[1]);

          list.forEach((e) => {
            if (isData) {
              const values = e.split(',');

              if (values[0] != '') {
                this.filtersTable2.push(values[0]);
              }
            } else {
              isData = true;
            }
          });
          this.onChange2('initial');
        },
        error: (error) => {},
      });

    // Tables3
    this.beReel3 = new UntypedFormGroup({
      table: new UntypedFormControl('', [Validators.required]),
    });

    this.listTables3 = [
      {
        idTable: '3_1',
        title:
          '3.1 Typology of the building stock at the level of the statistical sector (number of households)',
        yAxis: 'Number of households',
        unit: ' ',
      },
      {
        idTable: '3_2',
        title:
          '3.2 Total energy consumption, by building type and construction period (MWh/year)',
        yAxis: 'MWh/year',
        unit: 'MWh/year',
      },
      {
        idTable: '3_3',
        title:
          '3.3 Average specific energy consumption, by building type and construction period (kWh/m2)',
        yAxis: 'kWh/m2',
        unit: 'kWh/m2',
      },
      {
        idTable: '3_4',
        title:
          '3.4 Total reduction potential, by building type and construction period (MWh/year)',
        yAxis: 'MWh/year',
        unit: 'MWh/year',
      },
      {
        idTable: '3_5',
        title:
          '3.5 Reduction potential per residential unit, per building type and construction period (MWh/year/unit)',
        yAxis: 'MWh/year/unit',
        unit: 'MWh/year/unit',
      },
    ];
    this.tableSelected3 = '3_1';

    this.httpClient
      .get(apiHighchartsServiceURL + '/highcharts/datamart/get_sectors', {
        responseType: 'text',
      })
      .subscribe({
        next: (data) => {
          const list = data.split('\n');

          // Filter --> Table3_1, Table3_2, Table3_3, Table3_4, Table3_5
          var isData: boolean = false;
          this.sectorSelected.push(list[1]);

          list.forEach((e) => {
            if (isData) {
              const values = e.split(',');
              if (values[0] != '') {
                this.filtersTable3.push(values[0]);
              }
            } else {
              isData = true;
            }
          });
          this.onChange3('initial');
        },
        error: (error) => {},
      });

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
    };
  }

  ngAfterViewInit(): void {
    this.loadMap('initial');
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
    };
  }

  ngOnInit(): void {
    this.rows = Array.from(
      Array(Math.ceil(this.filtersTable3.length / this.numElement)).keys()
    );
    this.visibilityService.changeVisibility(false);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
    };
  }

  // ********* ONCHANG2E *********
  onChange2(msj: any) {
    this.districtsSelected = [];
    if (msj == 'initial') {
      this.districtsSelected.push('BAVIKHOVE');
    } else {
      this.districtsSelected = this.districtControl.value;
    }

    // Update
    this.updateTable(this.districtsSelected, this.beReel2.get('table')?.value);
  }

  // ********* ONCHANGE3 *********
  onChange3(msj: any) {
    this.sectorsSelected = [];
    if (msj == 'initial') {
      this.sectorsSelected.push("'T KOEKSKEN");
    } else {
      this.sectorsSelected = this.sectorControl.value;
    }

    // Update
    this.updateTable(this.sectorsSelected, this.beReel3.get('table')?.value);
  }

  // ********* ONMAPCHANGE *********
  onMapChange(option: any) {
    console.log('opcion seleccionada --> ' + option.value);
    this.loadMap(option.value);
    // Sectors
    /*
    if( option.value == "Sectors"){

      this.map1_3_1 = document.getElementById("map1_3");
      this.map1_3_1.style.display = "none";

      this.map1_3_2 = document.getElementById("map1_3_2");
      this.map1_3_2.style.display = "block";
        

      
    }

    // Districts
    else{

      this.map1_3_2 = document.getElementById("map1_3_2");
      this.map1_3_2.style.display = "none";

      this.map1_3_1 = document.getElementById("map1_3");
      this.map1_3_1.style.display = "block";

      }*/
  }

  // ********* UPDATE TABLE *********
  updateTable(listData: any[], codeTable: any) {
    if (listData.length == 0) {
      if (codeTable[0] == '2') {
        this.totalTable2_1 = [];
        this.dataTable2_1 = [];
        this.alert2 = document.getElementById('alert2');
        this.alert2.style.display = 'block';

        this.allTable2 = document.getElementById('allTable2');
        this.allTable2.style.display = 'none';

        for (var i = 0; i < this.listTables2.length; i++) {
          if (this.listTables2[i].idTable == codeTable) {
            this.titleTable2 = this.listTables2[i].title;
          }
        }
      }
      if (codeTable[0] == '3') {
        this.totalTable3_1 = [];
        this.dataTable3_1 = [];
        this.alert3 = document.getElementById('alert3');
        this.alert3.style.display = 'block';

        this.allTable3 = document.getElementById('allTable3');
        this.allTable3.style.display = 'none';

        for (var i = 0; i < this.listTables3.length; i++) {
          if (this.listTables3[i].idTable == codeTable) {
            this.titleTable3 = this.listTables3[i].title;
          }
        }
      }
    } else {
      // Distinguish between tables 2 (districs) or 3 (sectors) to build the filter
      if (codeTable[0] == '2') {
        this.alert2 = document.getElementById('alert2');
        this.alert2.style.display = 'none';

        this.allTable2 = document.getElementById('allTable2');
        this.allTable2.style.display = 'block';

        this.filter = '?DISTRICT=%27';

        for (var i = 0; i < this.listTables2.length; i++) {
          if (this.listTables2[i].idTable == codeTable) {
            this.titleTable2 = this.listTables2[i].title;
            this.yAxis2 = this.listTables2[i].yAxis;
            this.unit2 = this.listTables2[i].unit;
          }
        }
      }

      if (codeTable[0] == '3') {
        this.alert3 = document.getElementById('alert3');
        this.alert3.style.display = 'none';

        this.allTable3 = document.getElementById('allTable3');
        this.allTable3.style.display = 'block';

        this.filter = '?SECTOR=%27';

        for (var i = 0; i < this.listTables3.length; i++) {
          if (this.listTables3[i].idTable == codeTable) {
            this.titleTable3 = this.listTables3[i].title;
            this.yAxis3 = this.listTables3[i].yAxis;
            this.unit3 = this.listTables3[i].unit;
          }
        }
      }

      // Build filter
      for (var i = 0; i < listData.length; i++) {
        if (i == 0) {
          this.filter += listData[i];
        } else {
          this.filter += '%27,%27' + listData[i];
        }
      }
      this.filter += '%27';
      this.filter = this.filter.replace("'", '%27%27').replace(' ', '%20');

      if (codeTable[0] == '2') {
        //Table2
        this.httpClient
          .get(
            apiHighchartsServiceURL +
              '/highcharts/datamart/table' +
              codeTable +
              this.filter,
            { responseType: 'text' }
          )
          .subscribe({
            next: (data) => {
              const list = data.split('\n');

              // Data
              var isData: boolean = false;

              this.dataTable2_1 = [];
              this.totalTable2_1 = [];

              list.forEach((e) => {
                if (isData) {
                  const values = e.split(',');

                  if (values[0] == '0000-1900') {
                    this.filterPeriod = 'Before 1900';
                  } else {
                    this.filterPeriod = values[0];
                  }

                  const record = {
                    period: this.filterPeriod,
                    closed: values[1],
                    halfopen: values[2],
                    open: values[3],
                    apartment: values[4],
                    other: values[5],
                    total: values[6],
                  };

                  // Total columns (tfoot)
                  if (values[0] != 'Total') {
                    this.dataTable2_1.push(record);
                  } else {
                    this.totalTable2_1.push(record);
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

        this.chartOptions2 = {
          chart: {
            type: 'column',
          },
          title: {
            text: ' ',
          },
          subtitle: {
            text: ' ',
          },
          legend: {
            enabled: true,
          },
          xAxis: {
            crosshair: true,
          },
          yAxis: {
            title: {
              text: this.yAxis2,
            },
          },
          data: {
            csvURL:
              'localhost/highcharts/datamart/graph' + codeTable + this.filter,
          },
          tooltip: {
            valueSuffix: ' ' + this.unit2,
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0,
            },
          },
        };

        Highcharts.chart('container2', this.chartOptions2);
      }

      if (codeTable[0] == '3') {
        //Table3
        this.httpClient
          .get(
            apiHighchartsServiceURL +
              '/highcharts/datamart/table' +
              codeTable +
              this.filter,
            { responseType: 'text' }
          )
          .subscribe({
            next: (data) => {
              const list = data.split('\n');
              var isData: boolean = false;

              this.dataTable3_1 = [];
              this.totalTable3_1 = [];

              list.forEach((e) => {
                if (isData) {
                  const values = e.split(',');

                  if (values[0] == '0000-1900') {
                    this.filterPeriod = 'Before 1900';
                  } else {
                    this.filterPeriod = values[0];
                  }

                  const record = {
                    period: this.filterPeriod,
                    closed: values[1],
                    halfopen: values[2],
                    open: values[3],
                    apartment: values[4],
                    other: values[5],
                    total: values[6],
                  };

                  // Total columns (tfoot)
                  if (values[0] != 'Total') {
                    this.dataTable3_1.push(record);
                  } else {
                    this.totalTable3_1.push(record);
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

        this.chartOptions3 = {
          chart: {
            type: 'column',
          },
          title: {
            text: ' ',
          },
          subtitle: {
            text: ' ',
          },
          legend: {
            enabled: true,
          },
          xAxis: {
            crosshair: true,
          },
          yAxis: {
            title: {
              text: this.yAxis3,
            },
          },
          data: {
            csvURL:
              'localhost/highcharts/datamart/graph' + codeTable + this.filter,
          },
          tooltip: {
            valueSuffix: ' ' + this.unit3,
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0,
            },
          },
        };

        Highcharts.chart('container3', this.chartOptions3);
      }
    }
  }

  downloadData(format: any, table: any) {
    if (table[0] == '1') {
      this.tableDownload = table;
      this.filterDownload = '';
    }
    if (table[0] == '2' || table[0] == '3') {
      if (table[0] == '2') {
        this.tableDownload = this.beReel2.get('table')?.value;
        this.filterDownload = '&DISTRICT=%27';
        this.optionsDownload = this.districtControl.value;
      } else {
        this.tableDownload = this.beReel3.get('table')?.value;
        this.filterDownload = '&SECTOR=%27';
        this.optionsDownload = this.sectorControl.value;
      }

      // Build filter
      for (var i = 0; i < this.optionsDownload.length; i++) {
        if (i == 0) {
          this.filterDownload += this.optionsDownload[i];
        } else {
          this.filterDownload += '%27,%27' + this.optionsDownload[i];
        }
      }

      this.filterDownload += '%27';
      this.filterDownload = this.filterDownload
        .replace("'", '%27%27')
        .replace(' ', '%20');
    }

    let downloadLink = document.createElement('a');
    downloadLink.href =
      'http://localhost:9094' +
      '/highcharts/datamart/table' +
      this.tableDownload +
      '?format=' +
      format +
      this.filterDownload;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  public loadMap(msj: any): void {
    if (msj == 'initial') {
      // Map1_3 Districts
      // [50.897001,3.2672918] --> lat - long
      this.map1_3 = L.map('map1_3', { attributionControl: false }).setView(
        [50.8667, 3.3],
        12
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright"></a>',
      }).addTo(this.map1_3);

      this.httpClient
        .get(apiHighchartsServiceURL + '/highcharts/datamart/map1_3_1', {
          responseType: 'text',
        })
        .subscribe({
          next: (data) => {
            const list = data.split('\n');
            var isData: boolean = false;

            list.forEach((e) => {
              if (isData) {
                // Split the element between its information (name_1, area_1) and its polygon_1
                const values = e.split(',POLYGON((');

                // Information (name_1, area_1)
                this.dataPolygon_1 = values[0].split(',');
                this.namePolygon_1 = this.dataPolygon_1[0].replace("'", "\\'");
                this.total_energy_consumption_1 = this.dataPolygon_1[1];
                this.total_reduction_potential_1 = this.dataPolygon_1[2];

                // Obtain the polygon_1
                this.coordPolygon_1 = values[1]
                  .substring(values[1].indexOf('(('), values[1].indexOf('))'))
                  .split(',');

                // Dump coordinates for the following polygon_1
                this.latlngs_1 = [];

                // Save coordinates_1
                for (var i = 0; i < this.coordPolygon_1.length; i++) {
                  const points = this.coordPolygon_1[i].split(' ');
                  this.latlngs_1.push([
                    points[0].replace(')', ''),
                    points[1].replace('(', ''),
                  ]);
                }

                // Create polygon_1 and tooltip_1
                L.polygon(this.latlngs_1, { color: '#FF000090' })
                  .addTo(this.map1_3)
                  .bindTooltip(
                    this.namePolygon_1 +
                      '<br>Total energy consumption: ' +
                      this.total_energy_consumption_1 +
                      ' MWh/year<br>Total reduction potential: ' +
                      this.total_reduction_potential_1 +
                      ' MWh/year'
                  );
              } else {
                isData = true;
              }
            });
          },
          error: (error) => {},
        });
    }

    if (msj == 'Sectors') {
      this.map1_3.remove();

      this.map1_3 = L.map('map1_3', { attributionControl: false }).setView(
        [50.8667, 3.3],
        12
      );
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,

        tileSize: 512,
        zoomOffset: -1,
      }).addTo(this.map1_3);

      this.httpClient
        .get(apiHighchartsServiceURL + '/highcharts/datamart/map1_3_1', {
          responseType: 'text',
        })
        .subscribe({
          next: (data) => {
            const list = data.split('\n');
            var isData: boolean = false;

            list.forEach((e) => {
              if (isData) {
                // Split the element between its information (name_1, area_1) and its polygon_1
                const values = e.split(',POLYGON((');

                // Information (name_1, area_1)
                this.dataPolygon_1 = values[0].split(',');
                this.namePolygon_1 = this.dataPolygon_1[0].replace("'", "\\'");
                this.total_energy_consumption_1 = this.dataPolygon_1[1];
                this.total_reduction_potential_1 = this.dataPolygon_1[2];

                // Obtain the polygon_1
                this.coordPolygon_1 = values[1]
                  .substring(values[1].indexOf('(('), values[1].indexOf('))'))
                  .split(',');

                // Dump coordinates for the following polygon_1
                this.latlngs_1 = [];

                // Save coordinates_1
                for (var i = 0; i < this.coordPolygon_1.length; i++) {
                  const points = this.coordPolygon_1[i].split(' ');
                  this.latlngs_1.push([
                    points[0].replace(')', ''),
                    points[1].replace('(', ''),
                  ]);
                }

                // Create polygon_1 and tooltip_1
                L.polygon(this.latlngs_1, { color: '#FF000090' })
                  .addTo(this.map1_3)
                  .bindTooltip(
                    this.namePolygon_1 +
                      '<br>Total energy consumption: ' +
                      this.total_energy_consumption_1 +
                      ' MWh/year<br>Total reduction potential: ' +
                      this.total_reduction_potential_1 +
                      ' MWh/year'
                  );
              } else {
                isData = true;
              }
            });
          },
          error: (error) => {},
        });
    }
    if (msj == 'Districts') {
      this.map1_3.remove();
      this.map1_3 = L.map('map1_3', { attributionControl: false }).setView(
        [50.8667, 3.3],
        12
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright"></a>',
      }).addTo(this.map1_3);

      this.httpClient
        .get(apiHighchartsServiceURL + '/highcharts/datamart/map1_3_2', {
          responseType: 'text',
        })
        .subscribe({
          next: (data) => {
            const list = data.split('\n');
            var isData: boolean = false;

            list.forEach((e) => {
              if (isData) {
                // Split the element between its information (name_1, area_1) and its polygon_1
                const values = e.split(',MULTIPOLYGON(((');

                // Information (name_1, area_1)
                this.dataPolygon_1 = values[0].split(',');
                this.namePolygon_1 = this.dataPolygon_1[0];
                this.total_energy_consumption_1 = this.dataPolygon_1[1];
                this.total_reduction_potential_1 = this.dataPolygon_1[2];

                // console.log("dataPolygon_1 -->"+this.dataPolygon_1);
                // console.log("namePolygon_1 --> "+this.namePolygon_1);
                // console.log("total_energy_consumption_1 --> "+this.total_energy_consumption_1);
                // console.log("total_reduction_potential_1 --> "+this.total_reduction_potential_1);

                // Obtain the polygon_1
                this.coordPolygon_1 = values[1]
                  .substring(values[1].indexOf('((('), values[1].indexOf(')))'))
                  .split(',');

                // Dump coordinates for the following polygon_1
                this.latlngs_1 = [];

                // Save coordinates_1
                for (var i = 0; i < this.coordPolygon_1.length; i++) {
                  const points = this.coordPolygon_1[i].split(' ');
                  this.latlngs_1.push([
                    points[1].replace(')', ''),
                    points[0].replace('(', ''),
                  ]);
                }

                // Create polygon_1 and tooltip_1
                L.polygon(this.latlngs_1, { color: '#FF000090' })
                  .addTo(this.map1_3)
                  .bindTooltip(
                    this.namePolygon_1 +
                      '<br>Total energy consumption: ' +
                      this.total_energy_consumption_1 +
                      ' MWh/year<br>Total reduction potential: ' +
                      this.total_reduction_potential_1 +
                      ' MWh/year'
                  );
              } else {
                isData = true;
              }
            });
          },
          error: (error) => {},
        });
    }
  }

  // Set Default View
  setDefaultView() {
    this.map1_3.setView([50.8667, 3.3], 12);
  }
  ngOnDestroy() {
    this.visibilityService.changeVisibility(true);
  }
}
