import { AppRoutingModule } from './app-routing.module';
// import { CaseDataService } from './case-data.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ListComponent } from './list/list.component';
import { LoginComponent } from './login/login.component';
import { FieldControlErrorComponent } from './field-control-error/field-control-error.component';
import { ApiService } from './api.service';



@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent,
    LoginComponent,
    ListComponent,
    FieldControlErrorComponent,
    HomeComponent,
    ListComponent,
    LoginComponent
  ],
  imports: [
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    BsDropdownModule.forRoot(),
    TypeaheadModule.forRoot(),
    BrowserModule,
    HttpModule,
    JsonpModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }