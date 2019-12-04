declare var require: any;
import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Courier, Region, Delivery } from '../_models/index';
import { AlertService, RegionService, DeliveryService } from '../_services/index';
import { HomeComponent } from '../home/index';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {} from 'googlemaps';
import { FormControl} from '@angular/forms'
import {MapsAPILoader} from '@agm/core';
const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Request-Method':  '*'
    //'Access-Control-Request-Headers': 'origin, x-requested-with'

  })
};

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'delivery.component.html',
    styleUrls: ['delivery.component.css']

})

export class DeliveryComponent implements OnInit {
  title ='app'
  @ViewChild('search')
  public searchElementRef: ElementRef;
  public zoom: number;
  public latitude: Number;
  public longitude: Number;
  public latlongs: any = [];
  public latlong: any = {};
  public searchControl: FormControl;
  public options: any = ['לא','כן'];
  public choosedOption: String = 'לא';
    model: any = {delivery : Delivery };
    loading = false;
    regions: Region[] = [];//Save all region for adding delivery to region.
    region: Region = null;
    delivery: Delivery = null;
    latLng: any = {lat: Number, lng: Number};
    constructor(
        private ngZone: NgZone,
        private mapsAPILoader: MapsAPILoader,
        private deliveryService: DeliveryService,
        private route: ActivatedRoute,
        private router: Router,
        private regionService: RegionService,
        private alertService: AlertService) {
    }

    ngOnInit()
    {
      this.model.isUrgent = 0;
      this.zoom = 8;
      this.latitude = 32.0775274495921;
      this.longitude = 34.77996826171876;
      this.searchControl = new FormControl();
      this.setCurrentPosition();
      this.mapsAPILoader.load().then(() => {
        const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: [],
          componentRestrictions: {'country': 'IL'}
        });
        autocomplete.addListener('place_changed', () => {
          this.ngZone.run(() => {
            const place: google.maps.places.PlaceResult = autocomplete.getPlace();
            if( place.geometry === undefined || place.geometry === null){
              return;
            }

            const latlong = {
              latitude : place.geometry.location.lat(),
               longitude : place.geometry.location.lng()
            };
          this.latlongs = [];
          this.latlongs.push(latlong);
          this.searchControl.reset();

          });
        });
      });

      this.region = JSON.parse(sessionStorage.getItem('choosedRegion'));
      this.loadAllRegions()
      this.model.delivery = new Delivery();
    }

    private setCurrentPosition(){
      if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition((position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 8;
        });
      }
    }

    private loadAllRegions()
    {
        this.regionService.getAll().subscribe(regions => {
          this.regions = regions;
        });
    }


    updateDropdownIsUrgent(option: String){
      this.choosedOption = option;
      if(option == 'כן')
        this.model.isUrgent = 1;
      else
        this.model.isUrgent = 0;
    }

    sendDeliveryToServer()
    {
      this.loading = true;
      let delivery = new Delivery()
      delivery.name = this.model.name;
      delivery.isUrgent = this.model.isUrgent;
      delivery.latitude = this.model.latitude;
      delivery.longitude = this.model.longitude;
      delivery.phone = this.model.phone;
      delivery.claimant = this.model.claimant;
      delivery.entrance = this.model.entrance;
      delivery.floor = this.model.floor;
      delivery.box = this.model.box;
      let html = <HTMLInputElement>document.getElementById('address');
      delivery.address = html.value;
      this.regionService.createDeliveryInRegion(delivery, this.region.id).subscribe(
            data => {
              this.alertService.success('הוספת משלוח בוצעה בהצלחה', true);
              this.loading = false;
            }
          ,error => {
              this.alertService.error(error);
              this.loading = false;
          });
    }

    createDeliveryInRegion()
    {
      if( this.latlongs.length < 1)  this.alertService.error('בבקשה הזן כתובת בתוך האזור שנבחר');
      else{
      this.model.latitude = String(this.latlongs[0]['latitude']);
      this.model.longitude = String(this.latlongs[0]['longitude']);
      this.sendDeliveryToServer();
      }
      //this.fromAdressToLanAndAtt();
    }

    /*fromAdressToLanAndAtt(){
      let address = this.model.adress;
      let googleMapsUrl = 'https://maps.googleapis.com/maps/api/';
      let apiKey = 'insert-api-key';
      //address = '1600+Amphitheatre+Parkway,+Mountain+View,+CA';
      //  return this.http.get(googleMapsUrl + 'geocode/json?address=' + address + '&key=' + apiKey, httpOptions);
      let latLng = {};

        const https = require('https');

        https.get(googleMapsUrl + 'geocode/json?address=' + address + '&key=' + apiKey, (resp) => {
          let data = '';

          // A chunk of data has been recieved.
          resp.on('data', (chunk) => {
            data += chunk;
            //data = JSON.parse('' + chunk);
            //var json = JSON.parse(data);
            //alert('lat: ' + json.results[0].geometry.location.lat + 'lng: ' + json.results[0].geometry.location.lng);
          });

          // The whole response has been received. Print out the result.
          resp.on('end', () => {
             //console.log(JSON.parse(data));
            let location = {results: []};
            location = JSON.parse(data);
            if(location.results.length > 1) console.log("בבקשה הכנס כתובת מדויקת יותר.");
            else{
              if(location.results.length == 1){
                this.latLng = {"lat" : location.results[0].geometry.location.lat, "lng" : location.results[0].geometry.location.lng};
                this.model.latitude = this.latLng.lat;
                this.model.longitude = this.latLng.lng;
                this.sendDeliveryToServer();
              }
              else
                console.log("בבקשה הכנס כתובת תקינה");
            }
            //this.latLng = {"lat:" : data.results[0].geometry.location.lat, "lng:" : data.results[0].geometry.location.lng};
          });

        }).on("error", (err) => {
          console.log("Error: " + err.message);
        });
    }*/

  }
