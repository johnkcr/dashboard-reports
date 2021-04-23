import { useUpdateCustomReportMutation } from 'js/api/mutation/update-custom-report/use-update-custom-report.mutation';
import { Form, useSwiperDrawerRequestClose } from 'js/components';
import React, { useCallback } from 'react';
import * as yup from 'yup';
import t from '../i18n/en.json';
import { useQueryResult } from './query.provider';

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

/** @type {React.FunctionComponent<{ id: string }>} */
export const FormProvider = ({ children, id }) => {
  const { data } = useQueryResult();
  const { mutateAsync } = useUpdateCustomReportMutation();
  const swiperDrawerRequestClose = useSwiperDrawerRequestClose();

  const submit = useCallback(
    /** @param {any} _values */
    async _values => {
      /** @type {Values} */
      const values = _values;
      await mutateAsync({
        id: id,
        data: {
          name: values.customReportName
        }
      });
      swiperDrawerRequestClose();
    },
    [id, swiperDrawerRequestClose, mutateAsync]
  );

  return ((
    <Form
      validationSchema={validationSchema}
      onSubmit={submit}
      validateOnBlur={false}
      initialValues={{ customReportName: data ? data.name : '' }}
      subscription={{ submitting: true }}
    >
      {children}
    </Form>
  ));
};
