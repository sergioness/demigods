import data from "../model/data.json";

class Mock {
  constructor() {}
  get(
    from: number,
    amount: number,
    filter: string = "",
    field: string = "name",
    order: number = 1
  ): Promise<any> {
    let results = data.data.results;
    results =
      filter || filter === ""
        ? results.filter((item) =>
            item.name.toLocaleLowerCase().startsWith(filter.toLocaleLowerCase())
          )
        : results;
    results =
      field && order
        ? results.sort((a, b) => a[field].localeCompare(b.name) * order)
        : results;
    const total = results.length;
    results = results.slice(from, from + amount);
    return new Promise((resolve) =>
      setTimeout(() => resolve({ total, results }), 500)
    );
  }
  getField(field: string, id: string, from: number, to: number): Promise<any> {
    const results = Array.from(new Array(to - from + 1), (_, i) => ({
      name: `${field}: ${i + from}`,
      title: `${field}: ${i + from}`,
      urls: [
        {
          type: "detail",
          url: "http://marvel.com/comics/series/16450/ax_2012_-_2014?utm_campaign=apiRef&utm_source=0dd05bfd5bb0a12571127728e5e6bef6",
        },
      ],
      rating: "Rated T",
      startYear: 2008,
      type: "cover",
      end: "2008-01-04 00:00:00",
    }));
    return new Promise((resolve) =>
      setTimeout(() => resolve({ results }), 500)
    );
  }
}

class Real {
  private readonly apikey = "0dd05bfd5bb0a12571127728e5e6bef6";
  public readonly url = "https://gateway.marvel.com:443/v1/public/characters";
  private readonly orders = { "1": "", "-1": "-" };
  get(
    from: number,
    amount: number,
    filter: string = "",
    field: string = "name",
    order: number = 1
  ): Promise<any> {
    const searchParams = new URLSearchParams();
    searchParams.append("apikey", this.apikey);
    filter && searchParams.append("nameStartsWith", filter);
    field && searchParams.append("orderBy", this.orders[order] + field);
    from && searchParams.append("offset", from + "");
    amount && searchParams.append("limit", amount + "");
    const url = this.url + "?" + searchParams.toString();
    return fetch(url)
      .then((response) => response.json())
      .then((json) => json.data);
  }
  getField(field: string, id: string, from: number, to: number): Promise<any> {
    const searchParams = new URLSearchParams();
    searchParams.append("apikey", this.apikey);
    from && searchParams.append("offset", from + "");
    to && searchParams.append("limit", to - from + 1 + "");
    const url = `${this.url}/${id}/${field}?${searchParams.toString()}`;
    return fetch(url)
      .then((response) => response.json())
      .then((json) => json.data);
  }
}
export { Real as DataService };
