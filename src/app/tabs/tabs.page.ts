import { Component } from "@angular/core";
import { FCM } from "@ionic-native/fcm/ngx";
import * as firebase from "firebase/app";
import { ApiService } from "./../service/api.service";
@Component({
  selector: "app-tabs",
  templateUrl: "tabs.page.html",
  styleUrls: ["tabs.page.scss"],
})
export class TabsPage {
  constructor(private fcm: FCM, private apiService: ApiService) {
    this.notification();
  }

  notification() {
    // get FCM token
    this.fcm.getToken().then((token) => {
      console.log("token", token);
      localStorage.setItem("OrderZ-Token", token);

      const uid = localStorage.getItem("OrderZ-Uid");
      if (localStorage.getItem("OrderZ-Uid") !== null) {
        return firebase
          .database()
          .ref("users/" + uid)
          .update({
            token: localStorage.getItem("OrderZ-Token"),
            latestlogintime: firebase.database.ServerValue.TIMESTAMP,
          });
      }
    });

    // ionic push notification example
    this.fcm.onNotification().subscribe((data) => {
      console.log(data);
      if (data.wasTapped) {
        console.log("Received in background");
      } else {
        console.log("Received in foreground");
      }
    });

    // refresh the FCM token
    this.fcm.onTokenRefresh().subscribe((token) => {
      console.log("token", token);
    });

    // unsubscribe from a topic
    // this.fcm.unsubscribeFromTopic('offers');
  }
}
