import { Injectable, signal } from '@angular/core';
import PocketBase, { RecordModel } from 'pocketbase';
import { environment } from '../../../environments/environment';

export interface AdminRecord extends RecordModel {
  email: string;
  name: string;
  invited_by: string;
}

@Injectable({ providedIn: 'root' })
export class PbService {
  readonly pb = new PocketBase(environment.pocketbaseUrl);

  readonly isLoggedIn = signal<boolean>(this.pb.authStore.isValid);

  get currentAdmin(): AdminRecord | null {
    return this.pb.authStore.record as AdminRecord | null;
  }

  constructor() {
    this.pb.authStore.onChange(() => {
      this.isLoggedIn.set(this.pb.authStore.isValid);
    });
  }

  async login(email: string, password: string): Promise<void> {
    await this.pb.collection('admins').authWithPassword(email, password);
  }

  logout(): void {
    this.pb.authStore.clear();
  }

  async refreshAuth(): Promise<boolean> {
    try {
      await this.pb.collection('admins').authRefresh();
      return true;
    } catch {
      this.pb.authStore.clear();
      return false;
    }
  }
}
