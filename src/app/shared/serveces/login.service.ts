import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) {}

  registration(user) {
    return this.http.post(`http://localhost:3000/api/user`, user).toPromise()
  }

  auth(user) {
    return this.http.post(`http://localhost:3000/api/auth`, user).toPromise()
  }

  addContact(contact) {
    return this.http.post(`http://localhost:3000/api/contact`, contact).toPromise()
  }

  getAllContacts(user_id) {
    return this.http.get(`http://localhost:3000/api/contacts/${user_id}`).toPromise()
  }

  editContact(contact) {
    return this.http.put(`http://localhost:3000/api/edit/contact`, contact).toPromise()
  }

  deleteContact(id) {
    return this.http.delete(`http://localhost:3000/api/delete/contact/${id}`).toPromise();
  }
}
