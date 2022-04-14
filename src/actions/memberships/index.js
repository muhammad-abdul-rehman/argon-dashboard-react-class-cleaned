export const fetchMemberships = async (url, token) => {
  const urlQuery = new URL(url);
  const paramsOptions = {
    number: this.state.number,
    offset: (this.state.page - 1) * this.state.number,
    orderby: "ID",
    order: "ASC",
  };
  for (let key in paramsOptions) {
    urlQuery.searchParams.set(key, paramsOptions[key]);
  }

  const res = await fetch(urlQuery, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const data = await res.json();
  return data;
};
