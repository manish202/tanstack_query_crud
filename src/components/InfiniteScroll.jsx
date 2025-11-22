import {useInfiniteQuery} from '@tanstack/react-query';
import Loader from "./Loader";
import {useEffect} from 'react';
import {useInView} from 'react-intersection-observer';

const fetchUsers = async ({pageParam=1}) => {
    try{
        const res = await fetch(`https://api.github.com/users?per_page=10&page=${pageParam}`);
        if(!res.ok) throw new Error('something is wrong');
        return await res.json();
    }catch(err){
        return Promise.reject(err);
    }
}
const Card = ({login,avatar_url}) => {
    return (
        <div className="col-md-2">
            <div className="card">
                <img src={avatar_url} className="card-img-top" alt={login} />
                <div className="card-body">
                    <h5 className="card-title">{avatar_url}</h5>
                </div>
            </div>
        </div>
    )
}
const PageContainer = ({page,pageNo}) => {
    return (
        <div className="row my-3" data-page_no_info={pageNo+1}>
            {page.map((user) => <Card key={user.id} {...user} />)}
        </div>
    )
}
const InfiniteScroll = () => {
    const {isLoading,isError,error,data,isFetchingNextPage,hasNextPage,fetchNextPage,status} = useInfiniteQuery({
        queryKey: ['infinite_scroll'],
        queryFn: fetchUsers,
        getNextPageParam: (lastPage,allPages) => {
            console.log({lastPage,allPages});
            return lastPage.length === 10 ? allPages.length + 1 : undefined;
        }
    });
    const {ref,inView} = useInView({threshold:1});
    const handleScroll = () => {
        const {innerHeight,scrollY} = window;
        const {scrollHeight} = document.documentElement;
        const bottom = innerHeight + scrollY >= scrollHeight;
        if(bottom && hasNextPage){
            fetchNextPage();
        }
    }
    useEffect(() => {
        // window.addEventListener('scroll',handleScroll);
        // return () => window.removeEventListener('scroll',handleScroll);
        if(inView && hasNextPage){ fetchNextPage(); }
    },[hasNextPage,inView]);
    console.log({isLoading,isError,error,data,isFetchingNextPage,hasNextPage,fetchNextPage,status});
    if(isLoading) return <Loader />
    if(isError) return <h1>{error.message}</h1>
    return (
        <div className="container min-vh-100 py-2">
            {data.pages.map((page,ind) => <PageContainer key={ind} page={page} pageNo={ind} />)}
            <div className="row" ref={ref}>
                {isFetchingNextPage ? (<Loader />) : hasNextPage ? <h2>scroll down to load more</h2> : <h2>No More Data</h2>}
            </div>
        </div>
    )
}
export default InfiniteScroll;