import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css'],
})
export class CreateAdminComponent implements OnInit {
  @ViewChild('f') form: NgForm;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {}

  onSignup() {
    if (!this.form.valid) {
      return;
    }

    let obj: User = {
      firstname: this.form.value.firstname,
      lastname: this.form.value.lastname,
      email: this.form.value.email,
      address: this.form.value.address,
      role: this.form.value.role,
      gender: this.form.value.gender,
      password: this.form.value.password,
    };
    this.authService.signup(obj);
  }
}
