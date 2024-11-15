import React, { useEffect, useState } from "react";

// import and prepend the api url to any fetch calls
import apiURL from "../api";

export const App = () => {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const [isAddingArticle, setIsAddingArticle] = useState(false);

  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    name: "",
    email: "",
    tags: "",
  });

  async function fetchArtical(slug) {
    try {
      const response = await fetch(`${apiURL}/wiki/${slug}`);
      const articalDate = await response.json();
      setCurrentPage(articalDate);
    } catch (err) {
      console.log("Oh no an error! ", err);
    }
  }

  const handleBackToList = () => {
    setCurrentPage(null);
  };

  useEffect(() => {
    async function fetchPages() {
      try {
        const response = await fetch(`${apiURL}/wiki`);
        const pagesData = await response.json();
        setPages(pagesData);
      } catch (err) {
        console.log("Oh no an error! ", err);
      }
    }

    fetchPages();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewArticle((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiURL}/wiki`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newArticle.title,
          content: newArticle.content,
          name: newArticle.name,
          email: newArticle.email,
          tags: newArticle.tags,
        }),
      });
      if (response.ok) {
        const createdArticle = await response.json();
        setPages((prevPages) => [...prevPages, createdArticle]); 
        setIsAddingArticle(false); 
        setNewArticle({
          title: "",
          content: "",
          name: "",
          email: "",
          tags: "",
        });
      } else {
        console.log("Failed to create article");
      }
    } catch (err) {
      console.log("Oh no an error! ", err);
    }
  };

  if (isAddingArticle) {
    return (
      <form onSubmit={handleSubmit}>
        <h1>Add a New Article</h1>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newArticle.title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="content"
          placeholder="Content"
          value={newArticle.content}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="Author Name"
          value={newArticle.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Author Email"
          value={newArticle.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (space separated)"
          value={newArticle.tags}
          onChange={handleInputChange}
        />
        <button type="submit">Submit</button>
        <button type="button" onClick={handleBackToList}>
          Cancel
        </button>
      </form>
    );
  }

  if (!currentPage) {
    return (
      <main>
        <h1>WikiVerse</h1>
        <ul>
          {pages.map((page) => (
            <li key={page.id}>
              <button onClick={() => fetchArtical(page.slug)}>
                {page.title}
              </button>
            </li>
          ))}
        </ul>
        <button onClick={() => setIsAddingArticle(true)}>
          Add New Article
        </button>
      </main>
    );
  }

  return (
    <>
      <h1>{currentPage.title}</h1>
      <p>
        <strong>Author</strong> {currentPage.author.name}
      </p>
      <p>
        <strong>Published</strong>{" "}
        {new Date(currentPage.createdAt).toLocaleDateString()}
      </p>
      <p>{currentPage.content}</p>
      <p>Tags:</p>
      <ul>
        {" "}
        {currentPage.tags.map((tag) => (
          <li key={tag.id}>{tag.name}</li>
        ))}
      </ul>
      <button onClick={handleBackToList}>back to wiki</button>
    </>
  );
};
