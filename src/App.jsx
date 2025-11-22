import 'bootstrap/dist/css/bootstrap.min.css';
import {RouterProvider,createBrowserRouter} from 'react-router';
import AppLayout from './components/AppLayout';
import HomePage from './components/HomePage';
import AddNewPost from './components/AddNewPost';
import UpdateExistingPost from './components/UpdateExistingPost';
import AllPosts from './components/AllPosts';
import Error404 from './components/Error404';
import SinglePost from './components/SinglePost';
import InfiniteScroll from './components/InfiniteScroll';
import {QueryClientProvider,QueryClient} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';

const router = createBrowserRouter([
  {
    path:'/', element: <AppLayout />, errorElement: <Error404 />,
    children:[
      {path:'/', element: <HomePage />},
      {path:'/all_posts', element: <AllPosts />},
      {path:'/single_post/:id', element: <SinglePost />},
      {path:'/add_new_post', element: <AddNewPost />},
      {path:'/update_existing_post/:id', element: <UpdateExistingPost />},
      {path:'/infinite_scroll',element: <InfiniteScroll />}
    ]
  },
  // {path:'*', element: <Error404 />}
]);
const App = () => {
  // QueryClientProvider coponent provide a QueryClient instance to entire react application.
  // this make the query client available via react context api so all the component in the tree
  // can access the useQuery, useMutation and other hooks provided by react-query.
  // QueryClient is responsible for managing all background data fetching, caching and state management, mutation,
  // data synchronization related to your queries. its provide a centralize store for managing and caching
  // asynchronous data in your application.
  const client = new QueryClient(); // create new instance with default settings like, setting cache time, stale time etc.
  return (
    <QueryClientProvider client={client}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App;