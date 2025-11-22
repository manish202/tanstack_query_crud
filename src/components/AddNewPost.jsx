import {useState} from 'react';
import {useMutation} from '@tanstack/react-query';

const AddNewPost = () => {
    const [input,setInput] = useState({title:'',body:''});
    const insertData = async (data) => {
        try{
            const res = await fetch(`https://jsonplaceholder.typicode.com/posts`,{method:'POST',body:JSON.stringify(data)});
            if(!res.ok) throw new Error('something is wrong');
            return await res.json();
        }catch(err){
            return Promise.reject(err);
        }
    }
    const insertMutation = useMutation({
        mutationFn: (data) => insertData(data),
        onSuccess: (resData,payload) => {
            console.log({resData,payload});
            alert('Data inserted successfully');
        }
    });
    const handleChange = (e) => {
        const {name,value} = e.target;
        setInput(old => ({...old,[name]:value}));
    }
    const handleFormSubmit = (e) => {
        e.preventDefault();
        insertMutation.mutate(input);
    }
    return (
        <div className="container min-vh-100 my-3">
            <h1>Add new post</h1>
            <form onSubmit={handleFormSubmit}>
                <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input type="text" className="form-control" value={input.title} onChange={handleChange} name='title' />
                </div>
                <div className="mb-3">
                    <label className="form-label">Body</label>
                    <input type="text" className="form-control" value={input.body} onChange={handleChange} name='body' />
                </div>
                <button type="submit" className="btn btn-primary">Add Post</button>
            </form>
        </div>
    )
}

export default AddNewPost;