import React, { useState, useEffect, useRef } from 'react';
import "@/styles/table.css"
import numberFormatter from '@/utils/numberFormatter';

interface TableProps {
  columns: Array<Object>;
  rows: Array<Object>;
  columnsSubtable?: Array<Object>;
  colapsibleRows?: boolean;
  rowSubtableOptions?: (row: any) => JSX.Element;
  rowOptions?: (row: any) => JSX.Element;
}

function Table({
  columns,
  rows,
  rowOptions,
}: TableProps) {

  const [currentSelected, setCurrentSelected] = useState<string>("");
  const [displayOptions, setDisplayOptions] = useState<string>("");
  const ref = useRef<HTMLDivElement>(null);

  function getValue(value: string, data: any) {
    const result = value.split('.').reduce((o, d) => o[d], data)
    switch (typeof result) {
      case "boolean":
        return result ? "Yes" : "No";
      case "number":
        return numberFormatter(result);
      default:
        return result;
    }
  }

  function handleSetCurrentSelected(id: string) {
    if (currentSelected === id) setCurrentSelected("");
    else setCurrentSelected(id);
  }

  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setDisplayOptions("");
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  useOutsideAlerter(ref);

  return (
    <div className="table-responsive" style={{ paddingBottom: "60px" }}>
      <table className="table">
        <thead>
          <tr>
            {
              columns.map((item: any) => {
                return (
                  <th key={item.name}>{item.name}</th>
                )
              })
            }
            {rowOptions && (<th></th>)}
          </tr>
        </thead>
        <tbody>
          {
            rows.map((row: any) => {
              return (
                <React.Fragment key={`table${row.id}`}>
                  <tr key={row.id}>
                    {
                      columns.map((col: any) => {
                        return (
                          <td
                            role=""
                            onClick={() => handleSetCurrentSelected(row.id)}
                            key={`${col.name}${row.id}`}
                            style={col.customStyle ? col.customStyle(getValue(col.field, row)) : {}}
                          >
                            {getValue(col.field, row)}
                          </td>
                        )
                      })
                    }
                    {
                      rowOptions && (
                        <td onClick={() => setDisplayOptions(row.id)} className='align-items-center'>
                          <div>
                            <i role='button' className="bi bi-three-dots"></i>
                            {
                              row.id === displayOptions && rowOptions && (
                                <div ref={ref}>{rowOptions(row)}</div>
                              )
                            }
                          </div>
                        </td>
                      )
                    }
                  </tr>
                </React.Fragment>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default Table;
