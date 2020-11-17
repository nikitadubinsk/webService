import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { LoginService } from '../../serveces/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form : FormGroup;
  login;
  password;
  public error$: Subject<string> = new Subject<string>();
  error = false;

  constructor(private loginServices: LoginService, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      login: new FormControl(this.login, [Validators.required, Validators.minLength(1), Validators.email]),
      password: new FormControl(this.password, [Validators.required, Validators.minLength(6)]),
    });
  }

  async authorization() {
    try {
      let answer = await this.loginServices.auth(this.form.value);
      this.form.reset();
      localStorage['id'] = answer[0].id;
      this.router.navigate(['/contacts'])
    } catch(e) {
      this.error$.next(e.error.message)
      this.error = true;
      console.log(e);
    }
  }

}
