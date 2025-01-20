import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Button } from 'flowbite-react';

import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import PostPage from './pages/PostPage';
import Header from './components/Header'; // Assuming you have a Header component
import Footer from './components/Footer'; // Ensure the path is correct
import { Provider } from 'react-redux';
import { store } from './redux/store.js';
import OnlyAdminPrivateRoute from './components/OnlyAdminPrivateRoute.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import CreatePost from './pages/CreatePost.jsx';
import UpdatePost from './pages/UpdatePost.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Search from './pages/Search.jsx';

const NotFound = () => {
  return <h1>404 - Page Not Found</h1>;
};

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />
        <Header>
          <Button>Click me</Button>
        </Header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/search" element={<Search />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
          <Route element={<OnlyAdminPrivateRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
          </Route>
          <Route path="/projects" element={<Projects />} />
          <Route path='/post/:postSlug' element={<PostPage />} />
          <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
        </Routes>
        <Footer />
      </BrowserRouter>
    </Provider>
  );
}