import React, { useCallback, useState } from "react";
import theme from "../theme";
import { css } from "@compiled/react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const buttonStyles = css({
  color: theme.softerMain,
  padding: 6,
  fontWeight: 400,
  fontSize: "12px",
  background: "transparent",
  border: "none",
  "&:hover": {
    background: theme.white10,
  },
});

const inputStyles = css({
  background: "transparent",
  border: "1px solid " + theme.softerMain,
  outline: "none",
  color: theme.softerMain,
  "&::placeholder": { color: theme.white20 },
});

const searchBarWrapperStyles = css({
  display: "flex",
  gap: "4px",
  margin: 4,
});

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      onSearch(event.target.value);
    },
    [onSearch],
  );

  const handleSearch = useCallback(() => {
    onSearch(query);
  }, [query, onSearch]);

  return (
    <div css={searchBarWrapperStyles}>
      <input
        type="text"
        placeholder={"Search here"}
        value={query}
        onChange={handleInputChange}
        css={inputStyles}
      />
      <button css={buttonStyles} onClick={handleSearch}>
        SEARCH
      </button>
    </div>
  );
};

export default SearchBar;
