import { useCreateCustomReportMutation } from 'js/api/mutation/create-custom-report/use-create-custom-report.mutation';
import { Form, useSwiperDrawerRequestClose } from 'js/components';
import React, { useCallback } from 'react';
import * as yup from 'yup';
import t from '../i18n/en.json';

/**
 * @typedef {{
 *  customReportName: string
 * }} Values
 */

const validationSchema = yup.object({
  customReportName: yup
    .string()
    .min(1, t.errors.nameLength)
    .max(255, t.errors.nameLength)
    .required(t.errors.nameRequired)
});

export const FormProvider = ({ children }) => {
  const { mutateAsync } = useCreateCustomReportMutation();
  const swiperDrawerRequestClose = useSwiperDrawerRequestClose();

  const submit = useCallback(
    /** @param {any} _values */
    async _values => {
      /** @type {Values} */
      const values = _values;
      await mutateAsync({
        data: {
          name: values.customReportName,
          columns: [],
          rows: [],
          values: []
        }
      });
      swiperDrawerRequestClose();
    },
    [mutateAsync, swiperDrawerRequestClose]
  );

  return (
    <Form
      validationSchema={validationSchema}
      onSubmit={submit}
      validateOnBlur={false}
      initialValues={{ customReportName: '' }}
      subscription={{ submitting: true }}
    >
      {children}
    </Form>
  );
};
