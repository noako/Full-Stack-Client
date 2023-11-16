import axios from "axios";

export async function deletePostFromServer(postId) {
  const resp = await axios
    .delete(
      `https://full-stack-posts-app-noako-171fec647c1e.herokuapp.com/posts/${postId}`,
      {
        headers: { accessToken: localStorage.getItem("accessToken") },
      }
    )
    .catch((error) => alert(error));
  const data = resp.data;
  if (data.error) {
    alert(resp.data.error);
  } else {
    return data;
  }
}

export async function listPostsFromServer(selectionValue) {
  if (!selectionValue) {
    selectionValue = "all";
  }
  const resp = await axios
    .get(
      "https://full-stack-posts-app-noako-171fec647c1e.herokuapp.com/posts",
      {
        headers: { accessToken: localStorage.getItem("accessToken") },
        params: {
          selection: selectionValue,
        },
      }
    )
    .catch((error) => alert(error));
  const data = resp.data;
  if (data.error) {
    alert(data.error);
  } else {
    return data;
  }
}
