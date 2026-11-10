import { Injectable } from '@angular/core';
import { PbService, AdminRecord } from './pb.service';

@Injectable({ providedIn: 'root' })
export class AdminsService {
  constructor(private pb: PbService) {}

  async getAll(): Promise<AdminRecord[]> {
    return this.pb.pb.collection('admins').getFullList<AdminRecord>({ sort: 'created' });
  }

  async invite(email: string, name: string): Promise<AdminRecord> {
    const tempPassword = crypto.randomUUID().replace(/-/g, '').slice(0, 16) + 'Aa1!';
    const record = await this.pb.pb.collection('admins').create<AdminRecord>({
      email,
      name,
      password: tempPassword,
      passwordConfirm: tempPassword,
      invited_by: this.pb.currentAdmin?.email ?? '',
    });
    await this.pb.pb.collection('admins').requestPasswordReset(email);
    return record;
  }

  async remove(id: string): Promise<void> {
    await this.pb.pb.collection('admins').delete(id);
  }
}
