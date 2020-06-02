import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
// FCM
import * as firebase from "firebase/app";
import { User } from "./modals/register/register.page";
import { ApiService } from "./service/api.service";
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public apiService: ApiService
  ) {
    if (JSON.parse(localStorage.getItem("cartData"))) {
      this.apiService.orders = JSON.parse(localStorage.getItem("cartData"));
    }

    this.initializeApp();
    this.loadlocation();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  loadlocation() {
    localStorage.setItem(
      "OrderZ-AllAccess",
      "EAAAEBF7Ldy__Rb4o-m5WQy3tZmGEFgAcVM9tkXOkCwPOJdH0g2BJkS7jLot3qNX"
    );
    localStorage.setItem(
      "OrderZ-environment",
      "https://connect.squareupsandbox.com/"
    );
    //https://connect.squareup.com/
    //https://connect.squareupsandbox.com/
    // production EAAAEJua8E_pL8OfsvgHhF430upzxCsnOmLT25PswWkWJJa8j-2Ft73iIdH3qchP
    // sandbox EAAAEBF7Ldy__Rb4o-m5WQy3tZmGEFgAcVM9tkXOkCwPOJdH0g2BJkS7jLot3qNX
  }
}
