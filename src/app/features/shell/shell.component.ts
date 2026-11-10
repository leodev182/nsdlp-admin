import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PbService } from '../../core/services/pb.service';
import { SectionsService, Section } from '../../core/services/sections.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent implements OnInit {
  sections = signal<Section[]>([]);
  loading = signal(true);
  sidebarOpen = signal(false);

  readonly navLinks = [
    { label: 'Administradores', icon: '👤', route: '/admin/administradores' },
  ];

  constructor(
    public pb: PbService,
    private sectionsService: SectionsService,
    private router: Router,
  ) {}

  async ngOnInit() {
    try {
      this.sections.set(await this.sectionsService.getAll());
    } finally {
      this.loading.set(false);
    }
  }

  async toggleSection(section: Section) {
    const updated = await this.sectionsService.toggle(section.id, !section.enabled);
    this.sections.update(list =>
      list.map(s => (s.id === section.id ? { ...s, enabled: updated.enabled } : s))
    );
  }

  logout() {
    this.pb.logout();
    this.router.navigate(['/login']);
  }

  navigateToSection(slug: string) {
    this.router.navigate(['/admin/sections', slug]);
    this.sidebarOpen.set(false);
  }
}
