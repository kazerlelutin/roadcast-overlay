import type { Ctrl } from "@features/routes/routes.type";


export type TagFilterCtrl = Ctrl & {
  subscribe?: () => void
  updateUI: (scope?: 'tags' | 'selectedTags' | 'all') => void;
  selectTag: (event: Event) => void;
  onChipClick: (event: Event) => void;
}