import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-super',
  templateUrl: './super.component.html',
  styleUrls: ['./super.component.css'],
})
export class SuperComponent implements OnInit {
  isUpdateMode = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.isUpdateModeObservable.subscribe((res) => {
      this.isUpdateMode = res;
    });
  }
}
