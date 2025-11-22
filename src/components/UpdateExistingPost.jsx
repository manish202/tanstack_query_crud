import { useParams } from "react-router";
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import Loader from "./Loader";
import {useEffect, useState} from 'react';

const getSingleData = async (id) => {
    try{
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
        if(!res.ok) throw new Error('something is wrong');
        return await res.json();
    }catch(err){
        return Promise.reject(err);
    }
}
const updatePost = async (data) => {
    try{
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${data.id}`,{method:'PATCH',body:JSON.stringify(data)});
        if(!res.ok) throw new Error('something is wrong');
        return await res.json();
    }catch(err){
        return Promise.reject(err);
    }
}
const UpdateExistingPost = () => {
    const {id} = useParams();
    const [input,setInput] = useState({title:'',body:''});
    const {isLoading,isError,error,data} = useQuery({
        queryKey: ['update_existing_post',id],
        queryFn: () => getSingleData(id),
    });
    useEffect(() => {
        if(data){
            const {title,body} = data;
            setInput({title,body});
        }
    },[data]);
    const queryClient = useQueryClient();
    const updateMutation = useMutation({
        mutationFn: (data) => updatePost(data),
        onSuccess: (resData,payload) => {
            console.log({resData,payload});
            // update cached data for specific query
            queryClient.setQueryData(['all_posts'], (postsData) => {
                return postsData?.map((curPost) => {
                    return curPost.id === id ? {...curPost,...resData} : curPost;
                });
            });
            alert('Data updated successfully');
        }
    });
    console.log({isLoading,isError,error,data});
    if(isLoading) return <Loader />
    if(isError) return <h1>{error.message}</h1>
    const handleChange = (e) => {
        const {name,value} = e.target;
        setInput(old => ({...old,[name]:value}));
    }
    const handleFormSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate({id,...input});
    }
    return (
        <div className="container min-vh-100 my-3">
            <h1>Update Existing Post</h1>
            <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" value={input.title} onChange={handleChange} name='title' />
                </div>
                <div className="mb-3">
                    <label className="form-label">Body</label>
                    <input type="text" className="form-control" value={input.body} onChange={handleChange} name='body' />
                </div>
                <button type="submit" className="btn btn-primary">Update Post</button>
            </form>
        </div>
    )
}
export default UpdateExistingPost;