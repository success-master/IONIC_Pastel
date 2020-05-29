import { Component } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HTTP } from '@ionic-native/http/ngx';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

AllAccess: any;
endPoint: any;
environmentsite: any;

  constructor(private http: HTTP) {}

  async ionViewDidEnter(){
    this.AllAccess = localStorage.getItem('OrderZ-AllAccess');
    this.environmentsite = localStorage.getItem('OrderZ-environment');

  }
  postproduct(){

    /*
    let postData = {
      "name": "Customer004",
      "email": "customer004@email.com",
      "tel": "0000252525"
}
*/


  }
}
