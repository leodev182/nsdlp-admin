import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminsService } from '../../core/services/admins.service';
import { AdminRecord, PbService } from '../../core/services/pb.service';

@Component({
  selector: 'app-administradores',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './administradores.component.html',
  styleUrl: './administradores.component.scss',
})
export class AdministradoresComponent implements OnInit {
  admins = signal<AdminRecord[]>([]);
  loading = signal(true);

  inviteEmail = '';
  inviteName = '';
  inviting = signal(false);
  inviteSuccess = signal('');
  inviteError = signal('');

  constructor(
    private adminsService: AdminsService,
    public pb: PbService,
  ) {}

  async ngOnInit() {
    try {
      this.admins.set(await this.adminsService.getAll());
    } finally {
      this.loading.set(false);
    }
  }

  async invite() {
    if (!this.inviteEmail) return;
    this.inviting.set(true);
    this.inviteError.set('');
    this.inviteSuccess.set('');
    try {
      const record = await this.adminsService.invite(this.inviteEmail, this.inviteName);
      this.admins.update(list => [...list, record]);
      this.inviteSuccess.set(`Invitación enviada a ${this.inviteEmail}. Recibirá un correo para establecer su contraseña.`);
      this.inviteEmail = '';
      this.inviteName = '';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.inviteError.set(msg.includes('already exists') ? 'Ese correo ya está registrado.' : 'Error al invitar. Intenta de nuevo.');
    } finally {
      this.inviting.set(false);
    }
  }

  async remove(admin: AdminRecord) {
    if (!confirm(`¿Eliminar a ${admin.email} como administrador?`)) return;
    try {
      await this.adminsService.remove(admin.id);
      this.admins.update(list => list.filter(a => a.id !== admin.id));
    } catch {
      alert('No se pudo eliminar. Intenta de nuevo.');
    }
  }

  isSelf(admin: AdminRecord): boolean {
    return admin.id === this.pb.currentAdmin?.id;
  }
}
