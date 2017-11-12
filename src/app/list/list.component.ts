import { ApiService } from './../api.service';

import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  public isCollapsed:boolean = false;
  
   public collapsed(event:any):void {
    //  console.log(event);
   }
  
   public expanded(event:any):void {
    //  console.log(event);
   }
  
  public case;
  public cases;

  getCase(i) {
    this.api.getCase(i).subscribe(
      (res) => {
        this.case = res;
        // console.log(this.case);
      },
      (err) => {
        console.error('ApiService::handleError', err);
      }     
    );
  }

  getAllCases() {
    this.api.getAllCases().subscribe(
      (res) => {
        this.cases = res;
      },
      (err) => {
        console.error('ApiService::handleError', err);
      }     
    );
  }

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.getAllCases();
    // console.log(this.cases);
    this.getCase(1);
  }

}
