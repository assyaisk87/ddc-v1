import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss'
})
export class AdminLogin {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async login() {
    this.loading = true;
    this.errorMessage = '';

    const { error } = await this.authService.signIn(
      this.email,
      this.password
    );

    this.loading = false;

    if (error) {
      this.errorMessage = 'Неверный email или пароль';
      return;
    }

    const isAdmin = await this.authService.isAdmin();

    if (!isAdmin) {
      this.errorMessage = 'Нет доступа к админ-панели';
      await this.authService.signOut();
      return;
    }

    this.router.navigate(['/admin']);
  }
}