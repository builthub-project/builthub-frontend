import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import * as Highcharts from 'highcharts';
import { VisibilityService } from 'app/services/visibility.service';

const apiHighchartsServiceURL = 'localhost';

// EU27 and EU28
const listEU27 = [
  'Cyprus',
  'Italy',
  'Hungary',
  'Luxembourg',
  'Sweden',
  'Netherlands',
  'Romania',
  'Austria',
  'Ireland',
  'Germany',
  'Portugal',
  'Finland',
  'Malta',
  'Lithuania',
  'Spain',
  'Bulgaria',
  'Croatia',
  'Latvia',
  'Slovenia',
  'Greece',
  'Belgium',
  'France',
  'Estonia',
  'Slovakia',
  'Poland',
  'Denmark',
  'Czechia',
];
const listEU28 = [
  'Cyprus',
  'Italy',
  'Hungary',
  'Luxembourg',
  'Sweden',
  'United Kingdom',
  'Netherlands',
  'Romania',
  'Austria',
  'Ireland',
  'Germany',
  'Portugal',
  'Finland',
  'Malta',
  'Lithuania',
  'Spain',
  'Bulgaria',
  'Croatia',
  'Latvia',
  'Slovenia',
  'Greece',
  'Belgium',
  'France',
  'Estonia',
  'Slovakia',
  'Poland',
  'Denmark',
  'Czechia',
];

@Component({
  selector: 'app-dashboard-emissions',
  templateUrl: './dashboard-emissions.component.html',
  styleUrls: ['./dashboard-emissions.component.css'],
})
export class DashboardEmissionsComponent implements OnInit, OnDestroy {
  header: any;

  // PaginationlectedCountry
  p: number = 1;
  total: number = 0;

  // Form
  emissionsForm: UntypedFormGroup;
  countriesList: any[] = [];
  yearsList: any[] = [];
  indicatorList: any[] = [];
  sectorList: any[] = [];

  // Default values
  // Country
  selectedCountry: any[] = [];

  // Year
  selectedYear: any[] = [];

  // Indicator name
  isSelectedIndicator: boolean;
  selectedIndicator: any[] = [];

  // Sector name
  isSelectedSector: boolean;
  selectedSector: any[] = [];

  // Build Filters
  // Country
  countryFilter: any;
  nameCountry: any;
  allCountriesSelected: any;

  // Years
  yearFilter: any;
  nameYear: any;

  // Indicator name
  indicatorFilter: any;
  nameIndicator: any;

  // Sector
  sectorFilter: any;
  nameSector: any;

  // Table
  dataTable1: any[] = [];

  // Map
  map1: any;
  urlMap: any;
  // Polygon
  dataPolygon: any;
  namePolygon: any;
  polygonGroup: any;
  subPolygon: any;
  subPolygon2: any;
  latlngs: any[] = [];

  // Graphs
  Highcharts: typeof Highcharts = Highcharts;

  // Pie chart
  chartOptionsPie: Highcharts.Options = {};

  // Column Chart
  chartOptionsColumn: Highcharts.Options = {};
  mapColumn: Map<string, string[]> = new Map([]);
  seriesColumn: any[] = [];
  categoriesColumn: any[] = [];
  isRepeat: boolean = false;

  // Download
  urlDownload: any;

