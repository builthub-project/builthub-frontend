import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as Highcharts from 'highcharts';

import variwide from 'highcharts/modules/variwide';
variwide(Highcharts);
/*
import heatmap from 'highcharts/modules/heatmap';
heatmap(Highcharts);*/

import HighchartsMapModule from 'highcharts/modules/map';
HighchartsMapModule(Highcharts);

import treemap from 'highcharts/modules/treemap';
treemap(Highcharts);

import * as HighchartsMap from 'highcharts/highmaps';
import { VisibilityService } from 'app/services/visibility.service';
//import * as worldMap from "@highcharts/map-collection/custom/european-union.geo.json";

// Serice APIs
const apiIntegrationServiceURL = 'localhost/integration';
//const apiIntegrationServiceURL = "localhost:9091";

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.css'],
})
export class GraphicsComponent implements OnInit, OnDestroy {
  // Initialize chart variables
  products: any = [];
  chartOptions: Highcharts.Options = {};

  highcharts = Highcharts;

  Highcharts: typeof HighchartsMap = HighchartsMap;
  chartConstructor = 'mapChart';
  chartData = [
    { code3: 'ABW', z: 105 },
    { code3: 'AFG', z: 35530 },
  ];

  // Data graph8
  countriesGraph8: any[] = [];
  dataGraph8: any[] = [];

  // Data graph9
  categoriesGraph9: any[] = [];
  austriaValues: any[] = [];
  belgiumValues: any[] = [];
  bulgariaValues: any[] = [];

  // Data graph6 + graph7
  repeatCountries: boolean;
  countriesGraph6: any[] = [];
  dataElectricityGraph6: any[] = [];
  dataHeatGraph6: any[] = [];
  dataNaturalgasGraph6: any[] = [];
  dataFossilGraph6: any[] = [];
  dataOtherfuelsGraph6: any[] = [];
  dataRenewablesGraph6: any[] = [];
  dataSolidfossilGraph6: any[] = [];

  // Data graph22 + graph23
  dataSpaceheatingGraph22: any[] = [];
  dataSpacecoolingGraph22: any[] = [];
  dataDomestichotgGraph22: any[] = [];
  countUK: any;
  countContinental: any;
  countMediterranean: any;
  countNordic: any;
  countOceanic: any;
  repeatCountries22: boolean;
  countriesGraph22: any[] = [];

  // Data graph21
  countriesGraph21: any[] = [];
  dataGraph21: any[] = [];

  averageGraph21: any[] = [];

  listUK: any[] = [];
  listContinental: any[] = [];
  listMediterranean: any[] = [];
  listNordic: any[] = [];
  listOceanic: any[] = [];

  medianUK: any;
  medianContinental: any;
  medianMediterranean: any;
  medianNordic: any;
  medianOceanic: any;
  listMedian: any[] = [];

  // Data graph3
  totalFrance: any;
  totalGermany: any;
  totalIreland: any;
  totalItaly: any;
  totalPoland: any;
  totalBNL: any;
  totalIberia: any;
  totalNordics: any;
  totalSouth: any;
  totalOther: any;
  total: any;

