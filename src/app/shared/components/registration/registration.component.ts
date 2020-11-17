import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { LoginService } from '../../serveces/login.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  form : FormGroup;
  login;
  password;
  public error$: Subject<string> = new Subject<string>();
  error = false;

  constructor(private loginServices: LoginService, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      login: new FormControl(this.login, [Validators.required, Validators.minLength(1)]),
      password: new FormControl(this.password, [Validators.required, Validators.minLength(6)]),
    });
  }

  async registration() {
    try {
      await this.loginServices.registration(this.form.value);
      let answer = await this.loginServices.auth(this.form.value);
      localStorage['id'] = answer[0].id;
      this.router.navigate(['/contacts'])
      this.form.reset();
    } catch(e) {
      this.error$.next(e.error.message)
      this.error = true;
    }
  }

}
