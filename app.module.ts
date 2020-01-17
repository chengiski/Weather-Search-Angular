import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { TabsComponent } from './tabs/tabs.component';
import { SubmitService } from './services/submit.service';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { MatAutocompleteModule,MatInputModule } from '@angular/material';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CardComponent } from './card/card.component';

@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    TabsComponent,
    ProgressBarComponent,
    CardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatInputModule,
    NgbModule 
  ],
  providers: [SubmitService],
  bootstrap: [AppComponent],
  exports: [
    MatAutocompleteModule,
    MatInputModule 
  ],
  entryComponents: [
    CardComponent
  ]
})
export class AppModule { }
