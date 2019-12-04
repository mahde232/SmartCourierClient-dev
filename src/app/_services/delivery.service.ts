//declare var require: any;
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Delivery } from '../_models/index';

//declare var require: any;


/*const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Request-Method':  '*'
    //'Access-Control-Request-Headers': 'origin, x-requested-with'

  })
};*/

@Injectable()
export class DeliveryService {
    //latLng: any;
    //require: any;
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Delivery[]>('http://localhost:8080/delivery/getAll');
    }

    getDeliveriesByCourier(courierId: number) {
        return this.http.get<Delivery[]>('http://localhost:8080/courier/getDeliveries/' + courierId);
    }

    /*getById(id: number) {
        return this.http.get('/api/deliveries/' + id);
    }

    create(delivery: Delivery) {
        return this.http.post('/api/deliveries', delivery);
    }

    update(delivery: Delivery) {
        return this.http.put('/api/deliveries/' + delivery.id, delivery);
    }

    delete(id: number) {
        return this.http.delete('/api/deliveries/' + id);*/


}
