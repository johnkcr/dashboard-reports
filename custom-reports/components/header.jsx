import React from 'react';
import { Header as HeaderBase, Button } from 'js/components';
import t from '../i18n/en.json';
import { useMediaQuery } from 'js/hooks/use-media-query.hook';
import { useActions } from '../providers/actions.provider';

export const Header = ({}) => {
  const minimizeButton = useMediaQuery('only screen and (max-width: 500px)');
  const { presentCreateCustomReportDrawer } = useActions();
  return (
    <HeaderBase title={t.title}>
      {minimizeButton ? (
        <Button
          onClick={presentCreateCustomReportDrawer}
          content={<Button.Glyph name="plus" />}
        />
      ) : (
        <Button onClick={presentCreateCustomReportDrawer} glyph="plus">
          {t.create}
        </Button>
      )}
    </HeaderBase>
  );
};
