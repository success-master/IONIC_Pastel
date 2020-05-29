import { Component, OnInit } from '@angular/core';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { IonicModule, NavController, NavParams, ModalController } from '@ionic/angular';

export class User {
  email: string;
  password: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  public user: User = new User();
  userid: any;
  email: any;
  phone: any;
  firstname: any;
  lastname: any;
  plocation: any;
  conclusion: any;
  RegisterParameter: boolean;
  uidupdate: any;

  constructor(private modalController: ModalController, public navCtrl: NavController,
              public navParams: NavParams, public fAuth: AngularFireAuth){


  const configUser = {
    apiKey: 'AIzaSyBBtEh-2jQOml7b8QGgGFpuY-RRBwODEnc',
    authDomain: 'orderz-app.firebaseapp.com',
    databaseURL: 'https://orderz-app.firebaseio.com',
    projectId: 'orderz-app',
    storageBucket: 'orderz-app.appspot.com',
    messagingSenderId: '730296171506',
    appId: '1:730296171506:web:10f998b66102c6cae5896b',
    measurementId: 'G-2SW306DWBV'
};
  firebase.initializeApp(configUser);
  }
  ngOnInit() {
  }

  ionViewWillEnter() {
    this.RegisterParameter = this.navParams.get('register');
    console.log('parametro', this.RegisterParameter);
    this.firstname = localStorage.getItem('OrderZ-FirstName');
    this.lastname = localStorage.getItem('OrderZ-LastName');
    this.phone = localStorage.getItem('OrderZ-Phone');
    this.email = localStorage.getItem('OrderZ-Email');
    this.email = localStorage.getItem('OrderZ-Email');
    this.uidupdate = localStorage.getItem('OrderZ-Uid');
  }

  async checkregister(){
    if (this.user.email == null) {
      alert('Please input you e-mail');
      return;
    } else if  (this.firstname == null) {
      alert('Please add your First name');
      return;
    } else if  (this.lastname == null) {
      alert('Please add your Last name');
      return;
    } else if  (this.user.password == null) {
      alert('Please add your Password');
      return;
    } else if  (this.phone == null) {
      alert('Please add your Telephone');
      return;
    } else {
    await this.registeruser();
  }

  }

  async checkupdate(){
    if (this.firstname == null) {
      alert('Please input you e-mail');
      return;
    } else if  (this.lastname == null) {
      alert('Please add your Last name');
      return;
    } else if  (this.phone == null) {
      alert('Please add your Telephone');
      return;
    } else {
    await this.updateuser();
  }

  }

  async updateuser(){

    localStorage.setItem('OrderZ-FirstName', this.firstname);
    localStorage.setItem('OrderZ-LastName', this.lastname);
    localStorage.setItem('OrderZ-Phone', this.phone);

    await firebase.database().ref('users/' + this.uidupdate).update({
      firstname: this.firstname,
      lastname: this.lastname,
      phone: this.phone,
//          plocation: this.location,
      token: localStorage.getItem('OrderZ-Token'),
      latestlogintime: firebase.database.ServerValue.TIMESTAMP

    });

    this.closeModalreg();
  }

  async registeruser() {
    // console.log('entrei aqui');
    try {
      const r = await this.fAuth.createUserWithEmailAndPassword(
        this.user.email,
        this.user.password
      );
      if (r) {
      //  console.log('id chegou', r);
        this.userid = r.user.uid;
      //  console.log('Successfully registered!');
        this.conclusion = 'yes';
      //  console.log('entrei aqui 2');
      //  console.log('entrei aqui 3');
        localStorage.setItem('OrderZ-Uid', this.userid);
        localStorage.setItem('OrderZ-FirstName', this.firstname);
        localStorage.setItem('OrderZ-LastName', this.lastname);
        localStorage.setItem('OrderZ-Phone', this.phone);
        localStorage.setItem('OrderZ-Email', this.user.email);
        await firebase.database().ref('users/' + this.userid).update({
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.user.email,
          phone: this.phone,
//          plocation: this.location,
          token: localStorage.getItem('OrderZ-Token'),
          latestlogintime: firebase.database.ServerValue.TIMESTAMP

        });

      }
      this.closeModalreg();
    } catch (err) {
      console.error('erro chegado', err.message);
      alert(err.message);
    }
    this.closeModalreg();

  }


  closeModalreg() {
    //   const onClosedData: string = "Wrapped Up!";
    const onClosedData: string = this.conclusion;
    this.modalController.dismiss(onClosedData);
    // this.navCtrl.navigateRoot('tabs');
    this.navCtrl.navigateRoot('tab2');

     }

     async closeModal() {
      //   const onClosedData: string = "Wrapped Up!";
//      const onClosedData: string = this.conclusion;

      await this.modalController.dismiss();

       }




}
