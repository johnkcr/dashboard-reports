import React from 'react';
import { FormProvider } from './providers/form.provider';
import { EditCustomReportScreen } from './edit-custom-report.screen';
import { QueryProvider } from './providers/query.provider';

/** @type {React.FunctionComponent<{ id: string }>} */
export const EditCustomReportContainer = ({ id }) => {
  return ((
    <QueryProvider id={id}>
      <FormProvider id={id}>
        <EditCustomReportScreen />
      </FormProvider>
    </QueryProvider>
  ));
};
