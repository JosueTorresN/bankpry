import { useTranslations } from 'next-intl';
import InputField from '@/components/forms/inputs/inputField'; 
import styles from './MovementFilters.module.css';

type FilterValues = { searchText: string; filterType: string; };
type Props = { onFilterChange: (filters: FilterValues) => void; };

export default function MovementFilters({ onFilterChange }: Props) {
  // Manejo local de los filtros
  const t = useTranslations('CardDetails');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value } as any);
  };
  
  return (
    <section className={styles.filters_container} aria-labelledby="filters-heading">
      <h2 id="filters-heading" className={styles.filters_title}>{t('filters_title')}</h2>
      <div className={styles.filters_controls}>
        <input
          id="searchText"
          name="searchText"
          className={styles.search_input}
          type="search"
          placeholder={t('search_placeholder')}
          onChange={handleChange}
          aria-label={t('card_search_aria_label')}
        />
        <select
          id="filterType"
          name="filterType"
          className={styles.type_select}
          onChange={handleChange}
          aria-label={t('filter_type_aria_label')}
        >
          <option value="TODOS">{t('filter_all')}</option>
          <option value="COMPRA">{t('filter_option_purchase')}</option>
          <option value="PAGO">{t('filter_option_payment')}</option>
        </select>
      </div>
    </section>
  );
}