  list1Period: any[] = [];
  list2Period: any[] = [];
  list3Period: any[] = [];
  list4Period: any[] = [];
  list5Period: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private visibilityService: VisibilityService
  ) {
    this.repeatCountries = false;
    this.repeatCountries22 = false;

    // Graph8 localhost/integration/dataset?name=energy001
    this.httpClient
      .get('http://localhost:9091/dataset?name=queryG8', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .subscribe({
        next: (data) => {
          this.products = data;
          for (var i = 0; i < this.products.results.bindings.length; i++) {
            this.countriesGraph8.push(
              this.products.results.bindings[i].location.value
            );
            this.dataGraph8.push(
              Number(this.products.results.bindings[i].val.value)
            );
          }
          this.showChart8(this.countriesGraph8, this.dataGraph8);
        },
      });

    // Graph9, Graph6, Graph7
    this.httpClient.get('/assets/json/queryG967').subscribe({
      next: (data) => {
        this.products = data;
        this.categoriesGraph9 = [];
        this.countriesGraph6 = [];

        for (var i = 0; i < this.products.results.bindings.length; i++) {
          this.repeatCountries = false;

          if (i == 0) {
            this.categoriesGraph9.push(
              this.products.results.bindings[i].siec.value
            );
            this.countriesGraph6.push(
              this.products.results.bindings[i].location.value
            );
          } else {
            // List categories
            for (var z = 0; z < this.countriesGraph6.length; z++) {
              if (
                this.countriesGraph6[z] ==
                this.products.results.bindings[i].location.value
              ) {
                this.repeatCountries = true;
              }
            }

            if (this.repeatCountries == false) {
              this.countriesGraph6.push(
                this.products.results.bindings[i].location.value
              );
            }
          }

          // Graph6 + Graph7
          if (this.products.results.bindings[i].siec.value == 'Electricity') {
            this.dataElectricityGraph6.push(
              Number(this.products.results.bindings[i].val.value)
            );
          }
          if (this.products.results.bindings[i].siec.value == 'Heat') {
            this.dataHeatGraph6.push(
              Number(this.products.results.bindings[i].val.value)
            );
          }
          if (this.products.results.bindings[i].siec.value == 'Natural gas') {
            this.dataNaturalgasGraph6.push(
              Number(this.products.results.bindings[i].val.value)
            );
          }
          if (
            this.products.results.bindings[i].siec.value ==
            'Oil and petroleum products (excluding biofuel portion)'
          ) {
            this.dataFossilGraph6.push(
              Number(this.products.results.bindings[i].val.value)
            );
          }
          if (
            this.products.results.bindings[i].siec.value == 'Other fuels n.e.c.'
          ) {
            this.dataOtherfuelsGraph6.push(
              Number(this.products.results.bindings[i].val.value)
            );
          }
          if (
            this.products.results.bindings[i].siec.value ==
            'Renewables and biofuels'
          ) {
            this.dataRenewablesGraph6.push(
              Number(this.products.results.bindings[i].val.value)
            );
          }
          if (
            this.products.results.bindings[i].siec.value == 'Solid fossil fuels'
          ) {
            this.dataSolidfossilGraph6.push(
              Number(this.products.results.bindings[i].val.value)
            );
          }

          // Graph9
          if (this.products.results.bindings[i].location.value == 'Austria') {
            this.austriaValues.push(
              Number(this.products.results.bindings[i].val.value)
            );
          }

          if (this.products.results.bindings[i].location.value == 'Belgium') {
            this.belgiumValues.push(
              Number(this.products.results.bindings[i].val.value)
            );
          }

          if (this.products.results.bindings[i].location.value == 'Bulgaria') {
            this.bulgariaValues.push(
              Number(this.products.results.bindings[i].val.value)
            );
          }
        }

        this.showChart6(
          this.countriesGraph6,
          this.dataElectricityGraph6,
          this.dataHeatGraph6,
          this.dataNaturalgasGraph6,
          this.dataFossilGraph6,
          this.dataOtherfuelsGraph6,
          this.dataRenewablesGraph6,
          this.dataSolidfossilGraph6
        );
        this.showChart7(
          this.countriesGraph6,
          this.dataElectricityGraph6,
          this.dataHeatGraph6,
          this.dataNaturalgasGraph6,
          this.dataFossilGraph6,
          this.dataOtherfuelsGraph6,
          this.dataRenewablesGraph6,
          this.dataSolidfossilGraph6
        );
        this.showChart9(
          this.austriaValues,
          this.belgiumValues,
          this.bulgariaValues
        );
      },
    });

    // Graph22 + Graph23
    this.httpClient
      .get('http://localhost:9091/dataset?name=queryG2223', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .subscribe({
        next: (data) => {
          this.products = data;
          for (var i = 0; i < this.products.results.bindings.length; i++) {
            this.repeatCountries22 = false;

            if (i == 0) {
              this.countriesGraph22.push(
                this.products.results.bindings[i].location.value
              );
            } else {
              // List countries
              for (var z = 0; z < this.countriesGraph22.length; z++) {
                if (
                  this.countriesGraph22[z] ==
                  this.products.results.bindings[i].location.value
                ) {
                  this.repeatCountries22 = true;
                }
              }

              if (this.repeatCountries22 == false) {
                this.countriesGraph22.push(
                  this.products.results.bindings[i].location.value
                );
              }
            }

            if (
              this.products.results.bindings[i].ttype.value ==
              'Domestic Hot Water'
            ) {
              this.dataDomestichotgGraph22.push(
                Number(this.products.results.bindings[i].val.value)
              );
            }
            if (
              this.products.results.bindings[i].ttype.value == 'Space Cooling'
            ) {
              this.dataSpacecoolingGraph22.push(
                Number(this.products.results.bindings[i].val.value)
              );
            }
            if (
              this.products.results.bindings[i].ttype.value == 'Space Heating'
            ) {
              this.dataSpaceheatingGraph22.push(
                Number(this.products.results.bindings[i].val.value)
              );
            }

            // Count region
            if (this.products.results.bindings[i].region.value == '-') {
              this.countUK =
                Number(this.products.results.bindings[i].count.value) - 0.5;
            }
            if (
              this.products.results.bindings[i].region.value == 'continental'
            ) {
              this.countContinental = Number(
                this.products.results.bindings[i].count.value
              );
            }
            if (
              this.products.results.bindings[i].region.value == 'mediterranean'
            ) {
              this.countMediterranean = Number(
                this.products.results.bindings[i].count.value
              );
            }
            if (this.products.results.bindings[i].region.value == 'nordic') {
              this.countNordic =
                Number(this.products.results.bindings[i].count.value) + 0.5;
            }
            if (this.products.results.bindings[i].region.value == 'oceanic') {
              this.countOceanic = Number(
                this.products.results.bindings[i].count.value
              );
            }
          }

          this.showChart22(
            this.countriesGraph22,
            this.dataDomestichotgGraph22,
            this.dataSpacecoolingGraph22,
            this.dataSpaceheatingGraph22,
            this.countUK,
            this.countUK + this.countContinental,
            this.countUK + this.countContinental + this.countMediterranean,
            this.countContinental + this.countMediterranean + this.countNordic,
            this.countContinental +
              this.countMediterranean +
              this.countNordic +
              this.countOceanic
          );
          this.showChart23(
            this.countriesGraph22,
            this.dataDomestichotgGraph22,
            this.dataSpacecoolingGraph22,
            this.dataSpaceheatingGraph22,
            this.countUK,
            this.countUK + this.countContinental,
            this.countUK + this.countContinental + this.countMediterranean,
            this.countContinental + this.countMediterranean + this.countNordic,
            this.countContinental +
              this.countMediterranean +
              this.countNordic +
              this.countOceanic
          );
        },
      });

    // Graph3
    this.httpClient
      .get('http://localhost:9091/dataset?name=queryG3', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .subscribe({
        next: (data) => {
          this.totalFrance = 0;
          this.totalGermany = 0;
          this.totalIreland = 0;
          this.totalItaly = 0;
          this.totalPoland = 0;
          this.totalBNL = 0;
          this.totalIberia = 0;
          this.totalNordics = 0;
          this.totalSouth = 0;
          this.totalOther = 0;
          this.total = 0;

          this.products = data;
          for (var i = 0; i < this.products.results.bindings.length; i++) {
            if (this.products.results.bindings[i].location.value == 'France') {
              this.totalFrance =
                this.totalFrance +
                Number(this.products.results.bindings[i].val.value);
            }
            if (this.products.results.bindings[i].location.value == 'Germany') {
              this.totalGermany =
                this.totalGermany +
                Number(this.products.results.bindings[i].val.value);
            }
            if (this.products.results.bindings[i].location.value == 'Ireland') {
              this.totalIreland =
                this.totalIreland +
                Number(this.products.results.bindings[i].val.value);
            }
            if (this.products.results.bindings[i].location.value == 'Italy') {
              this.totalItaly =
                this.totalItaly +
                Number(this.products.results.bindings[i].val.value);
            }
            if (this.products.results.bindings[i].location.value == 'Poland') {
              this.totalPoland =
                this.totalPoland +
                Number(this.products.results.bindings[i].val.value);
            }
            if (
              this.products.results.bindings[i].location.value ==
              'Benelux: BE, NL, LU'
            ) {
              this.totalBNL =
                this.totalBNL +
                Number(this.products.results.bindings[i].val.value);
            }
            if (
              this.products.results.bindings[i].location.value ==
              'Iberia: ES, PT, MT'
            ) {
              this.totalIberia =
                this.totalIberia +
                Number(this.products.results.bindings[i].val.value);
            }
            if (
              this.products.results.bindings[i].location.value ==
              'Nordics: DK, EE, FI, LT, LV, SE'
            ) {
              this.totalNordics =
                this.totalNordics +
                Number(this.products.results.bindings[i].val.value);
            }
            if (
              this.products.results.bindings[i].location.value ==
              'Other central Europe: AT, CZ, HU, SK, SI'
            ) {
              this.totalSouth =
                this.totalSouth +
                Number(this.products.results.bindings[i].val.value);
            }
            if (
              this.products.results.bindings[i].location.value ==
              'Southeast Europe: BG, HR, CY,EL, RO'
            ) {
              this.totalOther =
                this.totalOther +
                Number(this.products.results.bindings[i].val.value);
            }

            // Total
            this.total =
              this.total + Number(this.products.results.bindings[i].val.value);
          }

          for (var i = 0; i < this.products.results.bindings.length; i++) {
            // 2000 - 2010
            if (this.products.results.bindings[i].bage.value == '2000-2010') {
              if (
                this.products.results.bindings[i].location.value == 'France'
              ) {
                this.list1Period.push([
                  'France',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalFrance * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value == 'Germany'
              ) {
                this.list1Period.push([
                  'Germany',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalGermany * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value == 'Ireland'
              ) {
                this.list1Period.push([
                  'Ireland',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalIreland * 100) / this.total,
                ]);
              }
              if (this.products.results.bindings[i].location.value == 'Italy') {
                this.list1Period.push([
                  'Italy',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalItaly * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value == 'Poland'
              ) {
                this.list1Period.push([
                  'Poland',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalPoland * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Benelux: BE, NL, LU'
              ) {
                this.list1Period.push([
                  'Benelux: BE, NL, LU',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalBNL * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Iberia: ES, PT, MT'
              ) {
                this.list1Period.push([
                  'Iberia: ES, PT, MT',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalIberia * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Nordics: DK, EE, FI, LT, LV, SE'
              ) {
                this.list1Period.push([
                  'Nordics: DK, EE, FI, LT, LV, SE',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalNordics * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Other central Europe: AT, CZ, HU, SK, SI'
              ) {
                this.list1Period.push([
                  'Other central Europe: AT, CZ, HU, SK, SI',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalOther * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Southeast Europe: BG, HR, CY,EL, RO'
              ) {
                this.list1Period.push([
                  'Southeast Europe: BG, HR, CY,EL, RO',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalSouth * 100) / this.total,
                ]);
              }
            }

            // 1990 - 1999
            if (this.products.results.bindings[i].bage.value == '1990-1999') {
              if (
                this.products.results.bindings[i].location.value == 'France'
              ) {
                this.list2Period.push([
                  'France',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalFrance * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value == 'Germany'
              ) {
                this.list2Period.push([
                  'Germany',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalGermany * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value == 'Ireland'
              ) {
                this.list2Period.push([
                  'Ireland',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalIreland * 100) / this.total,
                ]);
              }
              if (this.products.results.bindings[i].location.value == 'Italy') {
                this.list2Period.push([
                  'Italy',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalItaly * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value == 'Poland'
              ) {
                this.list2Period.push([
                  'Poland',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalPoland * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Benelux: BE, NL, LU'
              ) {
                this.list2Period.push([
                  'Benelux: BE, NL, LU',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalBNL * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Iberia: ES, PT, MT'
              ) {
                this.list2Period.push([
                  'Iberia: ES, PT, MT',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalIberia * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Nordics: DK, EE, FI, LT, LV, SE'
              ) {
                this.list2Period.push([
                  'Nordics: DK, EE, FI, LT, LV, SE',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalNordics * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Other central Europe: AT, CZ, HU, SK, SI'
              ) {
                this.list2Period.push([
                  'Other central Europe: AT, CZ, HU, SK, SI',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalOther * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Southeast Europe: BG, HR, CY,EL, RO'
              ) {
                this.list2Period.push([
                  'Southeast Europe: BG, HR, CY,EL, RO',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalSouth * 100) / this.total,
                ]);
              }
            }

            // 1980 - 1989
            if (this.products.results.bindings[i].bage.value == '1980-1989') {
              if (
                this.products.results.bindings[i].location.value == 'France'
              ) {
                this.list3Period.push([
                  'France',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalFrance * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value == 'Germany'
              ) {
                this.list3Period.push([
                  'Germany',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalGermany * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value == 'Ireland'
              ) {
                this.list3Period.push([
                  'Ireland',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalIreland * 100) / this.total,
                ]);
              }
              if (this.products.results.bindings[i].location.value == 'Italy') {
                this.list3Period.push([
                  'Italy',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalItaly * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value == 'Poland'
              ) {
                this.list3Period.push([
                  'Poland',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalPoland * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Benelux: BE, NL, LU'
              ) {
                this.list3Period.push([
                  'Benelux: BE, NL, LU',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalBNL * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Iberia: ES, PT, MT'
              ) {
                this.list3Period.push([
                  'Iberia: ES, PT, MT',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalIberia * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Nordics: DK, EE, FI, LT, LV, SE'
              ) {
                this.list3Period.push([
                  'Nordics: DK, EE, FI, LT, LV, SE',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalNordics * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Other central Europe: AT, CZ, HU, SK, SI'
              ) {
                this.list3Period.push([
                  'Other central Europe: AT, CZ, HU, SK, SI',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalOther * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Southeast Europe: BG, HR, CY,EL, RO'
              ) {
                this.list3Period.push([
                  'Southeast Europe: BG, HR, CY,EL, RO',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalSouth * 100) / this.total,
                ]);
              }
            }

            // 1970 - 1979
            if (this.products.results.bindings[i].bage.value == '1970-1979') {
              if (
                this.products.results.bindings[i].location.value == 'France'
              ) {
                this.list4Period.push([
                  'France',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalFrance * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value == 'Germany'
              ) {
                this.list4Period.push([
                  'Germany',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalGermany * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value == 'Ireland'
              ) {
                this.list4Period.push([
                  'Ireland',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalIreland * 100) / this.total,
                ]);
              }
              if (this.products.results.bindings[i].location.value == 'Italy') {
                this.list4Period.push([
                  'Italy',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalItaly * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value == 'Poland'
              ) {
                this.list4Period.push([
                  'Poland',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalPoland * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Benelux: BE, NL, LU'
              ) {
                this.list4Period.push([
                  'Benelux: BE, NL, LU',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalBNL * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Iberia: ES, PT, MT'
              ) {
                this.list4Period.push([
                  'Iberia: ES, PT, MT',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalIberia * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Nordics: DK, EE, FI, LT, LV, SE'
              ) {
                this.list4Period.push([
                  'Nordics: DK, EE, FI, LT, LV, SE',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalNordics * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Other central Europe: AT, CZ, HU, SK, SI'
              ) {
                this.list4Period.push([
                  'Other central Europe: AT, CZ, HU, SK, SI',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalOther * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Southeast Europe: BG, HR, CY,EL, RO'
              ) {
                this.list4Period.push([
                  'Southeast Europe: BG, HR, CY,EL, RO',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalSouth * 100) / this.total,
                ]);
              }
            }

            // 1945 - 1969
            if (this.products.results.bindings[i].bage.value == '1945-1969') {
              if (
                this.products.results.bindings[i].location.value == 'France'
              ) {
                this.list5Period.push([
                  'France',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalFrance * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value == 'Germany'
              ) {
                this.list5Period.push([
                  'Germany',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalGermany * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value == 'Ireland'
              ) {
                this.list5Period.push([
                  'Ireland',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalIreland * 100) / this.total,
                ]);
              }
              if (this.products.results.bindings[i].location.value == 'Italy') {
                this.list5Period.push([
                  'Italy',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalItaly * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value == 'Poland'
              ) {
                this.list5Period.push([
                  'Poland',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalPoland * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Benelux: BE, NL, LU'
              ) {
                this.list5Period.push([
                  'Benelux: BE, NL, LU',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalBNL * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Iberia: ES, PT, MT'
              ) {
                this.list5Period.push([
                  'Iberia: ES, PT, MT',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalIberia * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Nordics: DK, EE, FI, LT, LV, SE'
              ) {
                this.list5Period.push([
                  'Nordics: DK, EE, FI, LT, LV, SE',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalNordics * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Other central Europe: AT, CZ, HU, SK, SI'
              ) {
                this.list5Period.push([
                  'Other central Europe: AT, CZ, HU, SK, SI',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalOther * 100) / this.total,
                ]);
              }
              if (
                this.products.results.bindings[i].location.value ==
                'Southeast Europe: BG, HR, CY,EL, RO'
              ) {
                this.list5Period.push([
                  'Southeast Europe: BG, HR, CY,EL, RO',
                  Number(this.products.results.bindings[i].val.value),
                  (this.totalSouth * 100) / this.total,
                ]);
              }
            }
          }

          this.showChart3(
            this.list1Period,
            this.list2Period,
            this.list3Period,
            this.list4Period,
            this.list5Period
          );
        },
      });

    // Graph21
    this.httpClient
      .get('http://localhost:9091/dataset?name=queryG21', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .subscribe({
        next: (data) => {
          this.products = data;
          for (var i = 0; i < this.products.results.bindings.length; i++) {
            this.countriesGraph21.push(
              this.products.results.bindings[i].location.value
            );
            this.dataGraph21.push(
              Number(this.products.results.bindings[i].val.value)
            );
            this.averageGraph21.push(
              Number(this.products.results.bindings[i].average.value)
            );

            // Values
            if (this.products.results.bindings[i].region.value == '-') {
              this.listUK.push(
                Number(this.products.results.bindings[i].val.value)
              );
            }
            if (
              this.products.results.bindings[i].region.value == 'continental'
            ) {
              this.listContinental.push(
                Number(this.products.results.bindings[i].val.value)
              );
            }
            if (
              this.products.results.bindings[i].region.value == 'mediterranean'
            ) {
              this.listMediterranean.push(
                Number(this.products.results.bindings[i].val.value)
              );
            }
            if (this.products.results.bindings[i].region.value == 'nordic') {
              this.listNordic.push(
                Number(this.products.results.bindings[i].val.value)
              );
            }
            if (this.products.results.bindings[i].region.value == 'oceanic') {
              this.listOceanic.push(
                Number(this.products.results.bindings[i].val.value)
              );
            }
          }

          // UK Median
          if (this.listUK.length == 1) {
            this.listMedian.push(this.listUK[0]);
          } else {
            //Par
            if (this.listUK.length % 2 == 0) {
              for (var i = 0; i < this.countUK; i++) {
                this.listMedian.push(this.listUK[this.listUK.length / 2]);
              }
            }
            // Impar
            if (this.listUK.length % 2 != 0) {
              for (var i = 0; i < this.countUK; i++) {
                this.listMedian.push(this.listUK[this.listUK.length / 2 - 0.5]);
              }
            }
          }

          // Continental Median
          if (this.listContinental.length == 1) {
            this.listMedian.push(this.listContinental[0]);
          } else {
            //Par
            if (this.listContinental.length % 2 == 0) {
              for (var i = 0; i < this.countContinental; i++) {
                this.listMedian.push(
                  this.listContinental[this.listContinental.length / 2]
                );
              }
            }
            // Impar
            if (this.listContinental.length % 2 != 0) {
              for (var i = 0; i < this.countContinental; i++) {
                this.listMedian.push(
                  this.listContinental[this.listContinental.length / 2 - 0.5]
                );
              }
            }
          }

          // Mediterranean Median
          if (this.listMediterranean.length == 1) {
            this.listMedian.push(this.listMediterranean[0]);
          } else {
            //Par
            if (this.listMediterranean.length % 2 == 0) {
              for (var i = 0; i < this.countMediterranean; i++) {
                this.listMedian.push(
                  this.listMediterranean[this.listMediterranean.length / 2]
                );
              }
            }
            // Impar
            if (this.listMediterranean.length % 2 != 0) {
              for (var i = 0; i < this.countMediterranean; i++) {
                this.listMedian.push(
                  this.listMediterranean[
                    this.listMediterranean.length / 2 - 0.5
                  ]
                );
              }
            }
          }

          // Nordic Median
          if (this.listNordic.length == 1) {
            this.listMedian.push(this.listNordic[0]);
          } else {
            //Par
            if (this.listNordic.length % 2 == 0) {
              for (var i = 0; i < this.countNordic - 1; i++) {
                this.listMedian.push(
                  this.listNordic[this.listNordic.length / 2]
                );
              }
            }
            // Impar
            if (this.listNordic.length % 2 != 0) {
              for (var i = 0; i < this.countNordic - 1; i++) {
                this.listMedian.push(
                  this.listNordic[this.listNordic.length / 2 - 0.5]
                );
              }
            }
          }

          // Oceanic Median
          if (this.listOceanic.length == 1) {
            this.listMedian.push(this.listOceanic[0]);
          } else {
            //Par
            if (this.listOceanic.length % 2 == 0) {
              for (var i = 0; i < this.countOceanic; i++) {
                this.listMedian.push(
                  this.listOceanic[this.listOceanic.length / 2]
                );
              }
            }
            // Impar
            if (this.listOceanic.length % 2 != 0) {
              for (var i = 0; i < this.countOceanic; i++) {
                this.listMedian.push(
                  this.listOceanic[this.listOceanic.length / 2 - 0.5]
                );
              }
            }
          }

          this.showChart21(
            this.countriesGraph21,
            this.dataGraph21,
            this.countUK,
            this.countUK + this.countContinental,
            this.countUK + this.countContinental + this.countMediterranean,
            this.countContinental + this.countMediterranean + this.countNordic,
            this.countContinental +
              this.countMediterranean +
              this.countNordic +
              this.countOceanic,
            this.averageGraph21,
            this.listMedian
          );
        },
      });
  }

  // Show graph8
  showChart8(countries: any[], dataCountries: any[]) {
    this.chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Final energy consumption | Residential buildings  | Per inhabitant | Energy carrier: Electricity | Population',
      },
      subtitle: {
        text: 'Year: 2019 <br> Source: Hotmaps & Eurostat <br> EU Countries',
      },
      series: [
        {
          type: 'column',
          name: 'Final energy',
          data: dataCountries,
        },
      ],
      legend: {
        enabled: true,
      },
      xAxis: {
        categories: countries,
        crosshair: true,
      },
      yAxis: {
        title: {
          text: 'Koe per inhabitant',
        },
      },
      tooltip: {
        headerFormat:
          '<span style = "font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
          '<td style = "padding:0"><b>{point.y:.2f} koe per habitant</b></td></tr>',
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
    };

    Highcharts.chart('container8', this.chartOptions);
  }

  // Show graph9
  showChart9(austriaValues: any, belgiumValues: any, bulgariaValues: any) {
    this.chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Residential buildings  | Energy consumption | Energy carrier | Population',
      },
      subtitle: {
        text: 'Year: 2019 <br> Source: Hotmaps & Eurostat <br> Countries: Austria, Belgium, Bulgaria',
      },
      xAxis: {
        categories: [
          'Electricity',
          'Heat',
          'Natural gas',
          'Oil and petroleum products (excluding biofuel portion)',
          'Other fuels n.e.c.',
          'Renewables and biofuels',
          'Solid fossil fuels',
        ],
        crosshair: true,
      },
      yAxis: {
        min: 0,
        max: 0.3,
        title: {
          text: 'Koe per inhabitant',
        },
        labels: {
          format: '{value:.5f}',
        },
      },
      tooltip: {
        headerFormat:
          '<span style = "font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
          '<td style = "padding:0"><b>{point.y:.5f} koe per habitant</b></td></tr>',
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
      series: [
        {
          type: 'column',
          name: 'Austria',
          data: austriaValues,
        },
        {
          type: 'column',
          name: 'Belgium',
          data: belgiumValues,
        },
        {
          type: 'column',
          name: 'Bulgaria',
          data: bulgariaValues,
        },
      ],
    };
    Highcharts.chart('container9', this.chartOptions);
  }

  // Show graph6
  showChart6(
    countries: any[],
    electricity: any[],
    heat: any[],
    naturalGas: any[],
    fossil: any[],
    otherDuels: any[],
    renewables: any[],
    solidFossil: any[]
  ) {
    this.chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Residential buildings | Energy consumption | Energy carrier | Population',
      },
      subtitle: {
        text: 'Year: 2019 <br> Source: Hotmaps & Eurostat <br> EU Countries',
      },
      legend: {
        layout: 'vertical',
        align: 'center',
        verticalAlign: 'top',
        x: 1000, // posición
        y: 50,
        floating: true,
        borderWidth: 1,
      },
      xAxis: {
        categories: countries,
        crosshair: true,
      },
      yAxis: {
        min: 0,
        max: 1.5,
        title: {
          text: 'koe per inhabitant',
        },
        labels: {
          overflow: 'justify',
        },
      },
      tooltip: {
        // cuando pones el ratón encima de una sección --> la tarjeta que te sale
        valueSuffix: ' koe per habitant',
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: false, // etiqueta de números
          },
        },
        series: {
          stacking: 'normal',
        },
      },
      credits: {
        enabled: true,
      },
      series: [
        {
          type: 'column',
          name: 'Electricity',
          data: electricity,
        },
        {
          type: 'column',
          name: 'Heat',
          data: heat,
        },
        {
          type: 'column',
          name: 'Natural gas',
          data: naturalGas,
        },
        {
          type: 'column',
          name: 'Fossil oil and petroleum products',
          data: fossil,
        },
        { type: 'column', name: 'Other fuels n.e.c', data: otherDuels },
        {
          type: 'column',
          name: 'Renewables and biofuels',
          data: renewables,
        },
        {
          type: 'column',
          name: 'Solid fossils fuels',
          data: solidFossil,
        },
      ],
    };
    Highcharts.chart('container6', this.chartOptions);
  }

  // Show graph7
  showChart7(
    countries: any[],
    electricity: any[],
    heat: any[],
    naturalGas: any[],
    fossil: any[],
    otherDuels: any[],
    renewables: any[],
    solidFossil: any[]
  ) {
    this.chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Residential buildings | Energy consumption | Energy carrier | Population | Share',
      },
      subtitle: {
        text: 'Year: 2019 <br> Source: Hotmaps & Eurostat <br> EU Countries',
      },
      legend: {
        enabled: false,
        layout: 'vertical',
        align: 'center',
        verticalAlign: 'top',
        x: 600, // posición
        y: 50,
        floating: true,
        borderWidth: 1,
      },
      xAxis: {
        categories: countries,
        title: {
          text: null,
        },
      },
      yAxis: {
        min: 0,
        max: 100,
        title: {
          text: ' ',
        },
        labels: {
          overflow: 'justify',
        },
      },
      tooltip: {
        valueSuffix: ' koe per habitant',
        pointFormat:
          '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
        shared: true,
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: false,
          },
        },
        series: {
          stacking: 'percent', // porcentaje
        },
      },
      credits: {
        enabled: true,
      },
      series: [
        {
          type: 'column',
          name: 'Electricity',
          data: electricity,
        },
        {
          type: 'column',
          name: 'Heat',
          data: heat,
        },
        {
          type: 'column',
          name: 'Natural gas',
          data: naturalGas,
        },
        {
          type: 'column',
          name: 'Fossil oil and petroleum products',
          data: fossil,
        },
        { type: 'column', name: 'Other fuels n.e.c', data: otherDuels },
        {
          type: 'column',
          name: 'Renewables and biofuels',
          data: renewables,
        },
        {
          type: 'column',
          name: 'Solid fossils fuels',
          data: solidFossil,
        },
      ],
    };
    Highcharts.chart('container7', this.chartOptions);
  }

  // Show graph22
  showChart22(
    countries: any[],
    domestic: any[],
    cooling: any[],
    heating: any[],
    contUK: any,
    contContinental: any,
    contMediterranean: any,
    contNordic: any,
    contOceanic: any
  ) {
    this.chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        useHTML: true,
        x: -10,
        y: 8,
        text: 'Residential Buildings | Final energy consumption | End-use',
      },
      subtitle: {
        text: 'Year: 2016 <br> Source: Hotmaps',
      },
      series: [
        {
          type: 'column',
          name: 'Space Heating',
          data: heating,
        },
        {
          type: 'column',
          name: 'Space Cooling',
          data: cooling,
        },
        {
          type: 'column',
          name: 'Domestic Hot Water',
          data: domestic,
        },
      ],
      xAxis: {
        categories: countries,
        plotBands: [
          {
            color: '#E5F6F6',
            from: -0.5,
            to: contUK,
            label: {
              text: ' - ',
              align: 'center',
              verticalAlign: 'top',
              style: {
                color: '#666666',
              },
            },
            // borderWidth: 1,
            // borderColor: "#000"
          },
          {
            color: '#ffffff',
            from: contUK,
            to: contContinental,
            label: {
              text: 'Continental',
              align: 'center',
              verticalAlign: 'top',
              style: {
                color: '#666666',
              },
            },
            // borderWidth: 1,
            // borderColor: "#000"
          },
          {
            color: '#E5F6F6',
            from: contContinental,
            to: contMediterranean,
            label: {
              text: 'Mediterranean',
              align: 'center',
              verticalAlign: 'top',
              style: {
                color: '#666666',
              },
            },
            // borderWidth: 1,
            // borderColor: "#000"
          },
          {
            color: '#ffffff',
            from: contMediterranean,
            to: contNordic,
            label: {
              text: 'Nordic',
              align: 'center',
              verticalAlign: 'top',
              style: {
                color: '#666666',
              },
            },
            // borderWidth: 1,
            // borderColor: "#000"
          },
          {
            color: '#E5F6F6',
            from: contNordic,
            to: contOceanic,
            label: {
              text: 'Oceanic',
              align: 'center',
              verticalAlign: 'top',
              style: {
                color: '#666666',
              },
            },
            // borderWidth: 1,
            // borderColor: "#000"
          },
        ],
      },
      yAxis: {
        min: 0,
        max: 1200,
        title: {
          text: 'kWh/m2/yr',
        },
        labels: {
          overflow: 'justify',
        },
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: false, // etiqueta de números
          },
        },
        series: {
          stacking: 'normal',
        },
      },
      tooltip: {
        valueSuffix: ' kWh/m2/yr',
      },
      credits: {
        enabled: true,
      },
    };
    Highcharts.chart('container22', this.chartOptions);
  }

  // Show graph23
  showChart23(
    countries: any[],
    domestic: any[],
    cooling: any[],
    heating: any[],
    contUK: any,
    contContinental: any,
    contMediterranean: any,
    contNordic: any,
    contOceanic: any
  ) {
    this.chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        useHTML: true,
        x: -10,
        y: 8,
        text: 'Residential Buildings | Final energy consumption | End-use',
      },
      subtitle: {
        text: 'Year: 2016 <br> Source: Hotmaps',
      },
      series: [
        {
          type: 'column',
          name: 'Space Heating',
          data: heating,
        },
        {
          type: 'column',
          name: 'Space Cooling',
          data: cooling,
        },
        {
          type: 'column',
          name: 'Domestic Hot Water',
          data: domestic,
        },
      ],
      xAxis: {
        categories: countries,
        plotBands: [
          {
            color: '#E5F6F6',
            from: -0.5,
            to: contUK,
            label: {
              text: ' - ',
              align: 'center',
              verticalAlign: 'top',
              style: {
                color: '#666666',
              },
            },
            // borderWidth: 1,
            // borderColor: "#000"
          },
          {
            color: '#ffffff',
            from: contUK,
            to: contContinental,
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
            color: '#E5F6F6',
            from: contContinental,
            to: contMediterranean,
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
            color: '#ffffff',
            from: contMediterranean,
            to: contNordic,
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
            color: '#E5F6F6',
            from: contNordic,
            to: contOceanic,
            label: {
              text: 'Oceanic',
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
          text: 'kWh/m2/yr',
        },
        labels: {
          overflow: 'justify',
        },
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: false, // etiqueta de números
          },
        },
        series: {
          stacking: 'percent',
        },
      },
      tooltip: {
        valueSuffix: ' kWh/m2/yr',
        pointFormat:
          '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
      },
      credits: {
        enabled: true,
      },
    };
    Highcharts.chart('container23', this.chartOptions);
  }

  // Show graph3
  showChart3(
    list1: any[],
    list2: any[],
    list3: any[],
    list4: any[],
    list5: any[]
  ) {
    this.chartOptions = {
      chart: {
        type: 'variwide',
      },

      title: {
        text: ' ',
      },

      xAxis: {
        type: 'category',
        title: {
          text: 'Share of EU Final Energy Demand ',
        },
      },

      yAxis: {
        max: 100,
        title: {
          text: 'Construction periods share on the countries building stock',
        },
      },

      legend: {
        enabled: true,
        reversed: true,
      },
      plotOptions: {
        variwide: {
          stacking: 'percent',
        },
      },
      series: [
        {
          // no porcent
          name: '2000 - 2010',
          type: 'variwide',
          data: list1,
          tooltip: {
            pointFormat:
              '2000 - 2010: <b>{point.y} kWh/m2/yr</b><br>' +
              'Share of EU Final Energy Demand: {point.z:.2f}%<br>',
          },
        },
        {
          name: '1990-1999',
          type: 'variwide',
          data: list2,
          tooltip: {
            pointFormat:
              '1990 - 1999: <b>{point.y} kWh/m2/yr</b><br>' +
              'Share of EU Final Energy Demand: {point.z:.2f}%<br>',
          },
        },
        {
          name: '1980-1989',
          type: 'variwide',
          data: list3,
          tooltip: {
            pointFormat:
              '1980 - 1989: <b>{point.y} kWh/m2/yr</b><br>' +
              'Share of EU Final Energy Demand: {point.z:.2f}%<br>',
          },
        },
        {
          name: '1970-1979',
          type: 'variwide',
          data: list4,
          tooltip: {
            pointFormat:
              '1970 - 1979: <b>{point.y} kWh/m2/yr</b><br>' +
              'Share of EU Final Energy Demand: {point.z: .2f}%<br>',
          },

          // colorByPoint: true
        },
        {
          name: '1945-1969',
          type: 'variwide',
          data: list5,
          tooltip: {
            pointFormat:
              '1945 - 1969: <b>{point.y} kWh/m2/yr</b><br>' +
              'Share of EU Final Energy Demand: {point.z: .2f}%<br>',
          },

          // colorByPoint: true
        },
      ],
    };
    Highcharts.chart('container3', this.chartOptions);
  }

  // Show graph21
  showChart21(
    countries: any[],
    dataCountries: any[],
    contUK: any,
    contContinental: any,
    contMediterranean: any,
    contNordic: any,
    contOceanic: any,
    average: any,
    median: any
  ) {
    this.chartOptions = {
      chart: {
        type: 'column',
      },
      title: {
        text: 'Final energy consumption per floor area [kWh/m2]',
      },
      legend: {
        enabled: true,
      },
      xAxis: {
        plotBands: [
          {
            color: '#E5F6F6',
            from: -0.5,
            to: contUK,
            label: {
              text: ' - ',
              align: 'center',
              verticalAlign: 'top',
              style: {
                color: '#666666',
              },
            },
          },
          {
            color: '#ffffff',
            from: contUK,
            to: contContinental,
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
            color: '#E5F6F6',
            from: contContinental,
            to: contMediterranean,
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
            color: '#ffffff',
            from: contMediterranean,
            to: contNordic,
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
            color: '#E5F6F6',
            from: contNordic,
            to: contOceanic,
            label: {
              text: 'Oceanic',
              align: 'center',
              verticalAlign: 'top',
              style: {
                color: '#666666',
              },
            },
          },
        ],
        categories: countries,
        crosshair: true,
      },
      yAxis: {
        min: 0,
        max: 1400,
        title: {
          text: ' ',
        },
      },

      tooltip: {
        headerFormat:
          '<span style = "font-size:10px">{point.key}</span><table>',
        pointFormat:
          '<tr><td style = "color:{series.color};padding:0">{series.name}: </td>' +
          '<td style = "padding:0"><b>{point.y:.1f} kWh/m2</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true,
      },

      series: [
        {
          type: 'column',
          name: 'Final energy',
          data: dataCountries,
        },
        {
          type: 'spline',
          name: 'Climate region average',
          data: average,
          marker: {
            lineWidth: 2,
            fillColor: 'white',
          },
        },
        {
          type: 'spline',
          name: 'Climate region median',
          data: median,
          marker: {
            lineWidth: 2,
            fillColor: 'orange',
          },
        },
      ],
    };

    Highcharts.chart('container21', this.chartOptions);
  }

  nav: any;
  footer: any;

  ngOnInit(): void {
    this.visibilityService.changeVisibility(false);
  }

  ngOnDestroy() {
    this.visibilityService.changeVisibility(true);
  }
}
