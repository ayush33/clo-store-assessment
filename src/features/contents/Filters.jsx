import React, { useState, useEffect } from "react";
import { Box, TextField, Checkbox, FormControlLabel, Button, Stack } from "@mui/material";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { pricingOptions } from "../../constants/constants";

export default function Filters({ selectedPricing, searchKeyword, onChange, onReset }) {
  const [localPricing, setLocalPricing] = useState(new Set(selectedPricing));
  const [localSearch, setLocalSearch] = useState(searchKeyword);

  useEffect(() => setLocalPricing(new Set(selectedPricing)), [selectedPricing]);
  useEffect(() => setLocalSearch(searchKeyword), [searchKeyword]);

  // Toggle a pricing option in the local state and notify parent via onChange.
  function toggle(option) {
    const next = new Set(localPricing);
    if (next.has(option)) next.delete(option);
    else next.add(option);
    setLocalPricing(next);
    onChange(Array.from(next), localSearch);
  }

  // Update local search text and notify parent with current filters + keyword.
  function onSearchChange(e) {
    setLocalSearch(e.target.value);
    onChange(Array.from(localPricing), e.target.value);
  }

  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search"
        value={localSearch}
        onChange={onSearchChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />
      <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
        {pricingOptions.map((opt) => {
          return (
            <FormControlLabel
              key={opt?.value}
              control={
                <Checkbox
                  checked={localPricing.has(opt?.label)}
                  onChange={() => toggle(opt.label)}
                />
              }
              label={opt.label}
            />
          )
        })}
        <Box flexGrow={1} />

        <Button variant="outlined" onClick={() => { setLocalPricing(new Set()); setLocalSearch(""); onReset(); }}>
          Reset
        </Button>
      </Stack>
    </Box>
  );
}
