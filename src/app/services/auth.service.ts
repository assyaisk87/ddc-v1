import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async signIn(email: string, password: string) {
    return this.supabaseService.client.auth.signInWithPassword({
      email,
      password
    });
  }

  async signOut() {
    return this.supabaseService.client.auth.signOut();
  }

  async getUser() {
    const { data } = await this.supabaseService.client.auth.getUser();
    return data.user;
  }

  async isAdmin(): Promise<boolean> {
    const user = await this.getUser();

    if (!user) {
      return false;
    }

    const { data, error } = await this.supabaseService.client
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error(error);
      return false;
    }

    return data?.role === 'admin';
  }
}