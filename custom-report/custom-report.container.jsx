import React from 'react';
import { FieldsProvider } from './providers/fields.provider';
import { FiltersProvider } from './providers/filters.provider';
import { CustomReportScreen } from './custom-report.screen';
import { QueryProvider } from './providers/query.provider';
import { GoogleSheetsProvider } from './providers/google-sheets.provider';
import { ActionsProvider } from './providers/actions.provider';
import { DataProvider } from './providers/data.provider';

export const CustomReportContainer = () => {
  return (
    <QueryProvider>
      <FieldsProvider>
        <FiltersProvider>
          <DataProvider>
            <GoogleSheetsProvider>
              <ActionsProvider>
                <CustomReportScreen />
              </ActionsProvider>
            </GoogleSheetsProvider>
          </DataProvider>
        </FiltersProvider>
      </FieldsProvider>
    </QueryProvider>
  );
};
