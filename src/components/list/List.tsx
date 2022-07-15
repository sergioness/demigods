import { useState, useEffect } from "react";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { DataService } from "../../service/DataService";
import { useNavigate } from "react-router-dom";
import "./List.css";
import { Footer } from "../table/Footer";

const serialize = (key, value) =>
  sessionStorage.setItem(key, JSON.stringify(value));
const deserialize = (key, defaultValue) =>
  JSON.parse(sessionStorage.getItem(key)) ?? defaultValue;

export const List = () => {
  const [records, setRecords]: [any[], Function] = useState(
    deserialize("records", [])
  );
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filters, setFilters] = useState(
    deserialize("filters", {
      global: { value: "", matchMode: FilterMatchMode.STARTS_WITH },
    })
  );
  const globalFilterDelay = 1000;
  const [searchInput, setSearchInput] = useState(
    deserialize("searchInput", "")
  );
  const [loading, setLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [lazyParams, setLazyParams] = useState(
    deserialize("lazyParams", {
      first: 0,
      rows: 10,
      sortField: "name",
      sortOrder: 1,
    })
  );

  const dataService = new DataService();

  useEffect(() => {
    const timeout = setTimeout(
      () => onGlobalFilterChange(searchInput),
      globalFilterDelay
    );
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    !loading && setLoading(true);
    const { first, rows, sortField, sortOrder } = lazyParams;
    dataService
      .get(first, rows, filters.global.value, sortField, sortOrder)
      .then(({ total, results }) => {
        setTotalRecords(total);
        setRecords(results);
        setLoading(false);
        serialize("filters", filters);
        serialize("lazyParams", lazyParams);
      });
  }, [filters, lazyParams]);

  useEffect(() => {
    serialize("records", records);
  }, [records]);

  const onGlobalFilterChange = (value) => {
    const _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    serialize("searchInput", value);
  };

  const Header = () => (
    <div className="flex flex-wrap sm:justify-content-between justify-content-center align-items-center">
      <h1 className="m-0 uppercase text-7xl marvel greyout">Demigods</h1>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Your demigod"
        />
      </span>
    </div>
  );

  const nameTemplate = ({ name, thumbnail }) => {
    const src = thumbnail.path + "/landscape_incredible." + thumbnail.extension;
    // const src = detail;
    return (
      <p
        style={{
          backgroundImage: "url(" + src + ")",
        }}
        className="marvel greyout marvel-bg m-0 w-full h-full text-900 text-8xl text-center uppercase vertical-align-middle white-space-normal transition-all transition-duration-500"
      >
        {name}
      </p>
    );
  };

  let navigate = useNavigate();

  return (
    <DataTable
      value={records}
      lazy
      totalRecords={totalRecords}
      paginator
      className="w-full h-full"
      header={Header}
      footer={Footer}
      first={lazyParams.first}
      rows={lazyParams.rows}
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
      rowsPerPageOptions={[5, 10, 20]}
      dataKey="id"
      rowHover
      selectionMode="single"
      selection={selectedRecord}
      onSelectionChange={(e) => {
        navigate("/demigods/" + e.value.id, { state: e.value });
      }}
      filters={filters}
      filterDisplay="menu"
      loading={loading}
      scrollable
      scrollHeight="flex"
      onSort={(e) => setLazyParams(e as any)}
      sortField={lazyParams.sortField}
      sortOrder={lazyParams.sortOrder as any}
      onPage={(e) => setLazyParams(e as any)}
      globalFilterFields={["name"]}
    >
      <Column
        field="name"
        header="Name"
        dataType="text"
        sortable
        body={nameTemplate}
      />
    </DataTable>
  );
};
