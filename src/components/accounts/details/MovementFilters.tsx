// components/accounts/details/MovementFilters.tsx
import styles from './MovementFilters.module.css';
import { useTranslations } from 'next-intl';
type FilterValues = { searchText: string; filterType: string; };
type Props = {

  onFilterChange: (filters: Partial<FilterValues>) => void;
};

export default function MovementFilters({ onFilterChange }: Props) {
    const t = useTranslations('MovementList');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFilterChange({ [e.target.name]: e.target.value });
  };
  
  return (
    <section className={styles.filters_container} aria-labelledby="filters-heading">
      <h2 id="filters-heading" className={styles.filters_title}>{t('filters_title')}</h2>
      <div className={styles.filters_controls}>
        <input
          name="searchText"
          className={styles.search_input}
          type="search"
          placeholder={t('search_placeholder')}
          onChange={handleChange}
          aria-label={t('search_aria_label')}
        />
        <select
          name="filterType"
          className={styles.type_select}
          onChange={handleChange}
          aria-label={t('filter_type_aria_label')}
        >
          <option value="TODOS">{t('filter_all')}</option>
          <option value="CREDITO">{t('type_credito')}</option>
          <option value="DEBITO">{t('type_debito')}</option>
        </select>
      </div>
    </section>
  );
}