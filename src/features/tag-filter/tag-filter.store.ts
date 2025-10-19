import { createStore } from "@/src/utils/proxy-sub";

type TagFilterStore = {
  tags: string[];
  selectedTags: string[];
  setTags: (tags: string[]) => void;
}

export const tagFilterStore = createStore<TagFilterStore>({
  tags: [],
  selectedTags: [],
  setTags: (tags: string[]) => {
    tagFilterStore.tags = tags;
  }
}, {
  notifyOnProps: ['tags', 'selectedTags'],
});