import { useQuery } from "@tanstack/react-query";

const useAuthUser = () => {
  return useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();

      if (!res.ok) {
        return null;
      }
      return data;
    },
    retry: false,
  });
};

export default useAuthUser;
