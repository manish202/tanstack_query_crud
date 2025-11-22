import {NavLink} from 'react-router';
const Header = () => {
    console.log('AppLayout > Header');
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
            <div className="container-fluid">
                <NavLink to='/' className="navbar-brand">Tanstack Query CRUD</NavLink>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink to='/' className="nav-link">Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to='/all_posts' className="nav-link">All Posts</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to='/add_new_post' className="nav-link">Add New Post</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to='/infinite_scroll' className="nav-link">Infinite Scroll</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
export default Header;