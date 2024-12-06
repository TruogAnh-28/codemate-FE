// stores/breadcrumbs.ts
import { defineStore } from 'pinia';
import { Breadcrumbs } from '@/types/Breadcrumbs';

export const useBreadcrumbsStore = defineStore('breadcrumbs', {
  state: () => ({
    breadcrumbs: [] as Breadcrumbs[]
  }),
  actions: {
    setBreadcrumbs(breadcrumbs: Breadcrumbs[]) {
      this.breadcrumbs = breadcrumbs;
    },
    addBreadcrumbs(breadcrumb: Breadcrumbs) {
      this.breadcrumbs.push(breadcrumb);
    },
    clearBreadcrumbs() {
      this.breadcrumbs = [];
    }
  }
});
