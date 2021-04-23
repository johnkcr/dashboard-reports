import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { useFilters } from '../providers/filters.provider';
import {
  useGapi,
  useGoogleAuthConnected,
  useGoogleAuthSignIn
} from 'js/providers/gapi-provider/gapi-provider';
import { useQueryResult } from './query.provider';
import { useParams } from '../hooks/use-params.hook';
import { useUpdateCustomReportMutation } from 'js/api/mutation/update-custom-report/use-update-custom-report.mutation';
import uuidv1 from 'uuid/v1';
import { useDataQueryResult } from './data.provider';

/** @type {React.Context<() => Promise<void>>} */
const GoogleSheetsContext = createContext(async () => {});

/** @type {React.Context<any>} */
const SignInWithGoogleFailedDialogContext = createContext(undefined);

/** @type {React.Context<any>} */
const ShowPopupWarningTooltipContext = createContext(false);

/** @return {() => Promise<void>} */
export function useOpenInGoogleSheets() {
  return useContext(GoogleSheetsContext);
}

/** @return {[boolean, React.Dispatch<React.SetStateAction<boolean>>]} */
export function useSignInWithGoogleDialog() {
  return useContext(SignInWithGoogleFailedDialogContext);
}

/** @return {boolean} */
export function useShowPopupWarningTooltip() {
  return useContext(ShowPopupWarningTooltipContext);
}

/**
 * @param {string[]} headers
 * @param {string | null | undefined} name
 * @return number
 */
function getSourceColumnOffset(headers, name) {
  const index = headers.findIndex(h => h === name);
  if (index !== -1) return index;
  return 0;
}

