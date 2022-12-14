export const getFormatFromInterval = (interval: string) => {
  switch (interval) {
    case "year":
      return "yyyy";
    case "month":
      return "yyyy-MM";
    case "day":
      return "yyyy-MM-dd";
    default:
      return null;
  }
};

export const customQuery = (field: string, interval: string) => (
  {
      "aggs": {
        [field]: {
          "date_histogram": {
            "field": field,
            "calendar_interval": interval,
            "format": getFormatFromInterval(interval)
          }
        }
      }
  }
);
