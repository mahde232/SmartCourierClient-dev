import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Courier, Region } from '../_models/index';
import { AlertService, UserService, CourierService, RegionService } from '../_services/index';
import { HomeComponent } from '../home/index';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'courier.component.html'
})

export class CourierComponent{
    model: any = {courier : Courier };
    loading = false;
    choosedRegionId: number = -1 ;//The ID of the region that we choosed to assign courier to him.
    region: Region;
    formType: string;
    //regions: Region[] = [];//Save the courier regions after choosing to show his deliveries.
    choosedCourierName: string = "לא נבחר שליח";
    //choosedCourier: Courier;//Courier choosed to be edited.
    dropdownCourier: Courier;//Courier chossed from dropdown.
    couriers: Courier[];

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private courierService: CourierService,
        private regionService: RegionService,
        private alertService: AlertService) {
    }


    ngOnInit() {
      this.loading = false;
      let formType = sessionStorage.getItem('formType')
      switch(formType){
        case 'createCourier':
        this.formType = formType;
        break;
        case 'updateCourier':
        this.formType = formType;
        break;
        case 'assignCourier':
        this.formType = formType;
        this.region = JSON.parse(sessionStorage .getItem('choosedRegion'));
        this.loadAllCouriers();
        break;
      }
    }

    assignCourierToRegion(){
      if(this.choosedCourierName != "לא נבחר שליח")
      {
        this.regionService.assignCourierToRegion(this.region.id, this.dropdownCourier.id).subscribe(region => {
          this.region = region;
          //We back from assign courier to region and not from edit courier screen, then change it.
          this.regionService.getRegion(this.region).subscribe(region => { this.region = region; this.couriers = region.courier; });
          sessionStorage .setItem('choosedRegion', JSON.stringify(this.region))
          sessionStorage .setItem('choosedCourier', null)
          this.alertService.success('שליח שוייך בהצלחה לאזור', true);
          this.loading = false;
        }
        ,error => {
            this.alertService.error('!אירעה שגיאה: שליח לא שוייך לאזור');
            this.loading = false;
        });
      }
    }


    createCourier() {
      this.loading = true;
      let courier = new Courier()
      courier.email = this.model.email;
      courier.phone = this.model.phone;
      courier.password = this.model.password;
      courier.firstName = this.model.firstName;
      courier.lastName = this.model.lastName;
      this.courierService.create(courier).subscribe(
            data => {
              this.alertService.success('יצירת שליח חדש בוצעה בהצלחה', true);
              this.loading = false;
            }
          ,error => {
              this.alertService.error(error);
              this.loading = false;
          });
          sessionStorage .setItem('showScreen', 'Courier')
          this.router.navigate(['/']);
    }

    updateDropdownCourier(courier: Courier){
        this.choosedCourierName = courier.id + ' - ' + courier.email;
        this.dropdownCourier = courier;
    }
        backFromCourierForm()
        {
          sessionStorage .setItem('showScreen', 'Courier')
          this.router.navigate(['/']);
        }

        backFromAssignCourier()
        {
          sessionStorage .setItem('showScreen', 'CourierInRegion')
          this.router.navigate(['/']);
        }

        loadAllCouriers() {
            this.courierService.getAll().subscribe(couriers => {
              this.couriers = couriers;
            });
        }
}
