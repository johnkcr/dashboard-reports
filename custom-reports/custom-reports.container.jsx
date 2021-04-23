import React from 'react';
import { ActionsProvider } from './providers/actions.provider';
import { QueryProvider } from './providers/query.provider';
import { CustomReportsScreen } from './custom-reports.screen';

export const CustomReportsContainer = () => {
  return (
    <QueryProvider>
      <ActionsProvider>
        <CustomReportsScreen />
      </ActionsProvider>
    </QueryProvider>
  );
};
