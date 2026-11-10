import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PbService } from '../../core/services/pb.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="dashboard">
      <h2 class="dashboard__title">Bienvenido, {{ pb.currentAdmin?.name || pb.currentAdmin?.email }}</h2>
      <p class="dashboard__hint">Selecciona una sección del menú lateral para editar su contenido o visibilidad.</p>
    </div>
  `,
  styles: [`
    .dashboard__title { font-size: 1.5rem; font-weight: 700; color: #1b2e4a; margin-bottom: 0.5rem; }
    .dashboard__hint { font-size: 0.9rem; color: #64748b; }
  `],
})
export class DashboardComponent {
  constructor(public pb: PbService) {}
}
