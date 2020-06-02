import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  public orders = [];
  public orderIds$ = [];
  constructor() {}
}
