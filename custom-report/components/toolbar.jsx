import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DateRangeSelect } from './date-range-select';
import { ActivityIndicator } from 'js/components/activity-indicator';
import { Button } from 'js/components/button';
import { makeStyles } from '@material-ui/core/styles';
import { useFilters, useSetFilters } from '../providers/filters.provider';
import URLSearchParams from '@ungap/url-search-params';
import { useQueryResult } from '../providers/query.provider';
import { useParams } from '../hooks/use-params.hook';
import {
  useOpenInGoogleSheets,
  useShowPopupWarningTooltip
} from '../providers/google-sheets.provider';
import { useGapiStatus } from 'js/providers/gapi-provider/gapi-provider';
import { SignInWithGoogleFailedDialog } from './sign-in-with-google-failed-dialog';
import RichTooltip from 'js/components/rich-tooltip/rich-tooltip';
import Typography from '@material-ui/core/Typography';

/** @type {React.FunctionComponent} */
export const Toolbar = ({}) => {
  const mounted = useRef(true);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    []
  );

  const { id } = useParams();
  const { data } = useQueryResult();

  const gapiStatus = useGapiStatus();

  const { startDate, endDate, serviceTypes } = useFilters();
  const setFilters = useSetFilters();

  const deleteChip = useCallback(
    id => () => {
      setFilters(filters => ({
        ...filters,
        serviceTypes: filters.serviceTypes
          ? filters.serviceTypes.filter(s => s._id !== id)
          : undefined
      }));
    },
    [setFilters]
  );

  const clearAllFilters = useCallback(() => {
    setFilters(filters => ({
      ...filters,
      serviceTypes: undefined
    }));
  }, [setFilters]);

  const download = useCallback(() => {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
    if (serviceTypes) {
      params.set('serviceTypes', serviceTypes.map(s => s._id).join(','));
    }
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    window.open(`/custom-reports/${id}/download?${params.toString()}`);
  }, [startDate, endDate, serviceTypes, id]);

  const [openingInGoogleSheets, setOpeningInGoogleSheets] = useState(false);
  const openInGoogleSheets = useOpenInGoogleSheets();
  const onOpenInGoogleSheetsClick = useCallback(async () => {
    setOpeningInGoogleSheets(true);
    await openInGoogleSheets();
    if (mounted.current) {
      setOpeningInGoogleSheets(false);
    }
  }, [openInGoogleSheets]);

  const showPopupWarningTooltip = useShowPopupWarningTooltip();

  const styles = useStyles();

  return ((
    <>
      <div className={styles.row}>
        <div className={styles.filtersGroup}>
          <DateRangeSelect />
        </div>

        <div className={styles.actionsGroup}>
          <Button
            glyph="download"
            marginRight={16}
            marginTop={16}
            onClick={download}
          >
            Download Data
          </Button>
          <div className={styles.googleSheetsButton}>
            <RichTooltip
              content={
                <Typography>
                  Please make sure you have enabled pop-up windows.
                </Typography>
              }
              open={showPopupWarningTooltip}
              placement="bottom"
            >
              <Button
                glyph="file-alt"
                scheme="green"
                marginTop={16}
                onClick={onOpenInGoogleSheetsClick}
                disabled={
                  openingInGoogleSheets || !data || gapiStatus !== 'ready'
                }
                style={openingInGoogleSheets ? { opacity: 0.4 } : undefined}
              >
                Open in Google Sheets
              </Button>
            </RichTooltip>

            {openingInGoogleSheets ? (
              <ActivityIndicator
                size={16}
                className={styles.googleSheetsActivityIndicator}
              />
            ) : null}
          </div>
          <SignInWithGoogleFailedDialog />
        </div>
      </div>
    </>
  ));
};

const useStyles = makeStyles(
  /** @param {any} theme */
  theme => ({
    row: {
      padding: '0px 38px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
      [theme.breakpoints.down('md')]: {
        padding: '0px 20px'
      },
      [theme.breakpoints.down(760)]: {
        flexDirection: 'column',
        alignItems: 'flex-start'
      }
    },

    filtersGroup: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap'
    },

    actionsGroup: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap'
    },

    googleSheetsButton: {
      position: 'relative'
    },

    googleSheetsActivityIndicator: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginLeft: '-8px',
      marginTop: '1px'
    },

    chips: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      margin: '0px 38px 16px 38px',
      [theme.breakpoints.down('md')]: {
        margin: '0px 20px 16px 20px'
      }
    },

    chip: {
      marginTop: '6px',
      marginRight: '6px'
    }
  })
);
