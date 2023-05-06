import PropTypes from 'prop-types';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FiSearch } from 'react-icons/fi';
import {
  SearchbarStyled,
  SearchForm,
  SearchFormButton,
  SearchFormInput,
} from '../styles.styled';

const Searchbar = ({ onSubmit }) => {
  const [query, setQuery] = useState('');

  const handleInput = e => setQuery(e.target.value);

  const handleOnSubmit = e => {
    e.preventDefault();
    if (query.trim() === '') {
      toast.error('Please enter a query');
      return;
    }
    onSubmit(query);
    setQuery('');
    e.target.reset();
  };

  return (
    <SearchbarStyled>
      <SearchForm onSubmit={handleOnSubmit}>
        <SearchFormButton type="submit">
          <FiSearch size="16px" />
        </SearchFormButton>
        <SearchFormInput
          type="text"
          name="query"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={handleInput}
        />
      </SearchForm>
    </SearchbarStyled>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Searchbar;
