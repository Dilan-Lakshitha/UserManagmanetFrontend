import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserLogin } from '../../shared/models/userLogin';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../auth/auth-service.service';

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [FormsModule , CommonModule ,RouterModule],
  templateUrl: './user-login.component.html',
  styleUrl: './user-login.component.css'
})
export class UserLoginComponent {

  constructor(private router:Router , private authservice:AuthServiceService) { }
  
  userLogin: UserLogin = {
    name: '',
    password: '',
  };
  ngOnint(){
    if (this.authservice.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }


  onSubmit() {
    this.authservice.userLogin(this.userLogin).subscribe((data: any) => {
      if (data) {
        this.router.navigate(['dashboard']);
      }
    } , (error) => {  
      console.log(error);
    }
    );
  }
}
