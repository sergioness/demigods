import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { TabView, TabPanel } from "primereact/tabview";

import "./Profile.css";
import { VirtualScrollTable } from "../table/VirtualScrollTable";
import { DataService } from "../../service/DataService";
import { Footer } from "../table/Footer";

export const Profile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state }: any = useLocation();
  const { description, name, thumbnail } = state;
  const [activeIndex, setActiveIndex] = useState(0);
  const dataService = new DataService();

  const getThumbnailPath = ({ path, extension }) => `${path}.${extension}`;
  const img = getThumbnailPath(thumbnail);

  const nameBodyTemplate = (data) => {
    const { title, urls } = data ?? {};
    const url = urls?.find((url) => url.type.includes("detail", "wiki"));
    return url ? (
      <a target="_blank" rel="noopener noreferrer" href={url.url}>
        {title}
      </a>
    ) : (
      <p>{title}</p>
    );
  };

  const dateBodyTemplate = (data) =>
    new Date(data?.end).toLocaleDateString("en-UK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const renderTab = (field) => {
    const [name0, ...nameRest] = field;
    const header = [name0.toUpperCase(), ...nameRest].join("");
    return (
      <TabPanel
        key={field}
        header={`${header} (${state[field].available})`}
        disabled={state[field].available < 1}
      >
        <VirtualScrollTable
          dataService={dataService}
          total={state[field].available}
          id={id}
          field={field}
          columns={columns[field]}
        />
      </TabPanel>
    );
  };
  const columns = {
    series: [
      {
        field: "title",
        header: "Title",
        body: nameBodyTemplate,
      },
      { field: "startYear", header: "Published" },
      { field: "rating", header: "Rating" },
    ],
    stories: [
      { field: "title", header: "Title", body: nameBodyTemplate },
      { field: "type", header: "Type" },
    ],
    events: [
      { field: "title", header: "Title", body: nameBodyTemplate },
      {
        field: "end",
        dataType: "date",
        header: "Last",
        body: dateBodyTemplate,
      },
    ],
  };
  const tabs = Object.keys(columns).map(renderTab);

  return (
    <div className="flex flex-column align-items-center">
      <img id="thumbnail" alt={name + " thumbnail"} src={img} />
      <Button
        icon="pi pi-times"
        className="absolute top-0 right-0 m-3 p-button-rounded p-button-danger p-button-text"
        aria-label="Close"
        onClick={(e) => navigate(-1)}
      />
      <h1 className="marvel m-0 h-full text-8xl text-center uppercase vertical-align-middle">
        {name}
      </h1>
      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
        className="w-8 xl:w-6"
      >
        <TabPanel
          header="Description"
          disabled={!description}
          contentClassName="text-center"
        >
          <p>{description}</p>
        </TabPanel>
        {tabs}
      </TabView>
      <Footer></Footer>
    </div>
  );
};
