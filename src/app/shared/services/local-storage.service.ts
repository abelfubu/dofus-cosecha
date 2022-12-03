import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  set<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify({ value }));
  }

  get<T>(key: string): T {
    const found = localStorage.getItem(key);
    return found ? JSON.parse(found).value : null;
  }

  update<T>(key: string, id: number, value: T): T {
    const found = this.get<Record<string, T>>(key) ?? {};
    found[id] = { ...found[id], ...value };
    this.set(key, found);
    return found[id];
  }
}
