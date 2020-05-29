import { Component, OnInit } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import {
  ModalController,
  LoadingController,
  NavParams,
  IonContent
  } from '@ionic/angular';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {

  AllAccess: any;
  authorization: any;

environmentsite: any;
  endPoint: any;
  public location: any;
  locationdetail: any;

  constructor( private modalController: ModalController, private http: HTTP) { }

  ngOnInit() {
  }
  async ionViewDidEnter(){
    this.AllAccess = localStorage.getItem('OrderZ-AllAccess');
    this.environmentsite = localStorage.getItem('OrderZ-environment');
    this.getlocationAll();

  }

  inputaddress(id, name, address, address2, locality, state){
console.log('endereco 2', address2);
if (address2){
  localStorage.setItem('OrderZ-LocalAddress', address + ' ' + address2);
}else{
  localStorage.setItem('OrderZ-LocalAddress', address);
}
localStorage.setItem('OrderZ-LocalName', name);
localStorage.setItem('OrderZ-LocalLocality', locality);
localStorage.setItem('OrderZ-LocalState', state);
localStorage.setItem('OrderZ-LocalId', id);
this.closeModal();
  }

  async closeModal() {
    //   const onClosedData: string = "Wrapped Up!";
       await this.modalController.dismiss();

     }

  async getlocationAll(){
    console.log('acesso', this.AllAccess)
    this.authorization = 'Bearer ' + this.AllAccess;
    console.log('autoriza', this.authorization)
    this.endPoint = this.environmentsite + 'v2/locations';
    // tslint:disable-next-line:max-line-length
    this.http.get(this.endPoint, {}, {'Square-Version': '2020-04-22', Authorization: this.authorization, 'Content-Type': 'application/json'}).then(async response => {
      console.log('status ALL location', response.data);
      this.location = JSON.parse(response.data);
      this.locationdetail = this.location.locations;
     // console.log('location', this.location);
      console.log('location objects', this.locationdetail);

    });

     }

}
