import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { Http, Response, JsonpModule, Jsonp, RequestOptions, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw'

const API_URL = environment.apiUrl;

@Injectable()
export class ApiService {

  public cases;

  constructor(private jsonp: Jsonp, private http: Http) { }

  // API: GET /case/id
  public getCase(id): Observable<any> {
    let options = new RequestOptions({ headers: new Headers({ 'Content-Type': 'application/json' }) });
    return this.http.get(API_URL + '/case/' + id).map(res => {
      return res.json();
    });
  }

  // API: GET /cases
  public getAllCases(): Observable<any> {
    // return this.jsonp.get(API_URL + '/casejsonp?callback=JSONP_CALLBACK').map( res => { return res.json(); } );
    return this.http.get(API_URL + '/cases').map(res => {
      console.log('resposta',res.json());
      return res.json();
    });

  }

  public save(medicalcase: any): Observable<Response> {
    return this.http.post(API_URL + '/case/save', JSON.stringify(medicalcase)).map(res => { return res.json(); });;
  }
}
