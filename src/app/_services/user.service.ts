import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { User, Courier } from '../_models/index';

@Injectable()
export class UserService {
    constructor(private http: HttpClient) { }
    baseUrl = 'http://localhost:8080';

    getAll() {
        return this.http.get<User[]>( this.baseUrl + '/app/user/getAll/');
    }

    getById(id: number) {
        return this.http.get( this.baseUrl + '/app/user/' + id);
    }

    create(user: User) {
        return this.http.put( this.baseUrl + '/app/user/create/', user);
    }

    update(user: User) {
        return this.http.put( this.baseUrl + '/app/user/update/', user);
    }

    delete(id: number) {
        return this.http.delete( this.baseUrl + '/app/user/delete/' + id);
    }
}
