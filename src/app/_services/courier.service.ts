import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Courier } from '../_models/index';

@Injectable()
export class CourierService {
    constructor(private http: HttpClient) { }

    baseUrl = 'http://localhost:8080';

    getAll() {
        return this.http.get<Courier[]>(this.baseUrl + '/courier/getAll');
    }

    getById(id: number) {
        return this.http.get(this.baseUrl + '/courier/' + id);
    }

    create(courier: Courier) {
        return this.http.put(this.baseUrl + '/courier/create', courier);
    }

    update(courier: Courier) {
        return this.http.put(this.baseUrl + '/courier/update/' + courier.id, courier);
    }

    delete(id: number) {
      return this.http.delete(this.baseUrl + '/courier/delete/' + id);
    }
}
