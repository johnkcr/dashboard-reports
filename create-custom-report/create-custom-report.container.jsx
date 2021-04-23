import React from 'react';
import { FormProvider } from './providers/form.provider';
import { CreateCustomReportScreen } from './create-custom-report.screen';

export const CreateCustomReportContainer = ({}) => {
  return (
    <FormProvider>
      <CreateCustomReportScreen />
    </FormProvider>
  );
};
