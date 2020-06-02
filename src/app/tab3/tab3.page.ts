import { async } from "@angular/core/testing";
import { Component } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { HTTP } from "@ionic-native/http/ngx";
import { ApiService } from "./../service/api.service";
import { LoadingController } from "@ionic/angular";
@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"],
})
export class Tab3Page {
  AllAccess: any;
  endPoint: any;
  environmentsite: any;
  cartData;
  authorization: any;
  public images: any;
  filtered_result_images: any = [];
  imgicon = "";
  isActive = false;
  count: number = 0;
  subTotal: number = 0;
  ordersIds;
  orderItems;
  getOrderId;
  constructor(
    private http: HTTP,
    public apiService: ApiService,
    public loadingController: LoadingController
  ) {
    if (localStorage.getItem("cartData")) {
      this.cartData = this.apiService.orders = JSON.parse(
        localStorage.getItem("cartData")
      );
    }

    this.ordersIds = this.apiService.orderIds$;
    if (localStorage.getItem("ordersId")) {
      this.allOrderItem();
    }
  }

  async ionViewDidEnter() {
    this.AllAccess = localStorage.getItem("OrderZ-AllAccess");
    this.environmentsite = localStorage.getItem("OrderZ-environment");
    await this.imagens();
  }
  postproduct() {}
  async imagens() {
    this.authorization = "Bearer " + this.AllAccess;
    this.endPoint = this.environmentsite + "v2/catalog/list?types=IMAGE";
    this.http
      .get(
        this.endPoint,
        {},
        {
          "Square-Version": "2020-04-22",
          Authorization: this.authorization,
          "Content-Type": "application/json",
        }
      )
      .then((response) => {
        this.images = JSON.parse(response.data);
        this.filtered_result_images = this.images.objects;
        if (this.filtered_result_images.length > 0) {
          this.imgicon = this.images.objects.id;
        } else {
        }
      });
  }
  increment(number, id) {
    console.log(number);
    // this.isActive = true;
    this.count = Number(number);
    this.count++;

    this.cartData.map((item) => {
      if (item.catalog_object_id == id) {
        item.quantity = `${this.count}`;
      }
    });

    this.apiService.orders = this.cartData;
    console.log(this.cartData);
  }
  decrement(number, id) {
    // this.isActive = true;
    this.count = Number(number);
    this.count--;
    if (this.count == 0) {
      var remaindata = this.cartData.map((item) => {
        if (item.catalog_object_id !== id) {
          return item;
        }
      });
      var newremaindata = remaindata.filter((item) => {
        if (item != undefined) {
          return item;
        }
      });
      this.apiService.orders = newremaindata;
      this.cartData = this.apiService.orders;
    }

    this.cartData.map((item) => {
      if (item.catalog_object_id == id) {
        item.quantity = `${this.count}`;
      }
    });
    this.apiService.orders = this.cartData;
  }
  placeOrder() {
    var line_items = this.cartData.map((item) => {
      return {
        quantity: item.quantity,
        catalog_object_id: item.catalog_object_id,
        note: item.note,
        modifiers: item.modifiers,
      };
    });
    const now = new Date();

    var auth = "Bearer " + this.AllAccess;
    var locationId = localStorage.getItem("OrderZ-LocalId");
    var apiURL = this.environmentsite + `v2/locations/${locationId}/orders`;

    const body = {
      idempotency_key:
        localStorage.getItem("OrderZ-FirstName") +
        localStorage.getItem("OrderZ-LastName") +
        now,
      order: {
        location_id: locationId,
        line_items: line_items,
        fulfillments: [
          {
            type: "PICKUP",
            state: "PROPOSED",
            pickup_details: {
              recipient: {
                display_name:
                  localStorage.getItem("OrderZ-FirstName") +
                  localStorage.getItem("OrderZ-LastName"),
              },
              pickup_at: now.toISOString(),
            },
          },
        ],
      },
    };
    this.http.setDataSerializer("json");
    this.http
      .post(apiURL, body, {
        "Square-Version": "2020-04-22",
        Authorization: auth,
        "Content-Type": "application/json",
      })
      .then((res: any) => {
        console.log(JSON.parse(res.data));
        this.cartData = this.apiService.orders = [];
        localStorage.setItem(
          "cartData",
          JSON.stringify(this.apiService.orders)
        );
        this.apiService.orderIds$.push(JSON.parse(res.data).order.id);
        this.getOrderId = JSON.parse(res.data).order.id;
        this.ordersIds = this.apiService.orderIds$;
        localStorage.setItem(
          "ordersId",
          JSON.stringify(this.apiService.orderIds$)
        );
        localStorage.setItem("localID", JSON.parse(res.data).order.location_id);
        alert("success");
        this.allOrderItem();
      });
  }
  async allOrderItem() {
    console.log(
      "here is ordersid",
      JSON.parse(localStorage.getItem("ordersId")),
      this.ordersIds
    );
    const loading = await this.loadingController.create({
      message: "Please wait...",
    });
    await loading.present();
    var auth = "Bearer " + localStorage.getItem("OrderZ-AllAccess");
    var locationId = localStorage.getItem("localID");
    var apiURL =
      "https://connect.squareupsandbox.com/" +
      `v2/locations/${locationId}/orders/batch-retrieve`;
    const body = {
      order_ids: JSON.parse(localStorage.getItem("ordersId")),
    };
    this.http.setDataSerializer("json");
    this.http
      .post(apiURL, body, {
        "Square-Version": "2020-05-28",
        Authorization: auth,
        "Content-Type": "application/json",
      })
      .then((res: any) => {
        this.orderItems = JSON.parse(res.data).orders;
        console.log("response--", this.orderItems);
        loading.dismiss();
      });
  }
}
