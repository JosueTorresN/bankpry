import InputField from '@/components/forms/inputs/inputField'; // Asumiendo la ruta
import styles from './MovementFilters.module.css';

type FilterValues = { searchText: string; filterType: string; };
type Props = { onFilterChange: (filters: FilterValues) => void; };

export default function MovementFilters({ onFilterChange }: Props) {
  // Manejo local de los filtros
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value } as any);
  };
  
  return (
    <section className={styles.filters_container} aria-labelledby="filters-heading">
      <h2 id="filters-heading" className={styles.filters_title}>Filtros</h2>
      <div className={styles.filters_controls}>
        <input
          id="searchText"
          name="searchText"
          className={styles.search_input}
          type="search"
          placeholder="Buscar por descripción..."
          onChange={handleChange}
          aria-label="Buscar movimientos por descripción"
        />
        <select
          id="filterType"
          name="filterType"
          className={styles.type_select}
          onChange={handleChange}
          aria-label="Filtrar movimientos por tipo"
        >
          <option value="TODOS">Todos</option>
          <option value="COMPRA">Compras</option>
          <option value="PAGO">Pagos</option>
        </select>
      </div>
    </section>
  );
}