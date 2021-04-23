import React from 'react';
import { EmptyState as EmptyStateBase, Button } from 'js/components';
import t from '../i18n/en.json';
import { useActions } from '../providers/actions.provider';

export const EmptyState = ({}) => {
  const { presentCreateCustomReportDrawer } = useActions();
  return (
    <EmptyStateBase title={t.emptyState.title} body={t.emptyState.body}>
      <Button
        marginTop={32}
        glyph="plus"
        onClick={presentCreateCustomReportDrawer}
      >
        {t.create}
      </Button>
    </EmptyStateBase>
  );
};