  constructor(
    private httpClient: HttpClient,
    private visibilityService: VisibilityService
  ) {
    // Initialize form
    this.emissionsForm = new UntypedFormGroup({
      country: new UntypedFormControl('', [Validators.required]),
      groups: new UntypedFormControl(''),
      year: new UntypedFormControl('', [Validators.required]),
      indicator: new UntypedFormControl('', [Validators.required]),
      sector: new UntypedFormControl('', [Validators.required]),
    });

    // Init countryFilter
    this.httpClient
      .get(apiHighchartsServiceURL + '/highcharts/datamart/em_country_filter', {
        responseType: 'text',
      })
      .subscribe({
        next: (data) => {
          const list = data.split('\n');
          var isData: boolean = false;

          this.selectedCountry = ['Austria', 'Belgium', 'Bulgaria'];

          list.forEach((e) => {
            if (isData) {
              const values = e.split(',');
              this.countriesList.push(values[0]);
            } else {
              isData = true;
            }
          });
        },
        error: (error) => {},
      });

    // Init yearFilter
    this.selectedYear = ['2018', '2017', '2016', '2015'];
    this.httpClient
      .get(apiHighchartsServiceURL + '/highcharts/datamart/em_year_filter', {
        responseType: 'text',
      })
      .subscribe({
        next: (data) => {
          const list = data.split('\n');
          var isData: boolean = false;

          list.forEach((e) => {
            if (isData) {
              const values = e.split(',');
              this.yearsList.push(values[0]);
            } else {
              isData = true;
            }
          });
        },
        error: (error) => {},
      });

    // Init indicatorFilter
    this.isSelectedIndicator = false;
    this.httpClient
      .get(
        apiHighchartsServiceURL +
          '/highcharts/datamart/em_measuredelement_filter',
        { responseType: 'text' }
      )
      .subscribe({
        next: (data) => {
          const list = data.split('\n');
          var isData: boolean = false;

          list.forEach((e) => {
            if (isData) {
              const values = e.split(',');
              this.indicatorList.push(values[0]);

              if (this.isSelectedIndicator == false) {
                this.selectedIndicator.push(values[0]);
                this.isSelectedIndicator = true;
              }
            } else {
              isData = true;
            }
          });
        },
        error: (error) => {},
      });

    // Init sectorFilter
    this.isSelectedSector = false;
    this.httpClient
      .get(apiHighchartsServiceURL + '/highcharts/datamart/em_sector_filter', {
        responseType: 'text',
      })
      .subscribe({
        next: (data) => {
          const list = data.split('\n');
          var isData: boolean = false;

          list.forEach((e) => {
            if (isData) {
              const values = e.split(',');
              this.sectorList.push(values[0]);

              if (this.isSelectedSector == false) {
                this.selectedSector.push(values[0]);
                this.isSelectedSector = true;
              }
            } else {
              isData = true;
            }
          });
        },
        error: (error) => {},
      });

    // Initialize table
    this.httpClient
      .get(
        apiHighchartsServiceURL +
          '/highcharts/datamart/em_table1?COUNTRY=%27Austria%27,%27Belgium%27,%27Bulgaria%27&YEAR=%272018%27,%272017%27,%272016%27,%272015%27&INDICATOR=%27CO2bySector%27&SECTOR=%27Buildings%27',
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

              const record = {
                country: values[0],
                nuts: values[1],
                sector: values[2],
                indicator: values[3],
                period: values[4],
                value: values[5],
              };

              this.dataTable1.push(record);
            } else {
              isData = true;
            }
          });
        },
        error: (error) => {},
      });

    // Initialize pieGraph
    this.chartOptionsPie = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Emissions per Country',
        style: {
          color: '#FFA84A',
          fontWeight: 'bold',
        },
      },
      legend: {
        enabled: true,
      },
      xAxis: {
        crosshair: true,
      },
      yAxis: {
        title: {
          text: ' ',
        },
      },
      data: {
        csvURL:
          apiHighchartsServiceURL +
          '/highcharts/datamart/em_piechart?COUNTRY=%27Austria%27,%27Belgium%27,%27Bulgaria%27&YEAR=%272018%27,%272017%27,%272016%27,%272015%27&INDICATOR=%27CO2bySector%27&SECTOR=%27Buildings%27',
      },
      series: [
        {
          type: 'pie',
        },
      ],
      tooltip: {
        pointFormat: 'Value: {point.percentage:.1f} %',
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            format:
              '<b>{point.name}:</b> {point.y}  ({point.percentage:.1f} %)',
          },
        },
      },
    };

    // Initialize columnChart
    this.chartOptionsColumn = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Emissions per Year and Sector',
        style: {
          color: '#FFA84A',
          fontWeight: 'bold',
        },
      },
      legend: {
        enabled: true,
      },
      xAxis: {
        crosshair: true,
      },
      yAxis: {
        title: {
          text: 'Emissions in MtCO2',
        },
      },
      data: {
        csvURL:
          apiHighchartsServiceURL +
          '/highcharts/datamart/em_columnchart_init?COUNTRY=%27Austria%27,%27Belgium%27,%27Bulgaria%27&YEAR=%272018%27,%272017%27,%272016%27,%272015%27&INDICATOR=%27CO2bySector%27&SECTOR=%27Buildings%27',
      },
    };
  }
  ngOnInit(): void {
    this.visibilityService.changeVisibility(false);
  }
  ngAfterViewInit() {
    this.loadMap('initial');
  }

  // Filter change
  onFilterChange() {
    if (
      this.emissionsForm.get('country')?.value != '' &&
      this.emissionsForm.get('year')?.value != '' &&
      this.emissionsForm.get('indicator')?.value != '' &&
      this.emissionsForm.get('sector')?.value != ''
    ) {
      // console.log(" - Country --> "+this.emissionsForm.get('country')?.value);
      // console.log(" - Year --> "+this.emissionsForm.get('year')?.value.length);
      // console.log(" - Indicator --> "+this.emissionsForm.get('indicator')?.value);
      // console.log(" - Sector --> "+this.emissionsForm.get('sector')?.value);

      // COUNTRY FILTERS
      this.countryFilter = '?COUNTRY=%27';
      this.nameCountry = '';

      if (this.emissionsForm.get('country')?.value == '27') {
        this.allCountriesSelected = listEU27;
      }
      if (this.emissionsForm.get('country')?.value == '28') {
        this.allCountriesSelected = listEU28;
      }
      if (
        this.emissionsForm.get('country')?.value != '27' &&
        this.emissionsForm.get('country')?.value != '28'
      ) {
        this.allCountriesSelected = this.emissionsForm.get('country')?.value;
      }

      for (var i = 0; i < this.allCountriesSelected.length; i++) {
        if (i == 0) {
          for (var z = 0; z < this.allCountriesSelected[i].length; z++) {
            if (this.allCountriesSelected[i][z] == ' ') {
              this.nameCountry += '%20';
            } else {
              this.nameCountry += this.allCountriesSelected[i][z];
            }
          }
        } else {
          this.nameCountry += '%27,%27';
          for (var z = 0; z < this.allCountriesSelected[i].length; z++) {
            if (this.allCountriesSelected[i][z] == ' ') {
              this.nameCountry += '%20';
            } else {
              this.nameCountry += this.allCountriesSelected[i][z];
            }
          }
        }
      }
      this.countryFilter += this.nameCountry + '%27&';

      // YEAR FILTERS
      this.yearFilter = 'YEAR=%27';
      this.nameYear = '';

      for (var i = 0; i < this.emissionsForm.get('year')?.value.length; i++) {
        if (i == 0) {
          this.nameYear += this.emissionsForm.get('year')?.value[i];
        } else {
          this.nameYear += '%27,%27' + this.emissionsForm.get('year')?.value[i];
        }
      }
      this.yearFilter += this.nameYear + '%27&';

      // INDICATOR FILTERS
      this.indicatorFilter = 'INDICATOR=%27';
      this.nameIndicator = '';
      for (
        var i = 0;
        i < this.emissionsForm.get('indicator')?.value.length;
        i++
      ) {
        if (i == 0) {
          this.nameIndicator += this.emissionsForm.get('indicator')?.value[i];
        } else {
          this.nameIndicator +=
            '%27,%27' + this.emissionsForm.get('indicator')?.value[i];
        }
      }
      this.indicatorFilter += this.nameIndicator + '%27&';

      // SECTOR FILTERS
      this.sectorFilter = 'SECTOR=%27';
      this.nameSector = '';

      for (var i = 0; i < this.emissionsForm.get('sector')?.value.length; i++) {
        if (i == 0) {
          for (
            var z = 0;
            z < this.emissionsForm.get('sector')?.value[i].length;
            z++
          ) {
            if (this.emissionsForm.get('sector')?.value[i][z] == ' ') {
              this.nameSector += '%20';
            } else {
              this.nameSector += this.emissionsForm.get('sector')?.value[i][z];
            }
          }
        } else {
          this.nameSector += '%27,%27';
          for (
            var z = 0;
            z < this.emissionsForm.get('sector')?.value[i].length;
            z++
          ) {
            if (this.emissionsForm.get('sector')?.value[i][z] == ' ') {
              this.nameSector += '%20';
            } else {
              this.nameSector += this.emissionsForm.get('sector')?.value[i][z];
            }
          }
        }
      }
      this.sectorFilter += this.nameSector + '%27';

      // console.log(" - Country filter --> "+this.countryFilter);
      // console.log(" - Year filter --> "+this.yearFilter);
      // console.log(" - Indicator filter -->"+this.indicatorFilter);
      // console.log(" - Sector filter --> "+this.sectorFilter);

      // Get Data
      //console.log("url --> "+apiHighchartsServiceURL + "/highcharts/datamart/em_table1"+this.countryFilter+this.yearFilter+this.indicatorFilter+this.sectorFilter);

      this.httpClient
        .get(
          apiHighchartsServiceURL +
            '/highcharts/datamart/em_table1' +
            this.countryFilter +
            this.yearFilter +
            this.indicatorFilter +
            this.sectorFilter,
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

                const record = {
                  country: values[0],
                  nuts: values[1],
                  sector: values[2],
                  indicator: values[3],
                  period: values[4],
                  value: values[5],
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
    this.urlDownload =
      this.countryFilter +
      this.yearFilter +
      this.indicatorFilter +
      this.sectorFilter;
    this.updatePieChart(
      apiHighchartsServiceURL +
        '/highcharts/datamart/em_piechart' +
        this.countryFilter +
        this.yearFilter +
        this.indicatorFilter +
        this.sectorFilter
    );
    this.updateColumnChart(
      apiHighchartsServiceURL +
        '/highcharts/datamart/em_columnchart' +
        this.countryFilter +
        this.yearFilter +
        this.indicatorFilter +
        this.sectorFilter
    );
    this.loadMap(
      this.countryFilter +
        this.yearFilter +
        this.indicatorFilter +
        this.sectorFilter
    );
  }

  // Groups change
  updateCountry(event: any) {
    if (event.value == '27') {
      this.selectedCountry = listEU27;
    }
    if (event.value == '28') {
      this.selectedCountry = listEU28;
    }
    if (event.value == ' ') {
      this.selectedCountry = [];
    }
    this.onFilterChange();
  }

  // Update PieChart
  updatePieChart(url: any) {
    this.chartOptionsPie = {
      chart: {
        type: 'pie',
      },
      title: {
        text: 'Emissions per Country',
        style: {
          color: '#FFA84A',
          fontWeight: 'bold',
        },
      },
      legend: {
        enabled: true,
      },
      xAxis: {
        crosshair: true,
      },
      yAxis: {
        title: {
          text: ' ',
        },
      },
      data: {
        csvURL: url,
      },
      series: [
        {
          type: 'pie',
        },
      ],
      tooltip: {
        pointFormat: 'Value: {point.percentage:.1f} %',
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            format:
              '<b>{point.name}:</b> {point.y}  ({point.percentage:.1f} %)',
          },
        },
      },
    };
    Highcharts.chart('container-pie', this.chartOptionsPie);
  }

  // Update ColumnChart
  updateColumnChart(url: any) {
    this.httpClient.get(url, { responseType: 'text' }).subscribe({
      next: (data) => {
        const list = data.split('\n');
        var isData: boolean = false;

        this.mapColumn.clear();
        this.seriesColumn = [];
        this.categoriesColumn = [];

        list.forEach((e) => {
          this.isRepeat = false;
          if (isData) {
            const values = e.split(',');

            // Categories --> years
            if (values[0] != '') {
              for (
                var i = 0;
                i < this.categoriesColumn.length && this.isRepeat == false;
                i++
              ) {
                if (this.categoriesColumn[i] == values[0]) {
                  this.isRepeat = true;
                }
              }
              if (this.isRepeat == false) {
                this.categoriesColumn.push(values[0]);
              }
            }

            // Series --> name: sector, data: values
            if (this.mapColumn.has(values[1])) {
              const serie = this.mapColumn.get(values[1]);

              if (serie) {
                serie.push(values[2]);
              }
            } else {
              this.mapColumn.set(values[1], [values[2]]);
            }
          } else {
            isData = true;
          }
        });

        for (let entry of this.mapColumn.entries()) {
          if (entry[0] != undefined) {
            var datos: any = {
              name: entry[0],
              data: [],
            };

            for (var z = 0; z < entry[1].length; z++) {
              datos.data.push(parseFloat(entry[1][z]));
            }

            this.seriesColumn.push(datos);
          }
        }

        this.chartOptionsColumn = {
          chart: {
            type: 'column',
          },
          title: {
            text: 'Emissions per Year and Sector',
            style: {
              color: '#FFA84A',
              fontWeight: 'bold',
            },
          },
          legend: {
            enabled: true,
          },
          xAxis: {
            categories: this.categoriesColumn,
            crosshair: true,
          },
          yAxis: {
            title: {
              text: 'Emissions in MtCO2',
            },
          },
          plotOptions: {
            column: {
              dataLabels: {
                enabled: false,
              },
            },
            series: {
              stacking: 'normal',
            },
          },
          series: this.seriesColumn,
        };

        Highcharts.chart('container-column', this.chartOptionsColumn);
      },
      error: (error) => {},
    });
  }

  // Page configuration
  pageChangeEvent(event: any) {
    this.p = event;
    this.onFilterChange();
  }

  // Map configuration
  public loadMap(msj: any): void {
    if (msj == 'initial') {
      this.map1 = L.map('map1', { attributionControl: false }).setView(
        [47.3333, 13.3333],
        4
      );
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1,
      }).addTo(this.map1);

      this.urlMap =
        '?COUNTRY=%27Austria%27,%27Belgium%27,%27Bulgaria%27&YEAR=%272018%27,%272017%27,%272016%27,%272015%27&INDICATOR=%27CO2bySector%27&SECTOR=%27Buildings%27';
    } else {
      this.urlMap = msj;

      this.map1.remove();

      this.map1 = L.map('map1', { attributionControl: false }).setView(
        [47.3333, 13.3333],
        4
      );
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,

        tileSize: 512,
        zoomOffset: -1,
      }).addTo(this.map1);
    }

    this.httpClient
      .get(
        apiHighchartsServiceURL + '/highcharts/datamart/em_map' + this.urlMap,
        { responseType: 'text' }
      )
      .subscribe({
        next: (data) => {
          const list = data.split('\n');
          var isData: boolean = false;

          list.forEach((e) => {
            if (isData) {
              if (e != '') {
                // Split the element between its name and its polygon
                const values = e.split(',MULTIPOLYGON(((');

                // Name
                this.dataPolygon = values[0].split(',');
                this.namePolygon = this.dataPolygon[0];

                // Polygon
                this.polygonGroup = values[1].split(')),((');

                for (var z = 0; z < this.polygonGroup.length; z++) {
                  if (this.polygonGroup[z].includes('),(') != false) {
                    this.subPolygon = this.polygonGroup[z].split('),(');

                    for (var x = 0; x < this.subPolygon.length; x++) {
                      this.subPolygon2 = this.subPolygon[x].split(',');
                      this.latlngs = [];

                      for (var j = 0; j < this.subPolygon2.length; j++) {
                        const points = this.subPolygon2[j].split(' ');
                        this.latlngs.push([
                          points[1].replace(')))', ''),
                          points[0].replace('((', ''),
                        ]);
                      }
                      L.polygon(this.latlngs, { color: '#FF000090' })
                        .addTo(this.map1)
                        .bindTooltip(this.namePolygon);
                    }
                  } else {
                    this.subPolygon = this.polygonGroup[z].split(',');
                    this.latlngs = [];

                    for (var x = 0; x < this.subPolygon.length; x++) {
                      const points = this.subPolygon[x].split(' ');
                      this.latlngs.push([
                        points[1].replace(')))', ''),
                        points[0].replace('(', ''),
                      ]);
                    }

                    L.polygon(this.latlngs, { color: '#FF000090' })
                      .addTo(this.map1)
                      .bindTooltip(this.namePolygon);
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

  // Set Default View
  setDefaultView() {
    this.map1.setView([47.3333, 13.3333], 4);
  }

  // Download data
  downloadData(format: any) {
    if (this.urlDownload == undefined) {
      this.urlDownload =
        'COUNTRY=%27Austria%27,%27Belgium%27,%27Bulgaria%27&YEAR=%272018%27,%272017%27,%272016%27,%272015%27&INDICATOR=%27CO2bySector%27&SECTOR=%27Buildings%27';
    }
    let downloadLink = document.createElement('a');
    downloadLink.href =
      'localhost/highcharts/datamart/em_table1?format=' +
      format +
      '&' +
      this.urlDownload;

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  ngOnDestroy() {
    this.visibilityService.changeVisibility(true);
  }
}
