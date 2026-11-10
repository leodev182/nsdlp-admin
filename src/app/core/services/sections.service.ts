import { Injectable } from '@angular/core';
import { PbService } from './pb.service';
import { RecordModel } from 'pocketbase';

export interface Section extends RecordModel {
  slug: string;
  label: string;
  enabled: boolean;
  order: number;
  content: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class SectionsService {
  constructor(private pb: PbService) {}

  async getAll(): Promise<Section[]> {
    return this.pb.pb.collection('sections').getFullList<Section>({ sort: 'order' });
  }

  async toggle(id: string, enabled: boolean): Promise<Section> {
    return this.pb.pb.collection('sections').update<Section>(id, { enabled });
  }

  async updateContent(id: string, content: Record<string, unknown>): Promise<Section> {
    return this.pb.pb.collection('sections').update<Section>(id, { content });
  }

  async getOne(slug: string): Promise<Section> {
    return this.pb.pb.collection('sections').getFirstListItem<Section>(`slug = "${slug}"`);
  }
}
