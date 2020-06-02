import { element } from "protractor";
import { Component } from "@angular/core";
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject,
} from "@angular/fire/database";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { HTTP } from "@ionic-native/http/ngx";
import {
  LoadingController,
  ModalController,
  NavController,
} from "@ionic/angular";
import { MyModalPage } from "../modals/my-modal/my-modal.page";
import { AddressPage } from "../modals/address/address.page";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
})
export class Tab2Page {
  AllAccess: any;
  authorization: any;
  endPoint: any;
  environmentsite: any;
  dataReturned: any;
  dataaddress: any;
  bookingListRef: any;
  selectedItem: any;

  headersObj: any;

  // data: any = null;
  alertas: any = [];
  public postData: any;
  public items: any;
  public location: any;
  public images: any;
  public modifier: any;
  listData: any;
  locationdetail: any;
  filtered_result: any = [];
  filtered_result_category: any = [];
  filtered_result_images: any = [];
  filtered_result_modifier: any = [];
  filtered_result_modifierItems: any = [];
  filtered_result_imagesItems: any = [];
  itemall = "ITEM";
  categoryall = "CATEGORY";
  imgicon = "";
  modifiericon = "";
  location_name: any;
  location_address: any;
  location_locality: any;
  location_state: any;
  location_id: any;

  constructor(
    private http: HTTP,
    private db: AngularFireDatabase,
    public modalController: ModalController,
    public loadingController: LoadingController,
    public navCtrl: NavController
  ) { }

  async ionViewDidEnter() {
    this.AllAccess = localStorage.getItem("OrderZ-AllAccess");
    this.environmentsite = localStorage.getItem("OrderZ-environment");
    await this.checkaddress();
    //    await this.getlocation();
    await this.getcatalogueInfo();
    await this.imagens();

    //  this.getlocationAll();
  }

  async checkaddress() {
    if (localStorage.getItem("OrderZ-LocalId") == null) {
      alert("Please select a location to continue");
      await this.getaddress();
      this.location_name = localStorage.getItem("OrderZ-LocalName");
      this.location_address = localStorage.getItem("OrderZ-LocalAddress");
      this.location_locality = localStorage.getItem("OrderZ-LocalLocality");
      this.location_state = localStorage.getItem("OrderZ-LocalState");
      this.location_id = localStorage.getItem("OrderZ-LocalId");
    } else {
      this.location_name = localStorage.getItem("OrderZ-LocalName");
      this.location_address = localStorage.getItem("OrderZ-LocalAddress");
      this.location_locality = localStorage.getItem("OrderZ-LocalLocality");
      this.location_state = localStorage.getItem("OrderZ-LocalState");
      this.location_id = localStorage.getItem("OrderZ-LocalId");
    }
  }

  async openModal(
    idimagem,
    imagem,
    nameproduto,
    description,
    subitens,
    modifierid,
    element
  ) {
    const modal = await this.modalController.create({
      component: MyModalPage,
      cssClass: "my-custom-modal-css",
      componentProps: {
        idimagem,
        imagem,
        nameproduto,
        description,
        subitens,
        modifierid,
        element,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        this.dataReturned = dataReturned.data;
        // alert('Modal Sent Data :'+ dataReturned);
      }
    });

    return await modal.present();
  }

  //

  async getaddress() {
    const modal = await this.modalController.create({
      component: AddressPage,
    });

    modal.onDidDismiss().then((dataaddress) => {
      if (dataaddress !== null) {
        this.dataaddress = dataaddress.data;
        // alert('Modal Sent Data :'+ dataReturned);
      }
      location.reload();
    });

    return await modal.present();
  }

  async getlocation() {
    this.endPoint = this.environmentsite + "v2/locations/" + this.location_id;
    this.authorization = "Bearer " + this.AllAccess;
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
      .then(async (response) => {
        //   console.log('status location', response.status);
        this.location = JSON.parse(response.data);
        this.locationdetail = this.location.location;
      });
  }

  async getlocationAll() {
    this.endPoint = this.environmentsite + "/v2/locations";
    this.http
      .get(
        this.endPoint,
        {},
        {
          "Square-Version": "2020-04-22",
          Authorization:
            "Bearer EAAAECmL0fVj_IuBRfxmKG4SzrKgtKjkcTuN93LXsDzKU2g2GKNrR8i0_ag_dfcC",
          "Content-Type": "application/json",
        }
      )
      .then(async (response) => {
        // console.log('status ALL location', response.data);
        // this.location = JSON.parse(response.data);
        // this.locationdetail = this.location.location;
      });
  }

  async getcatalogueInfo() {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Loading products...",
      translucent: true,
      spinner: "lines",
      // duration: 2000
    });
    await loading.present();

    this.endPoint = this.environmentsite + "v2/catalog/list";
    this.authorization = "Bearer " + this.AllAccess;
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
      .then(async (response) => {
        this.items = JSON.parse(response.data);
        this.listData = this.items.objects;
        await this.filterAll(this.listData);
        await this.filterCategoryAll(this.listData);
      });
    loading.dismiss();
  }

  async filterAll(data) {
    // tslint:disable-next-line: variable-name
    let modifier_id = "no";
    const completeresult = [];
    const locationalid = [];
    let resultsfiltering = this.filtered_result;
    resultsfiltering = data.filter((item) => item.type === this.itemall);

    resultsfiltering.forEach((element) => {
      if (element.item_data.modifier_list_info) {
        element.item_data.modifier_list_info.forEach((elementmodifier) => {
          modifier_id = elementmodifier.modifier_list_id;
        });
      }

      if (element.present_at_all_locations === true) {
        completeresult.push({ element, modifier_id });
      } else if (element.present_at_all_locations === false) {
        element.present_at_location_ids.forEach((elelocation) => {
          if (elelocation === this.location_id) {
            completeresult.push({ element, modifier_id });
          }
        });
      }
    });
    this.filtered_result = completeresult;
  }

  async filterCategoryAll(data) {
    const completeresultcategory = [];
    let resultsfilteringcategory = this.filtered_result_category;
    resultsfilteringcategory = data.filter(
      (item) => item.type === this.categoryall
    );

    resultsfilteringcategory.forEach((element) => {
      if (element.present_at_all_locations === true) {
        completeresultcategory.push(element);
      } else if (element.present_at_all_locations === false) {
        element.present_at_location_ids.forEach((elelocation) => {
          if (elelocation === this.location_id) {
            completeresultcategory.push(element);
          }
        });
      }
    });
    this.filtered_result_category = completeresultcategory;
  }

  async filterByCategory(data, name) {
    const loading = await this.loadingController.create({
      cssClass: "my-custom-class",
      message: "Loading " + name,
      translucent: true,
      spinner: "lines",
      // duration: 2000
    });
    await loading.present();

    await this.filterAll(this.listData);
    this.filtered_result = this.filtered_result.filter(
      (item) => item.element.item_data.category_id === data
    );

    loading.dismiss();
  }

  async imagens() {
    //        const self = this;

    this.authorization = "Bearer " + this.AllAccess;
    this.endPoint = this.environmentsite + "v2/catalog/list?types=IMAGE";
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
        this.images = JSON.parse(response.data);
        this.filtered_result_images = this.images.objects;
        if (this.filtered_result_images.length > 0) {
          this.imgicon = this.images.objects.id;
        } else {
        }
      });
  }
}
