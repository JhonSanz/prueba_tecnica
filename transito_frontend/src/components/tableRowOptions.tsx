interface TableRowOptionsProps {
  icon: string;
}

interface TableRowOptionsData {
  data: Array<TableRowOptionsProps>;
  performAction: (action: string, row: any) => void;
  row: any;
}

function TableRowOptions({
  data,
  performAction,
  row,
}: TableRowOptionsData) {
  return (
    <div className="dropdown" style={{ position: "relative" }}>
      <div className="dropdown-menu show popover-custom">
        {
          data.map((item: TableRowOptionsProps) => {
            return (
              <div key={item.icon}>
                <i
                  role='button'
                  className={`bi bi-${item.icon}`}
                  onClick={() => performAction(item.icon, row)}
                ></i>
                <br />
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

const positionsOptions = (row: any, rowOptions: Array<any>, performAction: any) => (
  <TableRowOptions
    data={rowOptions}
    performAction={performAction}
    row={row}
  />
)


export default positionsOptions;