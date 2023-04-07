import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'test-task';


  base_url:any = 'http://localhost:3000';
  items:any = [];

  constructor(public http: HttpClient){

  }

  ngOnInit() {
    var me = this;
    let btnRefresh:any = this.getBtnRefresh();

    btnRefresh.onclick = function () {
      btnRefresh.disabled = true;
      me.loadItems()
        .then((result) => {
          me.fillSelect(result);
        })
        .finally(() => {
          btnRefresh.disabled = false;
        })
    };

    let btnSelect:any = this.getBtnSelect();
    btnSelect.onclick = function () {
      btnSelect.disabled = true;
      let phoneSelect:any = document.getElementById("phone-select");
      let selected = phoneSelect.value;
      me.postSelectItem(selected)
        .then((result:any) => {
          alert('status: '+ result.status);
        });
    };
  }

  buildUrlForGet(endpoint:any, params:any) {
    let dc = Math.random().toString();
    let prm = '';
    if (!!params) {
      prm = '&' + params;
    }
    return this.base_url + endpoint + '?_dc=' + dc + prm;
  }

  loadItems() {
    var me = this;
    return new Promise(function (resolve, reject) {
      let url = me.buildUrlForGet('/items','');
      me.http.get(url).subscribe(
        (res:any) => {
          resolve(res)
        },
        (res:any) => {
          reject(res);
        });
    });
  }

  postSelectItem(value:any) {
    var me = this;
    return new Promise(function (resolve, reject) {
      let url = me.buildUrlForGet('/select/'+value,'');
      me.http.post(url,'').subscribe(
        (res:any) => {
          resolve(res)
        },
        (res:any) => {
          reject(res);
        });
    });
  }

  getBtnRefresh() {
    return document.getElementById('btn-refresh');
  }

  getBtnSelect() {
    return document.getElementById('btn-select');
  }

  getPhoneSelect() {
    return document.getElementById('phone-select');
  }

  fillSelect(items:any) {
    let phoneSelect:any = this.getPhoneSelect();
    phoneSelect.innerHTML = '';
    for (let i = 0; i < items.length; i++) {
      phoneSelect.innerHTML = phoneSelect.innerHTML +
        '<option value="' + items[i]['id'] + '">' + items[i]['name'] + '</option>';
    }
  }
}
