import React, { useState, useRef } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { SelectButton } from 'js/components';
import { makeStyles } from '@material-ui/core';

export const MultiSelect = ({
  label,
  onChange,
  options,
  selectedOptions,
  disabled = false,
  ...props
}) => {
  const anchorRef = useRef(null);

  const [openMenu, setOpenMenu] = useState(false);

  const handleMenuOpen = () => {
    setOpenMenu(true);
  };

  const handleMenuClose = () => {
    setOpenMenu(false);
  };

  const handleOptionToggle = (event, option) => {
    onChange && onChange(event.target.checked, option);
  };

  const isChecked = option => {
    return !!selectedOptions.find(_option => {
      return option.id === _option.id;
    });
  };

  const styles = useStyles();

  return (
    <>
      <SelectButton
        onClick={handleMenuOpen}
        ref={anchorRef}
        disabled={disabled}
        {...props}
      >
        {label}
      </SelectButton>
      <Menu
        anchorEl={anchorRef.current}
        onClose={handleMenuClose}
        open={openMenu}
        transitionDuration={240}
        PaperProps={{ style: { width: 250 } }}
      >
        {options.map(option => (
          <MenuItem key={option.id} className={styles.menuItem}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isChecked(option)}
                  color="primary"
                  onClick={event => handleOptionToggle(event, option)}
                />
              }
              label={option.label}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const useStyles = makeStyles({
  menuItem: {
    padding: '0 16px',

    '& .MuiCheckbox-root': {
      paddingTop: '4px',
      paddingBottom: '4px',
      transform: 'translateY(1px)'
    }
  }
});
