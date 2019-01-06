import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AccountService {

    constructor(
        private httpClient: HttpClient
    ) { }

    getAccount() {
        return  this.httpClient.get('account');
    }

    update(user) {
        return  this.httpClient.put('account/'+user.id, {user: user});
    }

    findUserByEmail(body) {
        return  this.httpClient.post('account/findUserByEmail', body);
    }
}
