import React from "react";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthContext } from "../helpers/AuthContext";
import { listPostsFromServer, deletePostFromServer } from "../helpers/Posts";
//import deletePostFromServer from "../helpers/Posts";
import Selection from "../pages/Selection";

function Home() {
  const { authState } = useContext(AuthContext);
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  let navigate = useNavigate();

  const updateLisOfPosts = async () => {
    const data = await listPostsFromServer();

    setListOfPosts(data);
    console.log(`list of posts ${listOfPosts}`);
  };

  const updateLikedPosts = () => {
    axios
      .get(
        "https://full-stack-posts-app-noako-171fec647c1e.herokuapp.com/likes",
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then((resp) => {
        console.log(resp.data);
        setLikedPosts(
          resp.data.map((like) => {
            return like.PostId;
          })
        );
      });
  };
  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      updateLisOfPosts();
      updateLikedPosts();
    }
  }, [authState]);
  const deleteAPost = async (postId) => {
    const data = await deletePostFromServer(postId);
    console.log("data", data);
    if (!data.error) {
      setListOfPosts(
        listOfPosts.filter((post) => {
          return post.id != postId;
        })
      );
    }
  };
  const likeAPost = (postId) => {
    axios
      .post(
        "https://full-stack-posts-app-noako-171fec647c1e.herokuapp.com/likes",
        { postId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        const { Liked } = response.data;
        console.log("before 74");
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (Liked) {
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                const likeArray = post.Likes;
                likeArray.pop();
                return { ...post, Likes: likeArray };
              }
            } else {
              return post;
            }
          })
        );
      });
    if (likedPosts.includes(postId)) {
      setLikedPosts(
        likedPosts.filter((id) => {
          return id != postId;
        })
      );
    } else {
      setLikedPosts([...likedPosts, postId]);
    }
  };
  return (
    <div>
      <div>
        <Selection stateChanger={setListOfPosts}></Selection>
      </div>
      {listOfPosts.map((value, key) => {
        console.log(value);
        return (
          <div key={key} className="post">
            <div className="title">{value.title}</div>
            <div
              className="body"
              onClick={() => {
                navigate(`/post/${value.id}`);
              }}
            >
              {value.postText}
            </div>
            <div className="footer">
              <div className="username">
                <Link to={`/profile/${value.UserId}`}>{value.username}</Link>
              </div>
              <div className="buttons">
                <ThumbUpAltIcon
                  onClick={() => {
                    likeAPost(value.id);
                  }}
                  className={
                    likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                  }
                />
                {authState.username === value.username && (
                  <DeleteIcon
                    onClick={() => {
                      deleteAPost(value.id);
                    }}
                  ></DeleteIcon>
                )}

                <label>{value.Likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
