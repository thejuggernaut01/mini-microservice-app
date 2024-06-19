import "./App.css";
import PostCreate from "./PostCreate";
import PostList from "./PostList";

function App() {
  return (
    <>
      <div>
        <h1>Creat Post</h1>
        <PostCreate />
        <hr />
        <h1>Posts</h1>
        <PostList />
      </div>
    </>
  );
}

export default App;
