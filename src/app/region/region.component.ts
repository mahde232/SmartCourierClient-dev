import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Courier, Region } from '../_models/index';
import { AlertService, CourierService, RegionService } from '../_services/index';
import { HomeComponent } from '../home/index';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'region.component.html'
})

export class RegionComponent{
    private _jsonURL = 'assets/israel-cities.json';

    model: any = {region : Region };
    loading = false;
    choosedRegionId: number = -1 ;//The ID of the region that we choosed to assign courier to him.
    //cities: string[];
    cities: any = ['חיפה'];
    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private router: Router,
        private courierService: CourierService,
        private regionService: RegionService,
        private alertService: AlertService) {

    }

    public getJSON(): Observable<any> {
      return this.http.get(this._jsonURL);
    }

    createCitiesList(){
      this.getJSON().subscribe(data => {
        let cities = []

      data.forEach(function (value) {
        //console.log(value);
        cities.push(value.name);
      });
      this.cities = cities;
      });
    }

    ngOnInit() {
      this.createCitiesList();
      this.loading = false;
      this.route.params.subscribe(params => {
        let url = this.router.url;
        let regionId = url.split('/')[2];//We can get the region id from the URL.
        if(regionId != null){//If regionId is exist in the URL then it's update region screen.
          this.choosedRegionId = parseInt(regionId);
        }else//It's create region screen
        {
          this.choosedRegionId = -1;
        }
      });
    }

    createRegion(){
      let html = <HTMLInputElement>document.getElementById('cities');
      this.model.regionName = html.value;
      let foundCity = this.cities.filter(x => x == this.model.regionName)[0];
      if(this.model.regionName != foundCity){
        this.alertService.error('בבקשה הזן שם  עיר תקין');
        return;
      }
      this.loading = true;
      let region = new Region()
      region.regionName = this.model.regionName;
      region.threshold = this.model.threshold;
      this.regionService.createRegion(region).subscribe(
            data => {
              this.alertService.success('הוספת משלוח בוצעה בהצלחה', true);
              sessionStorage.setItem('showScreen', 'Region');//We want to back to home screen then initalize choosed region.
              this.router.navigate(['/']);
            }
          ,error => {
              this.alertService.error(error);
              this.loading = false;
          });

    }

    back(){
      sessionStorage.setItem('showScreen', 'Region');
      this.router.navigate(['/']);
    }
}
