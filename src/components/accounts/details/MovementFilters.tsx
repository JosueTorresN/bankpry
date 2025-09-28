// components/accounts/details/MovementFilters.tsx
import styles from './MovementFilters.module.css';

type FilterValues = { searchText: string; filterType: string; };
type Props = {
  // Callback para notificar al padre de los cambios
  onFilterChange: (filters: Partial<FilterValues>) => void;
};

export default function MovementFilters({ onFilterChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onFilterChange({ [e.target.name]: e.target.value });
  };
  
  return (
    <section className={styles.filters_container} aria-labelledby="filters-heading">
      <h2 id="filters-heading" className={styles.filters_title}>Filtros</h2>
      <div className={styles.filters_controls}>
        <input
          name="searchText"
          className={styles.search_input}
          type="search"
          placeholder="Buscar por descripción..."
          onChange={handleChange}
          aria-label="Buscar movimientos"
        />
        <select
          name="filterType"
          className={styles.type_select}
          onChange={handleChange}
          aria-label="Filtrar por tipo de movimiento"
        >
          <option value="TODOS">Todos los movimientos</option>
          <option value="CREDITO">Créditos</option>
          <option value="DEBITO">Débitos</option>
        </select>
      </div>
    </section>
  );
}