import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { LoginService } from '../../serveces/login.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  isEditContact = false;
  isCreateContact = true;
  form;
  name;
  telephone;
  email;
  user_id = 1;
  contacts;
  createAt;

  constructor(private loginServices: LoginService) { }

  async ngOnInit() {
    this.user_id = localStorage['id'];
    localStorage.clear();
    try {
      this.contacts = await this.loginServices.getAllContacts(this.user_id);
    } catch (e) {
      console.log(e)
    }
    this.form = new FormGroup({
      user_id: new FormControl(this.user_id, []),
      name: new FormControl(this.name, [Validators.required]),
      telephone: new FormControl(this.telephone, [Validators.required]),
      email: new FormControl(this.email, [Validators.required, Validators.email]),
    });
  }

  async submit() {
    if (this.isCreateContact) {
      try {
        let newContact = await this.loginServices.addContact(this.form.value);
        this.contacts.push(newContact);
      } catch (e) {
        console.log(e)
      }
    } else if (this.isEditContact) {
      console.log(this.form.value);
      try {
        await this.loginServices.editContact(this.form.value);
        let newContact = {
          id: this.form.value.id,
          user_id: this.form.value.user_id,
          name: this.form.value.name,
          telephone: this.form.value.telephone,
          email: this.form.value.email,
          createdAt: this.createAt
        }
        let index = this.contacts.findIndex((el)=>el.id == this.form.value.id); 
        this.contacts.splice(index, 1, newContact);
        this.form.reset();
      } catch (e) {
        console.log(e)
      }
    }
  }

  async edit(contact) {
    this.isEditContact = true;
    this.isCreateContact = false;
    this.createAt = contact.createdAt;
    this.form = new FormGroup({
      id: new FormControl(contact.id, []),
      user_id: new FormControl(contact.user_id, []),
      name: new FormControl(contact.name, [Validators.required]),
      telephone: new FormControl(contact.telephone, [Validators.required]),
      email: new FormControl(contact.email, [Validators.required, Validators.email]),
    });
  }

  async delete(id) {
    try {
      await this.loginServices.deleteContact(id);
      let index = this.contacts.findIndex((el)=>el.id == id); 
      this.contacts.splice(index, 1);
    } catch(e) {
      console.log(e)
    }
  }

}
