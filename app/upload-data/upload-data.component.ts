import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.css'],
})
export class UploadDataComponent implements OnInit {
  // Form
  uploadForm: FormGroup;

  // List of dataset
  optionsDataset: any[] = [];

  // Required variables
  optionDataset: string;
  selectedFiles: File[] = [];

  // Sections
  actualSection: string;

  // Messages
  dataName: any;
  nameFiles: any[] = [];

  // Accepted Extensions
  selectAccept: any;

  constructor(private http: HttpClient) {
    this.optionDataset = '';

    this.actualSection = 'form';

    this.nameFiles = [];

    this.selectAccept = '';

    this.optionsDataset = [
      {
        number: '001',
        extension: '.csv',
        name: 'Horizon 2020 HotMaps project: Building stock analysis',
      },
      {
        number: '002',
        extension: '',
        name: 'IEE TABULA project: Typology Approach for Building Stock Energy Assessment',
      },
      {
        number: '003',
        extension: '',
        name: 'IEE EPISCOPE project: Focus of building stock monitoring',
      },
      {
        number: '004',
        extension: '',
        name: 'IEE ZEBRA2020 project: Nearly Zero-Energy Building Strategy 2020',
      },
      {
        number: '005',
        extension: '',
        name: 'IEE ENTRANZE project: Policies to Enforce the TRAnsition to Nearly Zero Energy buildings in the EU27',
      },
      {
        number: '006',
        extension: '',
        name: 'H2020 ODYSSEE - MURE project: Comprehensive monitoring of efficiency trends and policy evaluation in EU countries, Norway, Serbia and Switzerland.',
      },
      {
        number: '007',
        extension: '',
        name: 'FP7 CommONEnergy Project: building stock',
      },
      { number: '008', extension: '', name: 'JRC IDEES 2015' },
      {
        number: '009',
        extension: '',
        name: 'SET-Nav - Strategic Energy Roadmap',
      },
      {
        number: '010',
        extension: '',
        name: 'H2020 ExcEED Project: building stock data',
      },
      {
        number: '011',
        extension: '.xlsx',
        name: 'FP7 iNSPiRe project: building stock analysis',
      },
      {
        number: '012',
        extension: '',
        name: 'Energy consumption and energy efficiency trends in the EU-27+UK for the period 2000-2016 - FINAL REPORT',
      },
      {
        number: '013',
        extension: '',
        name: 'Comprehensive study of building energy renovation activities and the uptake of nearly zero-energy buildings in the EU - FINAL REPORT',
      },
      {
        number: '014',
        extension: '.xlsx',
        name: 'EUROSTAT: Final energy consumption in households',
      },
      {
        number: '015',
        extension: '.xlsx',
        name: 'EUROSTAT: Final energy consumption in households by fuel',
      },
      {
        number: '016',
        extension: '.xlsx',
        name: 'EUROSTAT: Disaggregated final energy consumption in households',
      },
      { number: '017', extension: '.xlsx, .csv, .txt', name: 'ZENSUS 2011' },
      {
        number: '018',
        extension: '',
        name: 'DPE - Diagnostic de Performance Energetique',
      },
      {
        number: '019',
        extension: '.pdf',
        name: 'Towards a sustainable Northern European housing stock - Sustainable Urban Areas 22',
      },
      {
        number: '020',
        extension: '',
        name: 'DEEP - De-risking Energy Efficiency Platform',
      },
      {
        number: '021',
        extension: '.xlsx',
        name: 'Energy consumption and efficiency technology measures in European non-residential buildings',
      },
      {
        number: '022',
        extension: '.xlsx',
        name: 'Dataset of the publication: Europe’s Building Stock and Its Energy Demand: A Comparison Between Austria and Italy',
      },
      {
        number: '023',
        extension: '.xlsx, .csv, .txt',
        name: 'National Housing Census: European statistical System',
      },
      {
        number: '024',
        extension: '.csv, .txt',
        name: 'Energy prices in 2019 - Household energy prices in the EU',
      },
      {
        number: '025',
        extension: '.xlsx',
        name: 'EUROSTAT: GDP per capita in PPS',
      },
      {
        number: '026',
        extension: '.xlsx',
        name: 'EUROSTAT: Population on 1 January by age, sex and NUTS 2 region',
      },
      {
        number: '027',
        extension: '.xlsx',
        name: 'EUROSTAT - Cooling and heating degree days',
      },
      {
        number: '028',
        extension: '.xls',
        name: 'EDGAR (Emissions Database for Global Atmospheric Research) CO2 Emissions',
      },
      {
        number: '029',
        extension: '.nc',
        name: 'CORDEX - Regional climate model data on single levels for Europe',
      },
      {
        number: '030',
        extension: '.asc, .txt',
        name: 'PVGIS - Photovoltaic Geographical Information System',
      },
    ];

    this.uploadForm = new FormGroup({
      dataset: new FormControl('optionDataset', [Validators.required]),
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: any) {
    // Reset lists
    this.selectedFiles = [];
    this.nameFiles = [];

    for (var i = 0; i < event.target.files.length; i++) {
      // Add file
      this.selectedFiles.push(<File>event.target.files[i]);

      // Add name
      this.nameFiles.push(event.target.files[i].name);
    }
  }

  onUpload() {
    // Select value
    this.optionDataset = this.uploadForm.get('dataset')?.value;

    // FormData interface appends a new value onto an existing key inside a FormData
    const formData: any = new FormData();

    // 'files' and 'dataset' --> key
    // this.selectedFiles[i] and this.optionDataset --> value
    for (var i = 0; i < this.selectedFiles.length; i++) {
      formData.append(
        'files',
        this.selectedFiles[i],
        this.selectedFiles[i].name
      );
    }

    formData.append('dataset', this.optionDataset);

    this.http
      .post('localhost/frontend-services/upload_dataset', formData)
      .subscribe(
        (res) => {
          this.optionDataset = '';
          this.selectedFiles = [];
        },

        (error) => {
          if (error.status == '200') {
            // Get the name
            for (var i = 0; i < this.optionsDataset.length; i++) {
              if (this.optionsDataset[i].number == this.optionDataset) {
                this.dataName = this.optionsDataset[i].name;
              }
            }

            this.changeSection('message');
          } else {
            this.changeSection('errorMessage');
          }
        }
      );
  }

  changeSection(section: string) {
    document.getElementById(this.actualSection)?.classList.remove('active');

    document.getElementById(section)?.classList.add('active');

    this.actualSection = section;
  }

  onChange(event: any) {
    for (var i = 0; i < this.optionsDataset.length; i++) {
      if (event.target.value == this.optionsDataset[i].number) {
        this.selectAccept = this.optionsDataset[i].extension;
      }
    }
  }
}
