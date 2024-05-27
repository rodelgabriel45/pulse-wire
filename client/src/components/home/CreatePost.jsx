import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import useAuthUser from "../../hooks/useAuthUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";

const CreatePost = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);

  const { data: authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const res = await fetch("/api/post/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message);
        }

        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      setText("");
      setImg(null);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created successfully");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ text, img });
  };

  // Function to render the selected image on the client
  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addEmoji = (emojiData, event) => {
    if (emojiData) {
      console.log("went here");
      setText((prevText) => prevText + emojiData.emoji);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 border-b border-gray-700">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
        </div>
      </div>
      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
        <textarea
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none  border-gray-800"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
            />
          </div>
        )}

        <div className="flex justify-between border-t py-2 border-t-gray-700">
          <div className="flex gap-1 items-center">
            <CiImageOn
              className="fill-primary w-6 h-6 cursor-pointer"
              onClick={() => imgRef.current.click()}
            />

            <div onClick={() => setShowPicker(!showPicker)}>
              {showPicker ? (
                <MdClose className="w-5 h-5 cursor-pointer" />
              ) : (
                <BsEmojiSmileFill className="fill-primary w-5 h-5 cursor-pointer" />
              )}
            </div>

            {showPicker && <EmojiPicker onEmojiClick={addEmoji} />}
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <button
            disabled={isPending}
            className="btn btn-primary rounded-full btn-sm text-white px-4 disabled:opacity-80"
          >
            {isPending ? "Posting..." : "Post"}
          </button>
        </div>
        {isError && <div className="text-red-500">{error.message}</div>}
      </form>
    </div>
  );
};
export default CreatePost;
