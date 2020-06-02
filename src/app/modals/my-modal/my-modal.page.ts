import { Component, OnInit } from "@angular/core";
import { HTTP } from "@ionic-native/http/ngx";
import { ModalController, LoadingController, NavParams } from "@ionic/angular";
import { ApiService } from "./../../service/api.service";
import { environment } from "src/environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { JsonPipe } from "@angular/common";
@Component({
  selector: "app-my-modal",
  templateUrl: "./my-modal.page.html",
  styleUrls: ["./my-modal.page.scss"],
})
export class MyModalPage implements OnInit {
  public modifier: any;
  filtered_result_modifier: any = [];
  filtered_result_modifierItems: any = [];
  endPoint: any;
  modifiericon = "";
  AllAccess: any;
  authorization: any;
  environmentsite: any;
  modalTitle: string;
  modelId: number;
  id: number;
  name: string;
  price: number;
  amount: number;
  elementData: any;
  nameproduto = "";
  description = "";
  idimagem = "";
  modifierid = "";
  public subitem: any;
  public image: any;
  public itemsdetail: any;
  listDatadetail: any;
  public currentNumber = 1;
  ismodactive = false;
  modid = [];
  cartData = [];
  modifiers = [];
  constructor(
    private modalController: ModalController,
    private http: HTTP,
    private https: HttpClient,
    public loadingController: LoadingController,
    private navParams: NavParams,
    public apiService: ApiService
  ) { }

  async ionViewDidEnter() {
    this.AllAccess = localStorage.getItem("OrderZ-AllAccess");
    this.environmentsite = localStorage.getItem("OrderZ-environment");
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Loading product...",
      translucent: true,
      // duration: 2000
    });
    await loading.present();
    // imagem,name,description,subitens
    this.image = [];
    this.subitem = [];
    this.nameproduto = this.navParams.get("nameproduto");
    this.description = this.navParams.get("description");
    this.idimagem = this.navParams.get("idimagem");
    this.image = this.navParams.get("imagem");
    this.subitem = this.navParams.get("subitens");
    this.modifierid = this.navParams.get("modifierid");
    this.elementData = this.navParams.get("element");
    console.log("here is element data: ", this.elementData);
    if (this.modifierid !== "no") {
      console.log("found modifier");
      await this.modifier_load();
    } else {
      console.log("no modifier");
    }

    loading.dismiss();
  }

  private increment() {
    this.currentNumber++;
  }

  private decrement() {
    if (this.currentNumber > 0) {
      this.currentNumber--;
    } else if (this.currentNumber == 0) {
      this.currentNumber = 0;
    }
  }

  ngOnInit() {
    this.modelId = this.navParams.data.paramID;
    this.modalTitle = this.navParams.data.paramTitle;
  }

  // MODIFIER
  modifier_load() {
    this.authorization = "Bearer " + this.AllAccess;
    this.endPoint = this.environmentsite + "v2/catalog/list?types=MODIFIER";

    // tslint:disable-next-line:max-line-length
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
        this.modifier = JSON.parse(response.data);
        this.filtered_result_modifier = this.modifier.objects;

        this.modid = [];
        this.filtered_result_modifier.forEach((elementmodifier) => {
          if (
            elementmodifier.modifier_data.modifier_list_id === this.modifierid
          ) {
            this.modid.push(elementmodifier);
            console.log("modiidsarrived", elementmodifier, this.modid);
            this.ismodactive = true;
          } else {
            console.log("not in the modifier list");
            this.ismodactive = false;
          }
        });
        this.filtered_result_modifierItems = this.modid;
      });
  }

  async addCart() {
    this.modalController.dismiss();

    if (this.ismodactive) {
      var order = {
        quantity: `${this.currentNumber}`,
        catalog_object_id: this.elementData.item_data.variations[0].id,
        note: this.elementData.item_data.name,
        image_id: this.idimagem,
        description: this.elementData.item_data.description,
        amount: this.elementData.item_data.variations[0].item_variation_data
          .price_money.amount,
        modifiers: this.modifiers,
      };
      if (this.apiService.orders.length > 0) {
        this.apiService.orders.map((item) => {
          if (
            item.catalog_object_id ==
            this.elementData.item_data.variations[0].id
          ) {
            item.quantity = `${
              Number(item.quantity) + Number(this.currentNumber)
              }`;
            return;
          } else {
            this.apiService.orders.push(order);
            localStorage.setItem(
              "cartData",
              JSON.stringify(this.apiService.orders)
            );
          }
        });
      } else {
        this.apiService.orders.push(order);
        localStorage.setItem(
          "cartData",
          JSON.stringify(this.apiService.orders)
        );
      }
    } else {
      var order2 = {
        quantity: `${this.currentNumber}`,
        catalog_object_id: this.elementData.item_data.variations[0].id,
        note: this.elementData.item_data.name,
        image_id: this.idimagem,
        description: this.elementData.item_data.description,
        amount: this.elementData.item_data.variations[0].item_variation_data
          .price_money.amount,
        modifiers: [],
      };
      console.log("is order: ", order2);
      if (this.apiService.orders.length > 0) {
        this.apiService.orders.map((item) => {
          if (
            item.catalog_object_id ==
            this.elementData.item_data.variations[0].id
          ) {
            item.quantity = `${
              Number(item.quantity) + Number(this.currentNumber)
              }`;
            return;
          } else {
            this.apiService.orders.push(order2);
            localStorage.setItem(
              "cartData",
              JSON.stringify(this.apiService.orders)
            );
          }
        });
      } else {
        this.apiService.orders.push(order2);
        localStorage.setItem(
          "cartData",
          JSON.stringify(this.apiService.orders)
        );
      }
    }
    this.modifiers = [];
  }
  closeModal() {
    this.modalController.dismiss();
    this.modifiers = [];
  }
  checkboxClick(e, id) {
    if (e.detail.checked) {
      var data = {
        catalog_object_id: id,
      };
      this.modifiers.push(data);
    } else {
      var remain = this.modifiers.map((item) => {
        if (item.catalog_object_id != id) {
          return item;
        }
      });
      var filterdata = remain.filter((item) => {
        if (item != undefined) {
          return item;
        }
      });
      this.modifiers = filterdata;
      console.log("here is status1", this.modifiers);
    }
    console.log("here is status", this.modifiers);
  }
}
