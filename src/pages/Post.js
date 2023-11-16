import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";
import DeleteIcon from "@mui/icons-material/Delete";
import { deletePostFromServer } from "../helpers/Posts";

function Post() {
  const histroy = useNavigate();
  const [post, setPost] = useState({});
  const [listOfComments, setListOfComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { authState } = useContext(AuthContext);
  const deletePost = (postId) => {
    deletePostFromServer(postId);
    histroy("/");
  };

  let { id } = useParams();
  useEffect(() => {
    axios
      .get(
        `https://full-stack-posts-app-noako-171fec647c1e.herokuapp.com/posts/${id}`
      )
      .then((response) => {
        setPost(response.data);
      });

    axios
      .get(
        `https://full-stack-posts-app-noako-171fec647c1e.herokuapp.com/posts/${id}/comments`
      )
      .then((response) => {
        setListOfComments(response.data);
        console.log(listOfComments);
      });
  }, []);

  const addComment = () => {
    axios
      .post(
        `https://full-stack-posts-app-noako-171fec647c1e.herokuapp.com/comments/`,
        {
          commentBody: newComment,
          PostId: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log(response.data.error);
        } else {
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
            id: response.data.id,
          };
          setListOfComments([...listOfComments, commentToAdd]);
          setNewComment("");
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(
        `https://full-stack-posts-app-noako-171fec647c1e.herokuapp.com/comments/${id}`,
        {
          headers: { accessToken: localStorage.getItem("accessToken") },
        }
      )
      .then(() => {
        setListOfComments(
          listOfComments.filter((value) => {
            return value.id != id;
          })
        );
      });
  };

  const editPost = (section) => {
    console.log("in edit id is", id);
    let newValue;
    if (section === "title") {
      newValue = prompt("Enter new Title");
    } else {
      newValue = prompt("Enter new Text");
    }
    axios.put(
      `https://full-stack-posts-app-noako-171fec647c1e.herokuapp.com/posts/${id}`,
      { section: section, newValue: newValue },
      {
        headers: { accessToken: localStorage.getItem("accessToken") },
      }
    );
    let newPost = { ...post };
    newPost[section] = newValue;
    setPost(newPost);
  };
  return (
    <div className="postPage">
      <div className="leftSide">
        <div className="post" id="individual">
          <div
            className="title"
            onClick={() => {
              if (authState.username === post.username) {
                editPost("title");
              }
            }}
          >
            {post.title}
          </div>
          <div
            className="body"
            onClick={() => {
              if (authState.username === post.username) {
                editPost("postText");
              }
            }}
          >
            {post.postText}
          </div>
          <div className="footer">
            <div className="username">{post.username}</div>
            <div className="buttons" id="deleteFromPostButton">
              {authState.username === post.username && (
                <DeleteIcon
                  onClick={() => {
                    deletePost(id);
                  }}
                ></DeleteIcon>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="Comment..."
            value={newComment}
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          />
          <button onClick={addComment}>Add Comment</button>
        </div>
        <div className="listOfComments">
          {listOfComments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                {comment.commentBody}
                <label>Username: {comment.username}</label>
                {authState.username === comment.username && id && (
                  <button onClick={() => deleteComment(comment.id)}>X</button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Post;
