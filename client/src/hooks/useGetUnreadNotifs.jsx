import { useQuery } from "@tanstack/react-query";

const useGetUnreadNotifs = () => {
  return useQuery({
    queryKey: ["unreadNotifs"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/notification/unread");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message);
        }

        return data;
      } catch (error) {
        toast.error(error.message || error);
      }
    },
    retry: false,
  });
};

export default useGetUnreadNotifs;
