import React from 'react';
import { NavigationBar as NavigationBarBase } from 'js/components';
import { useQueryResult } from '../providers/query.provider';

export const NavigationBar = () => {
  const { data } = useQueryResult();
  return (
    <NavigationBarBase
      title={data ? data.name : ''}
      goBackTo="/#/reports/custom-reports"
    />
  );
};
