import { Component } from '@angular/core';
import { RegisterPage } from '../modals/register/register.page';
import { NavController, ModalController } from '@ionic/angular';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { CheckboxControlValueAccessor } from '@angular/forms';
import { Tab2Page } from '../tab2/tab2.page';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  dataReturned: any;
  userexist: any;
  FirstName: any;
  LastName: any;
  Email: any;
  Phone: any;
  txtemail: any;
  txtpassword: any;

  constructor(public navCtrl: NavController, public modalController: ModalController,
              public fAuth: AngularFireAuth) {}

  async ionViewDidEnter(){

    console.log('entrado');
    await this.checkusercon();
  }


    async signuser() {

      try {
        const result = await this.fAuth.signInWithEmailAndPassword(
          this.txtemail,
          this.txtpassword
        );
        if (result) {
          console.log('Successfully logged in!', result.user.uid);
     //     this.navCtrl.navigateRoot('tab2');
          return firebase.database().ref('users/' + result.user.uid).once('value').then(snapshot => {
            localStorage.setItem('OrderZ-Uid', result.user.uid);
            localStorage.setItem('OrderZ-FirstName', snapshot.val().firstname);
            localStorage.setItem('OrderZ-LastName', snapshot.val().lastname);
            localStorage.setItem('OrderZ-Phone', snapshot.val().phone);
            localStorage.setItem('OrderZ-Email', snapshot.val().email);
            console.log('dados usuario', snapshot.val());
            this.navCtrl.navigateRoot('tabs');
           });
        }

      } catch (err) {
        console.error(err);
      }
    }


  async checkusercon(){

      this.userexist = localStorage.getItem('OrderZ-Uid');
      this.FirstName = localStorage.getItem('OrderZ-FirstName');
      this.LastName = localStorage.getItem('OrderZ-LastName');
      this.Email = localStorage.getItem('OrderZ-Email');
      this.Phone = localStorage.getItem('OrderZ-Phone');

      console.log('existo', this.userexist);
//  if (localStorage.getItem('OrderZ-Uid') == null) {

}


async logout() {

  localStorage.clear();
  location.reload();
//  this.navCtrl.navigateRoot('Tab2Page');
//  this.navCtrl.setRoot(this.navCtrl.getActive().component);

}

forgetemail(){
  if (this.txtemail == null) {
    alert('Please input you e-mail');
    return;
  } else {
  this.fAuth.sendPasswordResetEmail(this.txtemail);
}

}

async updateuser() {

  const modal = await this.modalController.create({
    component: RegisterPage,
    componentProps: {
       register: false
    }
  });

  modal.onDidDismiss().then(async (dataReturned) => {
    if (dataReturned !== null) {
      this.dataReturned = dataReturned.data;
      console.log('retorno de dados', this.dataReturned);
     // location.reload();
      this.navCtrl.navigateRoot('tabs');
    /*  if (this.dataReturned = 'yes'){
        alert('Thank you for registering');
        location.reload();
      } */
      // alert('Modal Sent Data :'+ dataReturned);

    }
  });

  return await modal.present();
}

  async registeruser() {

 //   async openModal(idimagem, imagem, nameproduto, description, subitens) {
      const modal = await this.modalController.create({
        component: RegisterPage,
        componentProps: {
           register: true
        }
      });

      modal.onDidDismiss().then(async (dataReturned) => {
        if (dataReturned !== null) {
          this.dataReturned = dataReturned.data;
          console.log('retorno de dados', this.dataReturned);
          this.navCtrl.navigateRoot('tabs');
        /*  if (this.dataReturned = 'yes'){
            alert('Thank you for registering');
            location.reload();
          } */
          // alert('Modal Sent Data :'+ dataReturned);

        }
      });

      return await modal.present();
    }


  }


