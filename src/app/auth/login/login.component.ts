import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('f') form: NgForm;

  isloggedin = false;
  error = '';
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onLogin() {
    this.error = '';
    if (!this.form.valid) {
      return;
    }
    let email = this.form.value.email;
    let password = this.form.value.password;
    this.authService.login(email, password);
    this.isloggedin = true;
  }
}
