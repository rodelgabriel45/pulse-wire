import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "./useAuthUser";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const useUpdateProfile = () => {
  const { data: authUser } = useAuthUser();
  const { username } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
    useMutation({
      mutationFn: async (userData) => {
        try {
          const res = await fetch(`/api/user/update/${authUser?._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message);
          }

          return data;
        } catch (error) {
          toast.error(error.message || error);
        }
      },
      onSuccess: (updatedUser) => {
        // If the username has changed, navigate to the new URL
        if (updatedUser.username !== username) {
          navigate(`/profile/${updatedUser.username}`);
        }

        if (updatedUser.username === username) {
          Promise.all([
            queryClient.invalidateQueries({ queryKey: ["user"] }),
            queryClient.invalidateQueries({ queryKey: ["authUser"] }),
          ]);
        }

        toast.success("Profile updated successfully");
      },
    });
  return { updateProfile, isUpdatingProfile };
};

export default useUpdateProfile;
