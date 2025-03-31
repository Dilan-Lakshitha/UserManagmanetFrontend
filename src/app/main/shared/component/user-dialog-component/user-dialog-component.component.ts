import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { User } from '../../models/user';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthServiceService } from '../../../auth/auth-service.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ManagerServiceService } from '../../../services/manager-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserUpdate } from '../../models/userUpdate';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-dialog-component',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatRadioModule,
    CommonModule,
  ],
  templateUrl: './user-dialog-component.component.html',
  styleUrl: './user-dialog-component.component.css',
})
export class UserDialogComponentComponent implements OnInit {
  @Output() userUpdated: EventEmitter<User> = new EventEmitter<User>();

  userUpdate: UserUpdate = {
    title: '',
    userFirst: '',
    userLast: '',
    userDob: new Date(),
    userGender: 0,
    remark: '',
  };
  image1: { file: File; photoId?: number } | null = null;
  image2: { file: File; photoId?: number } | null = null;
  imagePreview1: string | null = null;
  imagePreview2: string | null = null;
  userId: number;

  constructor(
    private dialogRef: MatDialogRef<UserDialogComponentComponent>,
    private authService: AuthServiceService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log('UserDialogComponentComponent', data);
    this.userId = this.data.user.userId;
  }

  ngOnInit(): void {
    if (this.data) {
      this.userUpdate = { ...this.data.user };
    }
    this.loadImages(this.userId);

    this.userUpdate.title =
      this.userUpdate.title.toLowerCase() === 'mr'
        ? 'Mr'
        : this.userUpdate.title.toLowerCase() === 'mrs'
        ? 'Mrs'
        : this.userUpdate.title.toLowerCase() === 'miss'
        ? 'Miss'
        : '';
  }

  loadImages(userId: number) {
    this.authService.getUserImages(userId).subscribe(
      (response: any) => {
        console.log('Images loaded', response);

        const userimage1 = response.find((img: any) => img.imageNumber === 1);
        const userimage2 = response.find((img: any) => img.imageNumber === 2);

        if (userimage1) {
          this.image1 = userimage1;
          this.imagePreview1 = `http://localhost:7200${userimage1.imagePath}`;
        }
        if (userimage2) {
          this.image2 = userimage2;
          this.imagePreview2 = `http://localhost:7200${userimage2.imagePath}`;
        }
      },
      (error) => {
        console.log('Error fetching images', error);
      }
    );
  }

  onSubmit() {
    console.log(this.userUpdate);
    if (this.userUpdate.userId !== undefined) {
      this.authService
        .updateUser(this.userUpdate.userId, this.userUpdate)
        .subscribe((data: any) => {
          const userId = data.userId;

          if (userId) {
            let upload1 = this.uploadImage(userId, 1, this.image1?.file ?? null);
            let upload2 = this.uploadImage(userId, 2, this.image2?.file ?? null);

            Promise.all([upload1, upload2]).then(() => {
              this.snackBar.open('User updated and images uploaded successfully!' , 'close', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'bottom',
              });
            });
            this.onClose('close');
          }
        });
    }
  }

  onFileChange(event: any, imageNumber: number) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (imageNumber === 1) {
          this.image1 = { file };
          this.imagePreview1 = reader.result as string;
        } else if (imageNumber === 2) {
          this.image2 = { file };
          this.imagePreview2 = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file.');
    }
  }

  removeImage(imageNumber: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Delete Image',
        message: 'Do you really want to remove this image?',
        buttonColor: 'warn',
        buttonText: 'Delete',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        let photoIdToDelete: number | undefined;

        if (imageNumber === 1 && this.imagePreview1) {
          photoIdToDelete = this.image1?.photoId;
          this.image1 = null;
          this.imagePreview1 = null;
        } else if (imageNumber === 2 && this.imagePreview2) {
          photoIdToDelete = this.image2?.photoId;
          this.image2 = null;
          this.imagePreview2 = null;
        }

        if (photoIdToDelete) {
          this.authService.deleteUserImage(photoIdToDelete).subscribe(
            (response) => {
              console.log(
                `Image with photoId ${photoIdToDelete} deleted successfully.`
              );
            },
            (error) => {
              console.log(
                `Error deleting image with photoId ${photoIdToDelete}:`,
                error
              );
            }
          );
        }
      }
    });
  }

  uploadImage(userId: number, imageNumber: number, file: File | null) : Promise<void>{

    return new Promise((resolve, reject) => {
      if (!file) {
        resolve();
        return;
      }

    if (file) {
      const formData = new FormData();
      formData.append('file', file, file.name);
      this.authService.imageUpload(userId, imageNumber, formData).subscribe(
        (response) => {
          resolve();
        },
        (error) => {
          console.log(error);
        }
      );
    }
  });
  }

  onClose(result: string) {
    this.dialogRef.close(result);
  }
}
