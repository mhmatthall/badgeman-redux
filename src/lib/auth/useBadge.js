import axios from "axios";
import useSWR from "swr";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export const useBadge = (badgeId) => {
  const { data, isLoading, error } = useSWR("/api/badges/" + badgeId, fetcher);
  return { badge: data, isLoading, isError: error };
};
