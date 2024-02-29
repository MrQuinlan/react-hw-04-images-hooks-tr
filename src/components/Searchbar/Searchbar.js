import css from './Searchbar.module.css';
import { useState } from 'react';

const Searchbar = ({ onSubmit, children }) => {
  const [value, setValue] = useState('');

  const onInputChange = e => {
    const newValue = e.currentTarget.value.trim();

    setValue(newValue);
  };

  const onFormSubmit = e => {
    e.preventDefault();

    onSubmit(value);

    setValue('');
  };

  return (
    <header className={css.searchbar}>
      <form className={css.form} onSubmit={onFormSubmit}>
        <button type="submit" className={css.button}>
          {children}
        </button>

        <input
          className={css.input}
          type="text"
          autoComplete="on"
          autoFocus
          placeholder="Search images and photos"
          value={value}
          onChange={onInputChange}
        />
      </form>
    </header>
  );
};
export default Searchbar;
