import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SectionsService, Section } from '../../core/services/sections.service';

@Component({
  selector: 'app-section-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './section-editor.component.html',
  styleUrl: './section-editor.component.scss',
})
export class SectionEditorComponent implements OnInit {
  section = signal<Section | null>(null);
  contentJson = signal('');
  saving = signal(false);
  saved = signal(false);
  error = signal('');
  jsonError = signal('');

  constructor(
    private route: ActivatedRoute,
    private sectionsService: SectionsService,
  ) {}

  async ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    const s = await this.sectionsService.getOne(slug);
    this.section.set(s);
    this.contentJson.set(JSON.stringify(s.content, null, 2));
  }

  validateJson(value: string) {
    try {
      JSON.parse(value);
      this.jsonError.set('');
    } catch {
      this.jsonError.set('JSON inválido');
    }
  }

  async save() {
    if (!this.section() || this.jsonError()) return;
    this.saving.set(true);
    this.error.set('');
    try {
      const content = JSON.parse(this.contentJson());
      const updated = await this.sectionsService.updateContent(this.section()!.id, content);
      this.section.set(updated);
      this.saved.set(true);
      setTimeout(() => this.saved.set(false), 2500);
    } catch {
      this.error.set('Error al guardar. Intenta de nuevo.');
    } finally {
      this.saving.set(false);
    }
  }
}
