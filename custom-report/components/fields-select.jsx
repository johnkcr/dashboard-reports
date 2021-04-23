import React, { useState, useRef, useCallback } from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from 'js/components';
import { useFields } from '../providers/fields.provider';
import { useActions } from '../providers/actions.provider';
import { useQueryResult } from '../providers/query.provider';

/** @type {React.FunctionComponent<{type: 'columns' | 'rows' | 'values' | 'filters'}>} */
export const FieldsSelect = ({ type }) => {
  const { addField } = useActions();
  const { data } = useQueryResult();
  const anchorRef = useRef(null);

  const [menuVisible, setMenuVisible] = useState(false);

  const presentMenu = () => {
    setMenuVisible(true);
  };

  const dismissMenu = useCallback(() => {
    setMenuVisible(false);
  }, []);

  const selectField = useCallback(
    field => () => {
      addField(type, field);
      dismissMenu();
    },
    [dismissMenu, addField, type]
  );

  let fields = useFields();

  // Filter already added fields
  if (data && data[type]) {
    /** @type {{ customField?: import('js/typings/custom-field').CustomField | null; key?: string | null;}[]} */
    const items = data[type];
    fields = fields.filter(
      field =>
        !items.find(
          i =>
            (i.customField &&
              field.customField &&
              i.customField._id === field.customField._id) ||
            (i.key && field.key && i.key === field.key)
        )
    );
  }

  // Sort Fields
  const sortedFields = [...fields].sort((a, b) =>
    (a.name || (a.customField ? a.customField.display : '')) >
    (b.name || (b.customField ? b.customField.display : ''))
      ? 1
      : (a.name || (a.customField ? a.customField.display : '')) <
        (b.name || (b.customField ? b.customField.display : ''))
      ? -1
      : 0
  );

  const styles = useStyles();

  return ((
    <>
      <Button glyph="plus" marginTop={16} onClick={presentMenu} ref={anchorRef}>
        Add field
      </Button>
      <Menu
        anchorEl={anchorRef.current}
        onClose={dismissMenu}
        open={menuVisible}
        transitionDuration={240}
        PaperProps={{ style: { width: 320 } }}
      >
        {sortedFields.map(field => (
          <MenuItem
            key={field.customField ? field.customField._id : field.key}
            onClick={selectField(field)}
            className={styles.menuItem}
          >
            {field.customField ? field.customField.display : field.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  ));
};

const useStyles = makeStyles({
  menuItem: {
    padding: '0 16px'
  }
});
