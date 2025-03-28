import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../shared/models/user';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../auth/auth-service.service';

@Component({
  selector: 'app-user-registor',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './user-registor.component.html',
  styleUrl: './user-registor.component.css',
})
export class UserRegistorComponent {
  image1: File | null = null;
  image2: File | null = null;
  imagePreview1: string | null = null;
  imagePreview2: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthServiceService
  ) {}

  userRegister: User = {
    title: '',
    userFirst: '',
    userLast: '',
    userDob: new Date(),
    userGender: 0,
    password: '',
    remark: '',
  };
  ngOnint() {
    console.log('UserRegistorComponent');
  }

  onSubmit() {
    console.log(this.userRegister);
    this.authService.userRegister(this.userRegister).subscribe((data: any) => {
      const userId = data;

      if (userId) {
        this.uploadImage(userId, 1, this.image1);
        this.uploadImage(userId, 2, this.image2);
      }

      this.router.navigate(['/user-login']);
    });
  }

  onFileChange(event: any, imageNumber: number) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (imageNumber === 1) {
          this.image1 = file;
          this.imagePreview1 = reader.result as string;
        } else if (imageNumber === 2) {
          this.image2 = file;
          this.imagePreview2 = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file.');
    }
  }
  uploadImage(userId: number, imageNumber: number, file: File | null) {
    if (file) {
      const formData = new FormData();
      formData.append('file', file, file.name);
      
      this.authService.imageUpload(userId, imageNumber, formData).subscribe(
        response => {
          console.log(response);
        },
        error => {
          console.log(error);
        }
      );
    }
  }
  
}
