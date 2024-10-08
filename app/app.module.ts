import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { FooterComponent } from './footer_component/footer.component';
import { PlatformIndexComponent } from './platform-index/platform-index.component';
import { SparqlEditorComponent } from './sparql-editor/sparql-editor.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavBarComponent } from './navbar_component/navbar.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ngxInputRegulateModule } from 'ngx-input-regulate';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgxPaginationModule } from 'ngx-pagination';

import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { DomSanitizer } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { UploadDataComponent } from './upload-data/upload-data.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { initializeKeycloak } from './init/keycloak-init.factory';
import { AuthGuard } from './guard/auth.guard';
import { SaveQueryDialogComponent } from './save-query-dialog/save-query-dialog.component';
import { GraphicsComponent } from './graphics/graphics.component';
import { GraphicsCsvComponent } from './graphics-csv/graphics-csv.component';
import { DashboardEnergyTucComponent } from './dashboard-energy-tuc/dashboard-energy-tuc.component';
import { DashboardBereelComponent } from './dashboard-bereel/dashboard-bereel.component';

/* */
import { DataTablesModule } from 'angular-datatables';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { DashboardEmissionsComponent } from './dashboard-emissions/dashboard-emissions.component';
import { DashboardSwedishComponent } from './dashboard-swedish/dashboard-swedish.component';
import { DashboardMachinelearningComponent } from './dashboard-machinelearning/dashboard-machinelearning.component';
import { BenchmarkComponent } from './benchmark/benchmark.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { LoaderComponent } from './ui/loader/loader.component';
import { EuropeanFooterComponent } from './european-footer/european-footer.component';

/* */
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    PlatformIndexComponent,
    SparqlEditorComponent,
    DashboardComponent,
    NavBarComponent,
    UploadDataComponent,
    SaveQueryDialogComponent,
    GraphicsComponent,
    GraphicsCsvComponent,
    DashboardEnergyTucComponent,
    DashboardBereelComponent,
    DashboardEmissionsComponent,
    DashboardSwedishComponent,
    DashboardMachinelearningComponent,
    BenchmarkComponent,
    FeedbackComponent,
    LoaderComponent,
    EuropeanFooterComponent,
  ],

  imports: [
    BrowserModule,
    MatSliderModule,
    MatToolbarModule,
    MatIconModule,
    MatGridListModule,
    MatRadioModule,
    HttpClientModule,
    BrowserAnimationsModule,
    KeycloakAngularModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    ngxInputRegulateModule,
    HighchartsChartModule,
    DataTablesModule,
    NgxPaginationModule,
    MatCardModule,
    RouterModule.forRoot(
      [
        {
          path: 'home',
          component: PlatformIndexComponent,
          canActivate: [AuthGuard],
        },

        { path: 'benchmark', component: BenchmarkComponent },

        { path: 'dashboard', component: DashboardComponent },
        { path: 'sparql-editor', component: SparqlEditorComponent },
        { path: 'upload-data', component: UploadDataComponent },
        { path: 'graphics', component: GraphicsComponent },
        { path: 'graphics-csv', component: GraphicsCsvComponent },
        {
          path: 'dashboard-energy-tuc',
          component: DashboardEnergyTucComponent,
        },
        { path: 'dashboard-bereel', component: DashboardBereelComponent },
        { path: 'dashboard-emissions', component: DashboardEmissionsComponent },
        { path: 'dashboard-swedish', component: DashboardSwedishComponent },
        {
          path: 'dashboard-machinelearning',
          component: DashboardMachinelearningComponent,
        },

        { path: 'dashboard-feedback', component: FeedbackComponent },
        { path: 'feedback', component: FeedbackComponent },

        { path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: '404', redirectTo: 'home' },
        { path: '**', redirectTo: 'home' },
      ],
      { onSameUrlNavigation: 'reload' }
    ),
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