/** @type {React.FunctionComponent} */
export const GoogleSheetsProvider = ({ children }) => {
  const mounted = useRef(true);
  useEffect(
    () => () => {
      mounted.current = false;
    },
    []
  );
  const { id } = useParams();
  const { data } = useQueryResult();

  const { startDate, endDate } = useFilters();

  const [
    showSignInWithGoogleFailedDialog,
    setShowSignInWithGoogleFailedDialog
  ] = useState(false);

  const [showPopupWarningTooltip, setShowPopupWarningTooltip] = useState(false);

  const connected = useGoogleAuthConnected();
  const signIn = useGoogleAuthSignIn();
  const gapi = useGapi();
  const updateCustomReportMutation = useUpdateCustomReportMutation();
  const { data: rawData, isLoading } = useDataQueryResult();

  const isLoadingRef = useRef(isLoading);
  isLoadingRef.current = isLoading;
  const dataRef = useRef(rawData);
  dataRef.current = rawData;

  const finishLoading = useCallback(async () => {
    /** @param {(value?: any) => void} resolve */
    function checkIsLoading(resolve) {
      if (!isLoadingRef.current) return resolve();
      else setTimeout(() => checkIsLoading(resolve), 100);
    }
    return new Promise(resolve => checkIsLoading(resolve));
  }, []);

  const openInGoogleSheets = useCallback(
    /** @return {Promise<void>} */
    async () => {
      if (!connected) {
        try {
          await signIn();
        } catch (err) {
          setShowSignInWithGoogleFailedDialog(true);
        }
      }

      if (isLoadingRef.current) {
        await finishLoading();
      }

      return new Promise(async resolve => {
        if (data) {
          const sheet = dataRef.current;
          if (!sheet) return resolve();

          // Check if sheet still exists
          let response;
          if (data.googleSpreadsheetId) {
            try {
              response = await gapi.client.sheets.spreadsheets.get({
                spreadsheetId: data.googleSpreadsheetId
              });
            } catch (err) {}
          }

          let spreadsheet;
          let pivotTableSheetId;
          let dataSheetId;
          if (response && response.result) {
            // Spreadsheet exists, remove all sheets and insert a new empty sheet named Data
            const updated = await gapi.client.sheets.spreadsheets.batchUpdate({
              spreadsheetId: data.googleSpreadsheetId,
              includeSpreadsheetInResponse: true,
              requests: [
                {
                  updateSpreadsheetProperties: {
                    properties: {
                      title: data.name
                    },
                    fields: 'title'
                  }
                },
                {
                  addSheet: {
                    properties: {
                      index: 0,
                      // We cannot create a new sheet named Data yet because one exists, we cannot delete the current
                      // one yet because that could delete all sheets and we need to have at least one, so we create
                      // one with a uuid and rename it after removing the old one
                      title: uuidv1()
                    }
                  }
                },
                ...(response.result.sheets
                  ? response.result.sheets.map(
                      /** @param {any} sheet */
                      sheet => ({
                        deleteSheet: { sheetId: sheet.properties.sheetId }
                      })
                    )
                  : []),
                {
                  addSheet: {
                    properties: {
                      index: 0,
                      title: 'Pivot Table'
                    }
                  }
                }
              ]
            });

            pivotTableSheetId =
              updated.result.updatedSpreadsheet.sheets[0].properties.sheetId;
            dataSheetId =
              updated.result.updatedSpreadsheet.sheets[1].properties.sheetId;

            const final = await gapi.client.sheets.spreadsheets.batchUpdate({
              spreadsheetId: data.googleSpreadsheetId,
              includeSpreadsheetInResponse: true,
              requests: [
                {
                  updateSheetProperties: {
                    properties: {
                      sheetId: dataSheetId,
                      title: 'Data'
                    },
                    fields: 'title'
                  }
                }
              ]
            });

            spreadsheet = final.result.updatedSpreadsheet;
          } else {
            // Spreadsheet does not exists, create one with empty Data sheet
            const response = await gapi.client.sheets.spreadsheets.create({
              properties: {
                title: data.name
              },
              sheets: [
                {
                  properties: {
                    title: 'Pivot Table'
                  },
                  data: {}
                },
                {
                  properties: {
                    title: 'Data'
                  },
                  data: {}
                }
              ]
            });
            spreadsheet = response.result;
            pivotTableSheetId = spreadsheet.sheets[0].properties.sheetId;
            dataSheetId = spreadsheet.sheets[1].properties.sheetId;
          }

          // Insert data in Data sheet
          await gapi.client.sheets.spreadsheets.values.append(
            {
              spreadsheetId: spreadsheet.spreadsheetId,
              range: 'Data!A:A',
              valueInputOption: 'USER_ENTERED',
              insertDataOption: 'OVERWRITE'
            },
            {
              range: 'Data!A:A',
              majorDimension: 'ROWS',
              values: [sheet.headers, ...sheet.rows]
            }
          );

          await gapi.client.sheets.spreadsheets.batchUpdate({
            spreadsheetId: spreadsheet.spreadsheetId,
            includeSpreadsheetInResponse: false,
            requests: [
              // Format header row
              {
                repeatCell: {
                  range: {
                    sheetId: dataSheetId,
                    startRowIndex: 0,
                    endRowIndex: 1
                  },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: {
                        red: 0.749,
                        green: 0.753,
                        blue: 0.753
                      },
                      textFormat: {
                        foregroundColor: {
                          red: 0,
                          green: 0,
                          blue: 0
                        },
                        bold: true
                      }
                    }
                  },
                  fields: 'userEnteredFormat(backgroundColor,textFormat)'
                }
              },
              // Make header row sticky
              {
                updateSheetProperties: {
                  properties: {
                    sheetId: dataSheetId,
                    gridProperties: {
                      frozenRowCount: 1
                    }
                  },
                  fields: 'gridProperties.frozenRowCount'
                }
              },
              // Format first column
              {
                repeatCell: {
                  range: {
                    sheetId: dataSheetId,
                    startRowIndex: 1,
                    endRowIndex: sheet.rows.length + 1,
                    startColumnIndex: 0,
                    endColumnIndex: 1
                  },
                  cell: {
                    userEnteredFormat: {
                      backgroundColor: {
                        red: 0.859,
                        green: 0.863,
                        blue: 0.863
                      },
                      textFormat: {
                        foregroundColor: {
                          red: 0,
                          green: 0,
                          blue: 0
                        },
                        bold: true
                      }
                    }
                  },
                  fields: 'userEnteredFormat(backgroundColor,textFormat)'
                }
              },
              // Resize columns to fit content
              {
                autoResizeDimensions: {
                  dimensions: {
                    sheetId: dataSheetId,
                    dimension: 'COLUMNS',
                    startIndex: 0,
                    endIndex:
                      spreadsheet.sheets[0].properties.gridProperties
                        .columnCount
                  }
                }
              },
              // Create Pivot Table
              {
                updateCells: {
                  rows: [
                    {
                      values: [
                        {
                          pivotTable: {
                            rows: data.rows.map(row => ({
                              showTotals: true,
                              sourceColumnOffset: getSourceColumnOffset(
                                sheet.headers,
                                row.customField
                                  ? row.customField.display
                                  : row.name
                              ),
                              sortOrder: row.sortOrder
                            })),
                            columns: data.columns.map(column => ({
                              showTotals: true,
                              sourceColumnOffset: getSourceColumnOffset(
                                sheet.headers,
                                column.customField
                                  ? column.customField.display
                                  : column.name
                              ),
                              sortOrder: column.sortOrder
                            })),
                            values: data.values.map(value => ({
                              sourceColumnOffset: getSourceColumnOffset(
                                sheet.headers,
                                value.customField
                                  ? value.customField.display
                                  : value.name
                              ),
                              summarizeFunction: value.summarizeFunction
                            })),
                            filterSpecs: data.filters.map(value => {
                              const filterCriteria = {
                                visibleValues: value.visibleValues || [],
                                visibleByDefault: true
                              };
                              if (value.conditionType) {
                                filterCriteria.condition = {
                                  type: value.conditionType,
                                  values: value.conditionValues.map(value => ({
                                    userEnteredValue: value.userEnteredValue
                                  }))
                                };
                              }
                              if (
                                value.visibleValues &&
                                value.visibleValues.length
                              ) {
                                filterCriteria.visibleByDefault = false;
                              }
                              return {
                                columnOffsetIndex: getSourceColumnOffset(
                                  sheet.headers,
                                  value.customField
                                    ? value.customField.display
                                    : value.name
                                ),
                                filterCriteria
                              };
                            }),
                            source: {
                              sheetId: dataSheetId,
                              startRowIndex: 0,
                              startColumnIndex: 0
                            }
                          }
                        }
                      ]
                    }
                  ],
                  start: {
                    sheetId: pivotTableSheetId,
                    rowIndex: 0,
                    columnIndex: 0
                  },
                  fields: 'pivotTable'
                }
              }
            ]
          });

          await updateCustomReportMutation.mutateAsync({
            id,
            data: {
              googleSpreadsheetId: spreadsheet.spreadsheetId
            }
          });

          // eslint-disable-next-line security/detect-non-literal-fs-filename
          window.open(spreadsheet.spreadsheetUrl);
          setShowPopupWarningTooltip(true);
          // Show tooltip for 5 seconds
          setTimeout(() => {
            if (mounted.current) {
              setShowPopupWarningTooltip(false);
            }
          }, 5000);
          resolve();
        }
      });
    },
    [
      finishLoading,
      connected,
      signIn,
      gapi,
      updateCustomReportMutation,
      id,
      data
    ]
  );

  return ((
    <SignInWithGoogleFailedDialogContext.Provider
      value={[
        showSignInWithGoogleFailedDialog,
        setShowSignInWithGoogleFailedDialog
      ]}
    >
      <GoogleSheetsContext.Provider value={openInGoogleSheets}>
        <ShowPopupWarningTooltipContext.Provider
          value={showPopupWarningTooltip}
        >
          {children}
        </ShowPopupWarningTooltipContext.Provider>
      </GoogleSheetsContext.Provider>
    </SignInWithGoogleFailedDialogContext.Provider>
  ));
};
