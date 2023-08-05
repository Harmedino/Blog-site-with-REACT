import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const [pending, setPending] = useState(false);
  const [data, setData] = useState();
  const navigate = useNavigate();
  const blogValue = useRef();

  const { id } = useParams();
  useEffect(() => {
    // setData("");
    if (id) {
      getIndex();
    }
  }, [id]);

  async function getIndex() {
    const response = await fetch("http://localhost:5000/getBlog/" + id);
    const data = await response.json();

    setData(data);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(blogValue.current);
    const blog = {};
    formData.forEach((value, name) => {
      blog[name] = value;
    });

    setPending(true);

    try {
      if (!data) {
        const res = await fetch("http://localhost:5000/sendPost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(blog),
        });
        const newData = await res.json();
        setPending(false);
        // Navigate to the newly created blog's page (assuming you get the blog ID in the response)
        navigate(`/blogList`);
      } else {
        // If data is available, it means this is an update to an existing blog
        const res = await fetch(`http://localhost:5000/update/${data._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(blog),
        });
        const updatedData = await res.json();
        console.log(updatedData);
        navigate(`/blogList`);
        setPending(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="create">
      <h2>Create a new blog</h2>
      <form onSubmit={handleSubmit} ref={blogValue}>
        <label>Blog title</label>
        <input
          type="text"
          required
          name="title"
          defaultValue={data ? data.title : ""}
        />
        <label>Blog body:</label>
        <textarea
          cols="30" rows="10"
          required
          defaultValue={data ? data.body : ""}
          name="body"
        ></textarea>
        <label> Blog author:</label>
        <select defaultValue={data ? data.author : ""} name="author">
          <option value="selim">selim</option>
          <option value="ahmed">ahmed</option>
        </select>
        {!pending && !data && <button>Add Blog</button>}
        {!pending && data && <button>Update Blog</button>}
        {pending && !data && <button>Add Blog ...</button>}
        {pending && data && <button>Updating Blog ...</button>}
      </form>
    </div>
  );
};

export default CreateBlog;
