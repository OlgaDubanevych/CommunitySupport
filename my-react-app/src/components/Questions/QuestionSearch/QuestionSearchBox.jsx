import { useState } from 'react';


export default function SearchBox({ callBack }) {
  const [searchText, setSearchText] = useState('');

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    callBack(e.target.value);
  }

  return (
    <section >
      <input value={searchText} onChange={handleSearch} />
    </section>
  );
}

