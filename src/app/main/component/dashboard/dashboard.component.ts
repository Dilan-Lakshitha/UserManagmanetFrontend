import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../shared/models/user';
import { AuthServiceService } from '../../auth/auth-service.service';
import { ManagerServiceService } from '../../services/manager-service.service';
import { UserDialogComponentComponent } from '../../shared/component/user-dialog-component/user-dialog-component.component';
import { UserGender } from '../../shared/enums/userGender';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from '../../shared/component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  displayedColumns: string[] = [
    'userId',
    'userFirst',
    'userLast',
    'userDob',
    'userGender',
    'title',
    'action',
  ];
  dataSource = new MatTableDataSource<User>();
  filteredDataSource = this.dataSource;

  searchFirstName = '';
  searchLastName = '';
  dobFrom: string = '';
  dobTo: string = '';
  genderFilter: string = '';

  users: User[] = [];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthServiceService,
    private managerService: ManagerServiceService
  ) {
    this.dataSource = new MatTableDataSource(this.users);
  }

  ngOnInit() {
    this.getAllUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(): void {
    let filteredData = this.users;

    if (this.searchFirstName) {
      filteredData = filteredData.filter((item) =>
        item.userFirst
          .toLowerCase()
          .includes(this.searchFirstName.toLowerCase())
      );
    }

    if (this.searchLastName) {
      filteredData = filteredData.filter((item) =>
        item.userLast.toLowerCase().includes(this.searchLastName.toLowerCase())
      );
    }

    if (this.dobFrom) {
      filteredData = filteredData.filter(
        (item) => new Date(item.userDob) >= new Date(this.dobFrom)
      );
    }

    if (this.dobTo) {
      filteredData = filteredData.filter(
        (item) => new Date(item.userDob) <= new Date(this.dobTo)
      );
    }

    this.dataSource.data = filteredData;
    this.filteredDataSource.paginator = this.paginator;
  }

  getAllUsers() {
    this.managerService.getUsers().subscribe((data) => {
      console.log(data);
      this.dataSource.data = data;
      this.users = data;
      this.dataSource.data = this.users;
      this.dataSource.paginator = this.paginator;
    });
  }

  openDialog(user?: User) {
    const uploadDialog = this.dialog.open(UserDialogComponentComponent, {
      width: '900px',
      data: {
        user: user,
        title: user ? 'Edit User' : 'Create User',
      },
    });
    uploadDialog.componentInstance.userUpdated.subscribe((createUser: User) => {
      this.getAllUsers();
    });
  }

  editUser(user: User) {
    this.openDialog(user);
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Deletion',
        message: `Are you sure you want to delete ${user.userFirst}?`,
        buttonText: 'Delete',
        buttonColor: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.managerService.deleteUser(user.userId).subscribe(
          () => {
            this.snackBar.open('User deleted successfully', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['bg-green', 'text-white'],
            });
            this.getAllUsers();
          },
          (error) => {
            this.snackBar.open('Error deleting User', 'Close', {
              duration: 3000,
              panelClass: ['bg-red'],
            });
          }
        );
      }
    });
  }
}
