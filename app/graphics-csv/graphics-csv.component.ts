import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as Highcharts from 'highcharts';
import { HttpClient } from '@angular/common/http';

import HC_data from 'highcharts/modules/data';
HC_data(Highcharts);

import HighchartsBoost from 'highcharts/modules/boost';
import { FormControl, FormGroup } from '@angular/forms';
import { VisibilityService } from 'app/services/visibility.service';

HighchartsBoost(Highcharts);

@Component({
  selector: 'app-graphics-csv',
  templateUrl: './graphics-csv.component.html',
  styleUrls: ['./graphics-csv.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphicsCsvComponent implements OnInit, OnDestroy {
  // Highcharts
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions8: Highcharts.Options = {};
  chartOptions22: Highcharts.Options = {};
  chartOptions23: Highcharts.Options = {};
  chartOptions6: Highcharts.Options = {};
  chartOptions7: Highcharts.Options = {};

  // Regions
  contAll: any;
  contUK: any;

  // Graph22 and Graph23
  products: any = [];
  rows: any;

  productsGraph6_7: any = [];
  rowsGraph6_7: any = [];

  listCont: any[] = [];
  listContUk22: any[] = [];
  listContUk23: any[] = [];
  coolingUK: any;
  heatingUK: any;

  domesticHotWaterUKGraph22: any;
  categoriesGraph22: any[] = [];
  domesticHotWaterGraph22: any[] = [];

  coolingGraph22: any[] = [];
  heatingGraph22: any[] = [];
  coolingUkGraph22: any;
  heatingUkGraph22: any;
  domesticHotWaterGraph23: any[] = [];
  categoriesGraph23: any[] = [];
  coolingGraph23: any[] = [];
  heatingGraph23: any[] = [];

  domesticHotWaterUKGraph23: any;
  coolingUkGraph23: any;
  heatingUkGraph23: any;

  // Graph21
  energyUK: any;
  averageUK: any;
  categoriesGraph21: any[] = [];
  energyGraph21: any[] = [];
  averageGraph21: any[] = [];
  energyConsumption!: FormGroup;
  ageSelected!: FormControl;
  ageValue: any = 2019;
  apiHighchartsServiceURL = 'localhost';
  yearsList: any[] = ['2014', '2015', '2016', '2017', '2018', '2019'];
  yearsListGraph_Ds016: any[] = [
    '2010',
    '2011',
    '2012',
    '2013',
    '2014',
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2021',
    '2022',
  ];

  energyConsumptionForm!: FormGroup;
  ageSelected2!: FormControl;
  ageValue2: any = 2022;
  energyValue: any = 'Space Heating';
  energydata: any = 'Energy consumption in space heating';
  energyList: any[] = ['Space Heating', 'Domestic Hot Water'];
  arraysMerged: any[] = [];
  finalArray: any[] = [];
  countries: any[] = [];
  liquefied: any[] = [];
  oil: any[] = [];
  solidFossil: any[] = [];
  gasOil: any[] = [];
  otherKerosene: any[] = [];
  updateFlag = false;
  series: any[] = [];
  countriesFuel: any[] = [];

  Electricity: any[] = [];
  Heat: any[] = [];
  NaturalGas: any[] = [];
  OilAndPetroleum: any[] = [];
  OtherFuels: any[] = [];
  Renewables: any[] = [];
  Solid: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private visibilityService: VisibilityService
  ) {
    // Graph8: Final energy consumption per inhabitant and energy carrier (filter Electricity)
    this.energyConsumption = new FormGroup({
      ageSelected: new FormControl(''),
    });
    this.energyConsumptionForm = new FormGroup({
      ageSelected2: new FormControl(''),
      energySelected: new FormControl(''),
    });

    this.finalEnergyConsumption();

    //GraphRegion
    this.httpClient
      .get('localhost/highcharts/graph_region', {
        headers: { Accept: 'text', 'Content-Type': 'text' },
        responseType: 'text',
      })
      .subscribe((data) => {
        this.products = data;
        this.rows = this.products.split(/\n/).slice(1);
        this.contAll = -0.5;

        for (var i = 0; i < this.rows.length; i++) {
          // Row
          const row = this.rows[i].split(',');

          if (row[0] != '') {
            if (i == 0) {
              this.contUK = Number(row[1]);
            } else {
              this.listCont.push(this.contAll + Number(row[1]));
              this.contAll += Number(row[1]);
              if (i == this.rows.length - 2) {
                this.listCont.push(this.contAll + this.contUK);
              }
            }
          }
        }

        this.httpClient
          .get('localhost/highcharts/graph_21', {
            headers: { Accept: 'text', 'Content-Type': 'text' },
            responseType: 'text',
          })
          .subscribe((data) => {
            this.products = data;
            this.rows = this.products.split(/\n/).slice(1);

            for (var i = 0; i < this.rows.length; i++) {
              // Row
              const row = this.rows[i].split(',');

              if (row[0] != '') {
                if (i == 0) {
                  this.heatingUkGraph22 = parseFloat(row[2]);
                  this.coolingUkGraph22 = parseFloat(row[3]);
                  this.domesticHotWaterUKGraph22 = parseFloat(row[4]);
                  this.heatingUkGraph23 = parseFloat(row[2]);
                  this.coolingUkGraph23 = parseFloat(row[3]);
                  this.domesticHotWaterUKGraph23 = parseFloat(row[4]);
                } else {
                  this.categoriesGraph22.push(row[0]);
                  this.categoriesGraph23.push(row[0]);
                  this.heatingGraph22.push(parseFloat(row[2]));
                  this.coolingGraph22.push(parseFloat(row[3]));
                  this.domesticHotWaterGraph23.push(parseFloat(row[4]));
                  this.heatingGraph23.push(parseFloat(row[2]));
                  this.coolingGraph23.push(parseFloat(row[3]));
                  this.domesticHotWaterGraph22.push(parseFloat(row[4]));
                  if (i == this.rows.length - 2) {
                    this.categoriesGraph22.push('United Kingdom');
                    this.domesticHotWaterGraph22.push(
                      this.domesticHotWaterUKGraph22
                    );
                    this.coolingGraph22.push(this.coolingUkGraph22);
                    this.heatingGraph22.push(this.heatingUkGraph22);
                    this.categoriesGraph23.push('United Kingdom');
                    this.domesticHotWaterGraph23.push(
                      this.domesticHotWaterUKGraph23
                    );
                    this.coolingGraph23.push(this.coolingUkGraph23);
                    this.heatingGraph23.push(this.heatingUkGraph23);
                  }
                }
              }
            }

            this.listContUk22 = this.rows[0].split(',');
            this.listContUk23 = this.rows[0].split(',');

            // Graph22: Specific final energy consumption and end-use
            this.chartOptions22 = {
              chart: {
                type: 'column',
              },

              title: {
                text: '',
              },
              subtitle: {
                text: 'Year: 2016 <br> Source: Hotmaps',
              },
              legend: {
                enabled: true,
              },
              colors: ['#EE743B', '#34393B', '#F8AD3C'],
              xAxis: {
                crosshair: true,
                categories: this.categoriesGraph22,
                plotBands: [
                  {
                    color: '#f5f5f5',
                    from: -0.5,
                    to: this.listCont[0],
                    label: {
                      text: 'Continental',
                      align: 'center',
                      verticalAlign: 'top',
                      style: {
                        color: '#666666',
                      },
                    },
                  },
                  {
                    color: '#ffffff',
                    from: this.listCont[0],
                    to: this.listCont[1],
                    label: {
                      text: 'Mediterranean',
                      align: 'center',
                      verticalAlign: 'top',
                      style: {
                        color: '#666666',
                      },
                    },
                  },
                  {
                    color: '#f5f5f5',
                    from: this.listCont[1],
                    to: this.listCont[2],
                    label: {
                      text: 'Nordic',
                      align: 'center',
                      verticalAlign: 'top',
                      style: {
                        color: '#666666',
                      },
                    },
                  },
                  {
                    color: '#ffffff',
                    from: this.listCont[2],
                    to: this.listCont[3],
                    label: {
                      text: 'Oceanic',
                      align: 'center',
                      verticalAlign: 'top',
                      style: {
                        color: '#666666',
                      },
                    },
                  },
                  {
                    color: '#f5f5f5',
                    from: this.listCont[3],
                    to: this.listCont[4],
                    label: {
                      text: 'UK',
                      align: 'center',
                      verticalAlign: 'top',
                      style: {
                        color: '#666666',
                      },
                    },
                  },
                ],
              },

              yAxis: {
                title: {
                  text: 'kWh/m2/yr',
                },
              },
              tooltip: {
                valueSuffix: ' kWh/m2/yr',
                pointFormat:
                  '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:.2f} kWh/m2/yr</b>',
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
              series: [
                {
                  name: 'Space_Heating',
                  type: 'column',
                  data: this.heatingGraph22,
                },
                {
                  name: 'Space_Cooling',
                  type: 'column',
                  data: this.coolingGraph22,
                },
                {
                  name: 'Domestic_Hot_Water',
                  type: 'column',
                  data: this.domesticHotWaterGraph22,
                },
              ],
            };

            this.Preloader('container22', 'loader22', 'remove');

            Highcharts.chart('container22', this.chartOptions22);

            //Graph23: Specific final energy consumption and end-use
            this.chartOptions23 = {
              chart: {
                type: 'column',
              },
              title: {
                text: '',
              },
              subtitle: {
                text: 'Year: 2016 <br> Source: Hotmaps',
              },
              legend: {
                enabled: true,
              },
              colors: ['#EE743B', '#34393B', '#F8AD3C'],
              xAxis: {
                crosshair: true,
                categories: this.categoriesGraph23,
                plotBands: [
                  {
                    color: '#f5f5f5',
                    from: -0.5,
                    to: this.listCont[0],
                    label: {
                      text: 'Continental',
                      align: 'center',
                      verticalAlign: 'top',
                      style: {
                        color: '#666666',
                      },
                    },
                  },
                  {
                    color: '#ffffff',
                    from: this.listCont[0],
                    to: this.listCont[1],
                    label: {
                      text: 'Mediterranean',
                      align: 'center',
                      verticalAlign: 'top',
                      style: {
                        color: '#666666',
                      },
                    },
                  },
                  {
                    color: '#f5f5f5',
                    from: this.listCont[1],
                    to: this.listCont[2],
                    label: {
                      text: 'Nordic',
                      align: 'center',
                      verticalAlign: 'top',
                      style: {
                        color: '#666666',
                      },
                    },
                  },
                  {
                    color: '#ffffff',
                    from: this.listCont[2],
                    to: this.listCont[3],
                    label: {
                      text: 'Oceanic',
                      align: 'center',
                      verticalAlign: 'top',
                      style: {
                        color: '#666666',
                      },
                    },
                  },
                  {
                    color: '#f5f5f5',
                    from: this.listCont[3],
                    to: this.listCont[4],
                    label: {
                      text: 'UK',
                      align: 'center',
                      verticalAlign: 'top',
                      style: {
                        color: '#666666',
                      },
                    },
                  },
                ],
              },
              yAxis: {
                max: 110,
                title: {
                  text: '%',
                },
              },
              tooltip: {
                valueSuffix: 'kgoe per inhabitant',

                pointFormat:
                  '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
                shared: true,
              },
              series: [
                {
                  name: 'Space_Heating',
                  type: 'column',
                  data: this.heatingGraph23,
                },
                {
                  name: 'Space_Cooling',
                  type: 'column',
                  data: this.coolingGraph23,
                },
                {
                  name: 'Domestic_Hot_Water',
                  type: 'column',
                  data: this.domesticHotWaterGraph23,
                },
              ],
              plotOptions: {
                column: {
                  dataLabels: {
                    enabled: false,
                  },
                },
                series: {
                  stacking: 'percent',
                },
              },
            };
            this.Preloader('container23', 'loader23', 'remove');
            Highcharts.chart('container23', this.chartOptions23);
          });
      });
    this.graph_ds6Data();
  }
  ukCheck(event: any, id: any) {
    let checkUk = event.target.checked;

    if (!!checkUk) {
      if (id == 'ukCheck') {
        this.Preloader('container22', 'loader22', 'init');
        this.heatingGraph22.pop();
        this.coolingGraph22.pop();
        this.domesticHotWaterGraph22.pop();
        this.Preloader('container22', 'loader22', 'remove');
        Highcharts.chart('container22', this.chartOptions22);
      } else {
        this.Preloader('container23', 'loader23', 'init');
        this.heatingGraph23.pop();
        this.coolingGraph23.pop();
        this.domesticHotWaterGraph23.pop();
        this.Preloader('container23', 'loader23', 'remove');
        Highcharts.chart('container23', this.chartOptions23);
      }
    } else {
      if (id == 'ukCheck') {
        this.Preloader('container22', 'loader22', 'init');
        this.heatingGraph22.push(parseFloat(this.listContUk22[2]));
        this.coolingGraph22.push(parseFloat(this.listContUk22[3]));
        this.domesticHotWaterGraph22.push(parseFloat(this.listContUk22[4]));
        this.Preloader('container22', 'loader22', 'remove');
        Highcharts.chart('container22', this.chartOptions22);
      } else {
        this.Preloader('container23', 'loader23', 'init');
        this.heatingGraph23.push(parseFloat(this.listContUk23[2]));
        this.coolingGraph23.push(parseFloat(this.listContUk23[3]));
        this.domesticHotWaterGraph23.push(parseFloat(this.listContUk23[4]));
        this.Preloader('container23', 'loader23', 'remove');
        Highcharts.chart('container23', this.chartOptions23);
      }
    }
  }

  ngOnInit(): void {
    this.visibilityService.changeVisibility(false);
    this.energyConsumption.patchValue({
      ageSelected: this.yearsList[this.yearsList.length - 1],
    });

    this.energyConsumptionForm.patchValue({
      ageSelected2:
        this.yearsListGraph_Ds016[this.yearsListGraph_Ds016.length - 1],
      energySelected: this.energyList[0],
    });

    this.chartOptions6 = {
      title: {
        text: undefined,
      },
    };
    this.chartOptions7 = {
      title: {
        text: undefined,
      },
    };
    this.chartOptions8 = {
      title: {
        text: undefined,
      },
    };
    this.chartOptions22 = {
      title: {
        text: undefined,
      },
    };
    this.chartOptions23 = {
      title: {
        text: undefined,
      },
    };
  }

  onChange(event: any, id: any) {
    switch (id) {
      case 'energy-year':
        this.ageValue = event.source.value;
        this.Preloader('container8', 'loader8', 'init');
        this.finalEnergyConsumption();

        break;
      case 'energy-use':
        this.energyValue = event.source.value;

        this.energydata =
          this.energyValue == 'Space Heating'
            ? 'Energy consumption in space heating'
            : 'Energy consumption in water heating';
        this.Preloader('container6', 'loader6', 'init');
        this.Preloader('container7', 'loader7', 'init');
        this.graph_ds6Data();

        break;
      case 'consumption-age':
        this.ageValue2 = event.source.value;
        this.Preloader('container6', 'loader6', 'init');
        this.Preloader('container7', 'loader7', 'init');
        this.graph_ds6Data();

        break;
    }
  }
  convertTerrajoulesToKilograms(terrajoules: number) {
    var joules = terrajoules * Math.pow(10, 12); // convert terrajoules to joules
    var speedOfLight = 3.0 * Math.pow(10, 8); // speed of light in meters per second
    var kilograms = joules / Math.pow(speedOfLight, 2); // convert joules to kilograms
    return kilograms;
  }
  finalEnergyConsumption() {
    this.httpClient
      .get(`localhost/highcharts/graph_6_8_9_data?YEAR=${this.ageValue}`, {
        headers: { Accept: 'text', 'Content-Type': 'text' },
        responseType: 'text',
      })
      .subscribe((data) => {
        this.countriesFuel = [];
        this.Electricity = [];
        this.Heat = [];
        this.NaturalGas = [];
        this.OilAndPetroleum = [];
        this.OtherFuels = [];
        this.Renewables = [];
        this.Solid = [];
        this.products = data;
        this.rows = this.products.split(/\n/).slice(1);

        for (var i = 0; i < this.rows.length; i++) {
          // Row
          const row = this.rows[i].split(',');

          this.countriesFuel.push(row[0]);
          this.Electricity.push(parseFloat(row[1]));
          this.Heat.push(parseFloat(row[2]));
          this.NaturalGas.push(parseFloat(row[3]));
          this.OilAndPetroleum.push(parseFloat(row[4]));
          this.OtherFuels.push(parseFloat(row[5]));
          this.Renewables.push(parseFloat(row[6]));
          this.Solid.push(parseFloat(row[7]));
        }
        this.countriesFuel.pop();
        this.Electricity.pop();
        this.Heat.pop();
        this.NaturalGas.pop();
        this.OilAndPetroleum.pop();
        this.OtherFuels.pop();
        this.Renewables.pop();
        this.Solid.pop();

        this.chartOptions8 = {
          chart: {
            type: 'column',
          },

          title: {
            text: '',
          },
          subtitle: {
            text: `Year: ${this.ageValue} <br> Source: Hotmaps & Eurostat <br> EU Countries`,
          },
          colors: [
            '#B67818',
            '#FCE6C9',
            '#9EBEA4',
            '#719D77',
            '#EB5E1C',
            '#080F11',
            '#F8A933',
          ],
          legend: {
            enabled: true,
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
          },

          xAxis: {
            categories: this.countriesFuel,
          },

          yAxis: {
            title: {
              text: 'Kgoe per inhabitant',
            },
            labels: {
              format: '{value:.5f}',
            },
          },
          tooltip: {
            valueSuffix: ' kgoe per inhabitant',
            pointFormat:
              '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:.2f} kgoe per inhabitant</b>',
          },
          plotOptions: {
            column: {
              pointPadding: 0.2,
              borderWidth: 0,
              dataLabels: {
                enabled: false,
              },
            },
            series: {
              stacking: 'normal',
            },
          },
          series: [
            {
              name: 'Electricity',
              type: 'column',
              data: this.Electricity,
            },
            {
              name: 'Heat',
              type: 'column',
              data: this.Heat,
            },
            {
              name: 'Natural_gas',
              type: 'column',
              data: this.NaturalGas,
            },
            {
              name: 'Oil_and_petroleum_products_excluding_biofuel_portion',
              type: 'column',
              data: this.OilAndPetroleum,
            },
            {
              name: 'Other_fuels_nec',
              type: 'column',
              data: this.OtherFuels,
            },
            {
              name: 'Renewables_and_biofuels',
              type: 'column',
              data: this.Renewables,
            },
            {
              name: 'Solid_fossil_fuels',
              type: 'column',
              data: this.Solid,
            },
          ],
        };
        this.Preloader('container8', 'loader8', 'remove');
        Highcharts.chart('container8', this.chartOptions8);
      });
  }
  graph_ds6Data() {
    this.httpClient
      .get(
        `localhost/highcharts/graph_ds016/?YEAR=${this.ageValue2}&ENERGY_BALANCE=${this.energydata}`,
        {
          headers: { Accept: 'text', 'Content-Type': 'text' },
          responseType: 'text',
        }
      )
      .subscribe((data) => {
        this.productsGraph6_7 = [];
        this.rowsGraph6_7 = [];
        this.arraysMerged = [];
        this.finalArray = [];
        this.countries = [];
        this.liquefied = [];
        this.oil = [];
        this.solidFossil = [];
        this.gasOil = [];
        this.otherKerosene = [];
        this.productsGraph6_7 = this.productsGraph6_7 = data;
        this.rowsGraph6_7 = this.productsGraph6_7.split(/\n/).slice(1);

        for (var i = 0; i < this.rowsGraph6_7.length; i++) {
          // Row
          const row = this.rowsGraph6_7[i].split(',');
          const indexTeraJoule = row.indexOf('Terajoule');

          row.shift(indexTeraJoule);

          function removeItemOnce(arr: any, value: any) {
            var index = arr.indexOf(value);
            if (index > -1) {
              arr.splice(index, 1);
            }
            return arr;
          }
          const rowClear = removeItemOnce(row, 'Terajoule');

          this.arraysMerged.push({
            country: rowClear[0],
            kgoe: this.convertTerrajoulesToKilograms(rowClear[1]),
            ciec: rowClear[2],
          });
        }

        let merged = this.arraysMerged.reduce((acc, curr) => {
          let key = curr.country;

          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(curr.kgoe);
          return acc;
        }, {});

        for (let key in merged) {
          let mergearray = [key, ...merged[key]]; // logs each key in the current object
          this.finalArray.push(mergearray);
        }
        this.finalArray.pop();

        for (var i = 0; i < this.finalArray.length; i++) {
          this.countries.push(this.finalArray[i][0]);
          this.liquefied.push(parseFloat(this.finalArray[i][1]));
          this.oil.push(parseFloat(this.finalArray[i][2]));
          this.solidFossil.push(parseFloat(this.finalArray[i][3]));
          this.gasOil.push(parseFloat(this.finalArray[i][4]));
          this.otherKerosene.push(parseFloat(this.finalArray[i][5]));
        }

        this.chartOptions6 = {
          chart: {
            type: 'column',
          },

          title: {
            text: '',
          },
          subtitle: {
            text: `Residential Buildings | ${this.energyValue} | Year: ${this.ageValue2} <br> Source: Eurostat <br> EU Countries`,
          },
          legend: {
            enabled: true,
          },
          colors: ['#fbd08f', '#000000', '#ee733a', '#82a988', '#abc6af'],
          xAxis: {
            crosshair: true,
            categories: this.countries,
          },

          yAxis: {
            max: 5,
            title: {
              text: 'kgoe per inhabitant',
            },
            type: 'linear',
          },
          tooltip: {
            valueSuffix: ' kgoe per inhabitant',
            pointFormat:
              '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:.5f} kgoe per inhabitant</b>',
          },
          plotOptions: {
            column: {
              pointPadding: 0.3,
              grouping: false,
              shadow: false,
              borderWidth: 0,
            },
          },
          series: [
            {
              name: 'Liquefied_petroleum_gases',
              type: 'column',
              data: this.liquefied,
            },
            {
              name: 'Oil_and_petroleum_products',
              type: 'column',
              data: this.oil,
            },
            {
              name: 'Solid_fossil_fuels',
              type: 'column',
              data: this.solidFossil,
            },
            {
              name: 'Gas_oil_and_diesel_oil',
              type: 'column',
              data: this.gasOil,
            },
            {
              name: 'Other_kerosene',
              type: 'column',
              data: this.otherKerosene,
            },
          ],
        };

        // Graph6: Final energy consumption per inhabitant and energy carrier
        this.chartOptions7 = {
          chart: {
            type: 'column',
          },

          title: {
            text: '',
          },
          subtitle: {
            text: `Year: ${this.ageValue2} <br> Source: Eurostat <br> EU Countries`,
          },
          legend: {
            enabled: true,
          },
          colors: ['#fbd08f', '#000000', '#ee733a', '#82a988', '#abc6af'],
          xAxis: {
            crosshair: true,
            categories: this.countries,
          },

          yAxis: {
            title: {
              text: '%',
            },
          },
          tooltip: {
            valueSuffix: ' kgoe per inhabitant',
            pointFormat:
              '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
          },
          plotOptions: {
            column: {
              pointPadding: 0.3,
              borderWidth: 0,
              dataLabels: {
                enabled: false,
              },
            },
            series: {
              stacking: 'percent',
            },
          },
          series: [
            {
              name: 'Liquefied_petroleum_gases',
              type: 'column',
              data: this.liquefied,
            },
            {
              name: 'Oil_and_petroleum_products',
              type: 'column',
              data: this.oil,
            },
            {
              name: 'Solid_fossil_fuels',
              type: 'column',
              data: this.solidFossil,
            },
            {
              name: 'Gas_oil_and_diesel_oil',
              type: 'column',
              data: this.gasOil,
            },
            {
              name: 'Other_kerosene',
              type: 'column',
              data: this.otherKerosene,
            },
          ],
        };

        this.Preloader('container6', 'loader6', 'remove');
        Highcharts.chart('container6', this.chartOptions6);
        this.Preloader('container7', 'loader7', 'remove');
        Highcharts.chart('container7', this.chartOptions7);
      });
  }
  Preloader(graphId: any, preloaderID: any, action: any) {
    let loaderElement: any;
    let graphElement: any;
    if (action == 'remove') {
      loaderElement = document.getElementById(preloaderID);
      loaderElement.style.display = 'none';
      graphElement = document.getElementById(graphId);
      graphElement.style.display = 'block';
    } else {
      loaderElement = document.getElementById(preloaderID);
      loaderElement.style.display = 'block';
      graphElement = document.getElementById(graphId);
      graphElement.style.display = 'none';
    }
  }
  ngOnDestroy() {
    this.visibilityService.changeVisibility(true);
  }
}
