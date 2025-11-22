import { Link, useParams } from "react-router";
import {useQuery} from '@tanstack/react-query';
import Loader from "./Loader";

const getSingleData = async (id) => {
    try{
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
        if(!res.ok) throw new Error('something is wrong');
        return await res.json();
    }catch(err){
        return Promise.reject(err);
    }
}

const SinglePost = () => {
    const {id} = useParams();
    const {isLoading,isError,error,data} = useQuery({
        queryKey: ['single_post',id],
        queryFn: () => getSingleData(id),
    });
    console.log({isLoading,isError,error,data});
    if(isLoading) return <Loader />
    if(isError) return <h1>{error.message}</h1>
    return (
        <div className="container min-vh-100 py-2">
            <div className="card text-bg-dark w-25 mx-auto my-4">
                <div className="card-body">
                    <h4>ID = {id}</h4>
                    <h5 className="card-title">{data.title}</h5>
                    <p className="card-text">{data.body}</p>
                    <Link to='/all_posts' className="btn btn-primary">Go To All Posts</Link>
                </div>
            </div>
        </div>
    )
}
export default SinglePost;