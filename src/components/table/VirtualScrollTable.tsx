import { useState } from "react";
import { Skeleton } from "primereact/skeleton";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Footer } from "./Footer";

export const VirtualScrollTable = ({
  dataService,
  field,
  total,
  id,
  columns,
}) => {
  const v = new Array(total).fill(null);
  const [values, setValues] = useState(v);
  const [loading, setLoading] = useState(false);
  const delay = 300;
  const scrollHeight = 300;
  const itemSize = 50;
  const onLazyLoad = (event) => {
    !loading && setLoading(true);
    const { first, last } = event;
    const newValues = values.slice();
    dataService.getField(field, id, first, last).then(({ results }) => {
      newValues.splice(first, results.length, ...results);
      setValues(newValues);
      setLoading(false);
    });
  };

  const loadingTemplate = (options) => (
    <div
      className="flex align-items-center"
      style={{ height: "17px", flexGrow: "1", overflow: "hidden" }}
    >
      <Skeleton
        width={
          options.cellEven ? (options.field === "year" ? "30%" : "40%") : "60%"
        }
        height="1rem"
      />
    </div>
  );

  const columnsTemplates = columns.map(
    ({ field, header, body, dataType, style }) => (
      <Column
        key={field}
        field={field}
        header={header}
        body={body}
        dataType={dataType}
        style={style}
      />
    )
  );

  return (
    <DataTable
      value={values}
      scrollable
      scrollHeight={scrollHeight + "px"}
      virtualScrollerOptions={{
        scrollHeight: scrollHeight + "px",
        lazy: true,
        onLazyLoad,
        itemSize,
        delay,
        showLoader: true,
        loading,
        loadingTemplate,
      }}
    >
      {columnsTemplates}
    </DataTable>
  );
};
