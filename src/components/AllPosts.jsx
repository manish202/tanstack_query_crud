import { Link } from "react-router";
import {useQuery,keepPreviousData,useMutation,useQueryClient} from '@tanstack/react-query';
import Loader from "./Loader";
import { useState } from "react";

const deletePost = async (id) => {
    try{
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`,{method:'DELETE'});
        if(!res.ok) throw new Error('something is wrong');
        return await res.json();
    }catch(err){
        return Promise.reject(err);
    }
}
const TableRow = ({id,title}) => {
    console.log('AppLayout > AllPosts > TableRow');
    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: (id) => deletePost(id),
        onSuccess: (data,rid) => {
            console.log({data,rid});
            // update cached data for specific query
            queryClient.setQueryData(['all_posts'], (arrObj) => {
                return arrObj?.filter((p) => p.id !== rid);
            });
            alert('Data deleted successfully.');
        }
    });
    return (
        <tr>
            <td>{id}</td>
            <td>{title}</td>
            <td>
                <Link to={`/single_post/${id}`} className="btn btn-info">View</Link>
                <Link to={`/update_existing_post/${id}`} className="btn btn-primary mx-2">Edit</Link>
                <button type="button" className="btn btn-danger" onClick={() => deleteMutation.mutate(id)}>Delete</button>
            </td>
        </tr>
    )
}
const getData = async ({_start,_limit}) => {
    try{
        const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_start=${_start}&_limit=${_limit}`);
        if(!res.ok) throw new Error('something is wrong');
        return await res.json();
    }catch(err){
        return Promise.reject(err);
    }
}
const AllPosts = () => {
    console.log('AppLayout > AllPosts');
    const [pagination,setPagination] = useState({_start:0,_limit:10});
    const {isLoading,isError,error,data} = useQuery({
        queryKey: ['all_posts',pagination._start], // paas unique data, jab vo change hoga component re-render ho jayega.
        queryFn: () => getData(pagination),
        gcTime: 2000, // fetched data 2s tak cache mai rahega fir garbage collecter use delete kar dega.
        // staleTime determine how long fetched data is considered fresh before it needs to be refetched.
        // fresh data: when data is initially fetched or updated its considered fresh.
        // stale data: after the staleTime duration elapses the data is considered staled.
        // default value is 0 means ye immediately stale (purana) ho jayega so by default each time its fetch new fresh updated data.
        // staleTime: 10000, // 10s tak data fresh kehelayega aur 10s baad vo staled (purana) kehelayega jise vapas re-fetch kiya jayega.
        // polling is a technique of fetching data from API on regular intervals to keep the UI uptodate with the
        // latest information. its useful where data changes frequently and you want to display real time updates without
        // requiring the user to manually refresh the page.
        // refetchInterval: 3000, // re-fetch data automatically on particular time interval only when you are in scope.
        // refetchIntervalInBackground: true, // now also work when you are not in scope
        placeholderData: keepPreviousData, // keep old data as it is, only update when new data come.
    });
    console.log({isLoading,isError,error,data});
    if(isLoading) return <Loader />
    if(isError) return <h1>{error.message}</h1>
    const paginate = (direction) => {
        if(direction === 'NEXT'){
            setPagination(obj => ({...obj,_start:obj._start + obj._limit}));
        }else{
            setPagination(obj => ({...obj,_start:obj._start - obj._limit}));
        }
    }
    return (
        <div className="container min-vh-100 py-2">
            <h2>All Posts</h2>
            <table className="table table-dark table-hover text-center">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(val => <TableRow key={val.id} {...val} />)}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan='3'>
                            <ul className="pagination justify-content-center mt-3">
                                <li className="page-item">
                                    <button type="button" onClick={() => paginate('PREV')} className="page-link">Previous</button>
                                </li>
                                <li className="page-item">
                                    <button type="button" className="page-link">{(pagination._start/pagination._limit) + 1 }</button>
                                </li>
                                <li className="page-item">
                                    <button type="button" onClick={() => paginate('NEXT')} className="page-link">Next</button>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}
export default AllPosts;