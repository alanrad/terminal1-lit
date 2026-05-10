import { signal } from '@state/signal';
import type { TransformedProperty } from '@services/property.service';

const createSearchPropertyState = () => {
  const query = signal('');
  const properties = signal<TransformedProperty[] | null>(null);
  const results = signal<TransformedProperty[]>([]);
  const loading = signal(false);
  const popupVisible = signal(false);

  return {
    query,
    properties,
    results,
    loading,
    popupVisible,
    setQuery: (value: string) => {
      query.value = value;
    },
    setProperties: (data: TransformedProperty[]) => {
      properties.value = data;
    },
    setResults: (data: TransformedProperty[]) => {
      results.value = data;
      popupVisible.value = data.length > 0;
    },
    clearResults: () => {
      results.value = [];
      popupVisible.value = false;
    },
    showPopup: () => {
      popupVisible.value = true;
    },
    hidePopup: () => {
      popupVisible.value = false;
    },
    setLoading: (value: boolean) => {
      loading.value = value;
    },
  };
};

export type SearchPropertyState = ReturnType<typeof createSearchPropertyState>;

export default createSearchPropertyState;
