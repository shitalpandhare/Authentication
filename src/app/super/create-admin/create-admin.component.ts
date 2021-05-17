import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css'],
})
export class CreateAdminComponent implements OnInit {
  @ViewChild('f') form: NgForm;

  id: string;
  isUpdateMode = false;

  obj: User = {
    firstname: '',
    lastname: '',
    email: '',
    address: '',
    role: '',
    gender: '',
    password: '',
  };
  adminResponse: { message: string; admin: User };

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((data) => {
      if (data.id) {
        this.id = data.id;
        this.isUpdateMode = true;
        this.authService.isUpdateModeObservable.next(true);
        this.authService.getAdminById(this.id).subscribe(
          (res) => {
            this.adminResponse = res;
            this.obj = this.adminResponse.admin;
            console.log('in ser', this.obj);
          },
          (err) => {
            console.log(err);
          }
        );
      }
    });
  }

  onSignup() {
    if (!this.form.valid) {
      return;
    }

    // let obj: User = {
    //   firstname: this.form.value.firstname,
    //   lastname: this.form.value.lastname,
    //   email: this.form.value.email,
    //   address: this.form.value.address,
    //   role: this.form.value.role,
    //   gender: this.form.value.gender,
    //   password: this.form.value.password,
    // };
    if (!this.isUpdateMode) {
      this.obj.role = 'admin';
      this.authService.signup(this.obj);
    } else {
      this.obj.role = 'admin';
      this.authService.updateAdmin(this.obj, this.id);
      this.authService.isUpdateModeObservable.next(false);
    }
  }
}
