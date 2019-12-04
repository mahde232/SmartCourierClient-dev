import { Component, OnInit } from '@angular/core';
import { User, Courier, Delivery, Region} from '../_models/index';
import { UserService, CourierService, DeliveryService, RegionService } from '../_services/index';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id.toString(),
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    currentUser: User;//Current loged user.
    couriers: Courier[] = [];//The list of couriers to show.
    deliveries: Delivery[] = [];//The courier's deliveries to show, or the deliveries of the selected region (depands on which screen we are at).
    showScreen: string = 'Menu';//Show couriers screen as defult.
    regionSelected: String;//Save the index of the region the user choose from the select box.
    regions: Region[] = [];//Save the courier regions after choosing to show his deliveries.
    courierId: number;//Save the courier ID after choosing to show his deliveries.
    region: Region;//Save the region after choosing to show his deliveries or couriers.
    constructor(private userService: UserService,
                private courierService: CourierService,
                private deliveryService: DeliveryService,
                private regionService: RegionService,
                private router: Router) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        let choosedRegion = null;
        let parsedChoosedRegion = null;
        let showScreen = sessionStorage.getItem('showScreen');
        if(showScreen == "null" || showScreen == "undefined"){
          showScreen = "menu";
        }
        switch(showScreen){
          case '':
            this.showScreen = 'Courier';
            this.loadAllCouriers();
          break;
          case 'DeliveryInRegion':
            this.showScreen = 'DeliveryInRegion';
            choosedRegion = sessionStorage.getItem('choosedRegion');
            parsedChoosedRegion = JSON.parse(choosedRegion);
            this.showDeliveriesInRegion(parsedChoosedRegion);
            this.regionService.getRegion(this.region).subscribe(region => {
              this.region = region;
              this.deliveries = this.region.delivery;
              this.couriers = this.region.courier;
            });
          break;
          case 'CourierInRegion':
            this.showScreen = 'CourierInRegion';
            choosedRegion = sessionStorage.getItem('choosedRegion');
            parsedChoosedRegion = JSON.parse(choosedRegion);
            this.showCouriersInRegion(parsedChoosedRegion);
          break;
          case 'Region':
            this.showScreen = 'Region';
            this.loadAllRegions();
          break;
          case 'Courier':
            this.showScreen = 'Courier';
            this.loadAllCouriers();
          break;
          case 'Menu':
          this.showScreen = 'Menu';
          break;
        }
    }

    deleteCourier(id: number) {
       this.courierService.delete(id).subscribe(() => { this.loadAllCouriers() });
    }

    deleteRegion(id: number) {
       this.regionService.delete(id).subscribe(() => { this.loadAllRegions() });
    }

    deleteDeliveryFromRegion(deliveryId: number){
      this.regionService.deleteDeliveryInRegion(this.region.id, deliveryId).subscribe(() =>{ this.loadDeliveriesInRegion(this.region); });
    }

    unassignCourierToRegion(courier: Courier)
    {
          this.regionService.unassignCourierToRegion(this.region.id, courier.id).subscribe(() =>{
          this.regionService.getRegion(this.region).subscribe(region =>{ this.couriers = region.courier});
          });
    }

    showCourierCreateForm(){
      sessionStorage.setItem('formType', 'createCourier');
      this.router.navigate(['/courier']);
    }

    showCourierEditForm(courier :Courier){
      sessionStorage.setItem('formType', 'updateCourier');
      sessionStorage.setItem('choosedCourier', JSON.stringify(courier));
      this.router.navigate(['/courier']);
    }

    showCourierAssignForm(region: Region){
      sessionStorage.setItem('formType', 'assignCourier');
      sessionStorage.setItem('choosedRegion', JSON.stringify(region));
      this.router.navigate(['/courier', region.id]);
    }

    showCreateDeliveryInRegionScreen(region: Region)
    {
      sessionStorage.setItem('choosedRegion', JSON.stringify(region));
      this.router.navigate(['/delivery']);
    }

    /*showCreateEditDeliveryInRegionScreen(region: Region)
    {
      sessionStorage.setItem('choosedRegion', JSON.stringify(region));
      this.router.navigate(['/delivery']);
    }*/

    showCreateNewRegion()
    {
      this.router.navigate(['/region']);
    }

    showEditRegion(region: Region)
    {
      this.router.navigate(['/region', region.id]);
    }

    //Choosing region from select box.
    regionSelect(regionSelected: String){
      if(regionSelected == "")//Show deliveries from all regions.
      {
        this.deliveryService.getDeliveriesByCourier(this.courierId).subscribe(deliveries =>{
          this.deliveries = deliveries;
        });
      }else
      {
        for(var i = 0; i < this.regions.length; i++)
        {
          if(this.regions[i].regionName == regionSelected)
              var regionId = this.regions[i].id;
        }
        this.regionService.getCourierDeliveries(this.courierId , regionId).subscribe(deliveries =>{
            this.deliveries = deliveries;
        });
      }
    }

    changeScreen(screen: string)
    {
      switch(screen){
        case 'Courier':
          this.loadAllCouriers();
          break;
        case 'Region':
          this.loadAllRegions();
          break;
        case 'Delivery':
          this.loadAllDeliveries();
          break;
        }
        this.showScreen = screen;
    }

    private loadAllCouriers() {
        this.courierService.getAll().subscribe(couriers => {
        var allCouriers = [];
        for(var i = 0; i < couriers.length; i++){
          allCouriers.push(couriers[i]);
      }
          this.couriers = allCouriers;
        });
    }

    private loadAllRegions()
    {
        this.regionService.getAll().subscribe(regions => {
          this.regions = regions;
        });
    }

    private loadAllDeliveries()
    {
        this.deliveryService.getAll().subscribe(deliveries => {
          this.deliveries = deliveries;
        });
    }

    private loadDeliveriesInRegion(region: Region)
    {
        this.regionService.getRegion(this.region).subscribe(region => {
          this.region = region
          this.deliveries = region.delivery;
        });
    }

    // Clicking on show region's deliveries.
    showDeliveriesInRegion(region: Region) {
      this.deliveries = region.delivery;
      this.showScreen = 'DeliveryInRegion';
      sessionStorage.setItem('showScreen', this.showScreen);
      this.region = region;
    }

    // Clicking on show region's couriers.
    showCouriersInRegion(region: Region) {
      this.couriers = region.courier;
      this.showScreen = 'CourierInRegion';
      sessionStorage.setItem('showScreen', this.showScreen);
      this.region = region;
    }

    // Clicking on show courier's deliveries.
    showDeliveriesOfCourier(courierId: number, delivieris: Delivery[]) {
      this.deliveries = delivieris;
      this.showScreen = 'DeliveryOfCourier';
      sessionStorage.setItem('showScreen', this.showScreen);
      this.courierId = courierId;
    }
}
