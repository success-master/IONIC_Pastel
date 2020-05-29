import { Component, OnInit } from "@angular/core";
import { HTTP } from "@ionic-native/http/ngx";
import { ModalController, LoadingController, NavParams } from "@ionic/angular";
import { ApiService } from "./../../service/api.service";
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

  nameproduto = "";
  description = "";
  idimagem = "";
  modifierid = "";
  public subitem: any;
  public image: any;
  public itemsdetail: any;
  listDatadetail: any;
  public currentNumber = 0;

  constructor(
    private modalController: ModalController,
    private http: HTTP,
    public loadingController: LoadingController,
    private navParams: NavParams,
    public apiService: ApiService
  ) {
    console.log("here is api serve", this.apiService.orders, this.navParams);
  }

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
    console.log("ionViewDidLoad DetailPage entrado");
    // imagem,name,description,subitens
    this.image = [];
    this.subitem = [];
    this.nameproduto = this.navParams.get("nameproduto");
    this.description = this.navParams.get("description");
    this.idimagem = this.navParams.get("idimagem");
    this.image = this.navParams.get("imagem");
    this.subitem = this.navParams.get("subitens");
    this.modifierid = this.navParams.get("modifierid");
    console.log("modifi item", this.modifierid);

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
    }
  }

  ngOnInit() {
    console.table(this.navParams);
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
        console.log("Modifier", this.modifier);
        this.filtered_result_modifier = this.modifier.objects;

        const modid = [];
        this.filtered_result_modifier.forEach((elementmodifier) => {
          if (
            elementmodifier.modifier_data.modifier_list_id === this.modifierid
          ) {
            modid.push(elementmodifier);
            console.log("modiidsarrived", elementmodifier);
          } else {
            console.log("not in the modifier list");
          }
        });
        this.filtered_result_modifierItems = modid;
      });
  }

  async closeModal() {
    //   const onClosedData: string = "Wrapped Up!";
    await this.modalController.dismiss();
  }
}
