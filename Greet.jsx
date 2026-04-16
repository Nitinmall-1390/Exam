import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UsersList from './UsersList';
import UserProfile from './UserProfile';

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/users" element={<UsersList />} />
                    <Route path="/users/:id" element={<UserProfile />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;


import React from 'react';
import { Link } from 'react-router-dom';
import { users } from './data';

const UsersList = () => {
    return (
        <div>
            <h1>Users List</h1>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <Link to={`/users/${user.id}`}>{user.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UsersList;


import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { users } from './data';

const UserProfile = () => {
    const { id } = useParams();
    const user = users.find((user) => user.id === parseInt(id));

    if (!user) {
        return (
            <div>
                <h1>User not found</h1>
                <Link to="/users">Back to Users</Link>
            </div>
        );
    }

    return (
        <div>
            <h1>User Profile</h1>
            <h2> Name: {user.name}</h2>
            <h3> Email: {user.email}</h3>
            <h4> Posts:</h4>
            <ul>
                {user.posts.map((post, index) => (
                    <li key={index}>{post}</li>
                ))}
            </ul>
            <Link to="/users">Back to Users</Link>
        </div>
    );
};

export default UserProfile;


//



import React, { useState } from 'react';

const App = () => {
    const [users, setUsers] = useState([
        { id: 1, name: "A" },
        { id: 2, name: "B" }
    ]);

    const updateUser = () => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === 2 ? { ...user, name: "updated" } : user
            )
        );
    };

    return (
        <div>
            {users.map(user => (
                <div key={user.id}>
                    <span>ID: {user.id}</span>
                    <span>Name: {user.name}</span>
                </div>
            ))}
            <button onClick={updateUser}>Update User (ID: 2)</button>
        </div>
    );
};

export default App;



///



import React, { useState } from 'react';

const EmployeeForm = () => {
    const [employee, setEmployee] = useState({
        name: '',
        department: '',
        salary: ''
    });

    const [submittedData, setSubmittedData] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({
            ...employee,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmittedData({ ...employee });
    };

    const handleReset = () => {
        setEmployee({
            name: '',
            department: '',
            salary: ''
        });
        setSubmittedData(null);
    };

    return (
        <div>
            <h2>Employee Form</h2>
            <form>
                <div>
                    <label>Employee Name: </label>
                    <input
                        type="text"
                        name="name"
                        value={employee.name}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Department: </label>
                    <input
                        type="text"
                        name="department"
                        value={employee.department}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Salary: </label>
                    <input
                        type="text"
                        name="salary"
                        value={employee.salary}
                        onChange={handleChange}
                    />
                </div>

                <button type="button" onClick={handleSubmit}>Submit</button>
                <button type="button" onClick={handleReset}>Reset</button>
            </form>

            {submittedData && (
                <div>
                    <h3>Employee Details:</h3>
                    <p>Name: {submittedData.name}</p>
                    <p>Department: {submittedData.department}</p>
                    <p>Salary: {submittedData.salary}</p>
                </div>
            )}
        </div>
    );
};

export default EmployeeForm;


///



import React, { useState } from 'react';

const SearchUser = () => {
    const usersData = [
        { id: 1, name: "Amit Sharma", city: "Delhi" },
        { id: 2, name: "Neha Verma", city: "Mumbai" },
        { id: 3, name: "Rahul Singh", city: "Chandigarh" },
        { id: 4, name: "Priya Mehta", city: "Pune" }
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(usersData);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        const filtered = usersData.filter(user =>
            user.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    return (
        <div>
            <h2>Search User</h2>
            <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={handleSearch}
            />

            <ul>
                {filteredUsers.map(user => (
                    <li key={user.id}>
                        {user.name} - {user.city}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchUser;

////


import React, { useState } from 'react';

const ProductTiles = () => {
    const products = [
        { id: 1, name: "Laptop", price: 80000, category: "Premium" },
        { id: 2, name: "Mouse", price: 500, category: "Basic" },
        { id: 3, name: "Keyboard", price: 1500, category: "Basic" },
        { id: 4, name: "Smartphone", price: 60000, category: "Premium" },
        { id: 5, name: "Monitor", price: 12000, category: "Deluxe" },
        { id: 6, name: "Headphones", price: 3000, category: "Deluxe" }
    ];

    const [selectedCategory, setSelectedCategory] = useState("All");

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const filteredProducts = selectedCategory === "All"
        ? products
        : products.filter(product => product.category === selectedCategory);

    return (
        <div>
            <h2>Product Dashboard</h2>

            <div>
                <label>Filter by Category: </label>
                <select value={selectedCategory} onChange={handleCategoryChange}>
                    <option value="All">All</option>
                    <option value="Premium">Premium</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Basic">Basic</option>
                </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {filteredProducts.map(product => (
                    <div key={product.id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
                        <h3>{product.name}</h3>
                        <p>Price: ₹{product.price}</p>
                        <p>
                            Category:
                            <span style={{
                                backgroundColor:
                                    product.category === "Premium" ? "#ffd700" :
                                        product.category === "Deluxe" ? "#c0c0c0" :
                                            "#cd7f32",
                                padding: '5px 10px',
                                borderRadius: '4px',
                                marginLeft: '10px'
                            }}>
                                {product.category}
                            </span>
                        </p>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <p>No products found in this category</p>
            )}
        </div>
    );
};

export default ProductTiles;



///



import React, { useState } from 'react';

const App = () => {
    const [text, setText] = useState('');
    const MAX_LIMIT = 20;

    const handleChange = (e) => {
        const inputValue = e.target.value;
        if (inputValue.length <= MAX_LIMIT) {
            setText(inputValue);
        }

    };

    const remainingChars = MAX_LIMIT - text.length;

    return (
        <div>
            <h2>Character Limit Input</h2>

            <input
                type="text"
                value={text}
                onChange={handleChange}
                placeholder="Enter text (max 20 characters)"
            />

            <p>Characters: {text.length} / {MAX_LIMIT}</p>

            {remainingChars <= 5 && remainingChars > 0 && (
                <p style={{ color: 'orange' }}>
                    Warning: Only {remainingChars} character{remainingChars !== 1 ? 's' : ''} left!
                </p>
            )}

            {remainingChars === 0 && (
                <p style={{ color: 'red' }}>
                    Character limit reached! Cannot add more characters.
                </p>
            )}
        </div>
    );
};

export default App;

///


import React, { useState, useEffect } from 'react';

const App = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>Error: {error}</h2>;

    return (
        <div>
            <h1>Users List</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <strong>{user.name}</strong> - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;

/////


import React from 'react';
import PostCard from './PostCard';

const POSTS_DATA = [
    {
        id: 1,
        username: "dev_traveler",
        content: "Just finished my first React project!",
        likes: 24,
        comments: ["Great job!", "Keep it up!", "React is awesome."]
    },
    {
        id: 2,
        username: "chef_logic",
        content: "The secret to a perfect steak is the sear.",
        likes: 85,
        comments: ["Recipe please?", "Cast iron or grill?"]
    }
];

const App = () => {
    return (
        <>
            <h1>Social Feed</h1>
            {POSTS_DATA.map((post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </>
    );
};

export default App;


import React from 'react';
import CommentItem from './CommentItem';

const PostCard = ({ post }) => {
    return (
        <div style={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '16px',
            margin: '16px 0',
            backgroundColor: '#f9f9f9'
        }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>
                @{post.username}
            </h3>

            <p style={{ fontSize: '16px', margin: '8px 0' }}>
                {post.content}
            </p>

            {/* Conditional styling for likes */}
            <p style={{
                fontWeight: post.likes > 50 ? 'bold' : 'normal',
                color: post.likes > 50 ? 'red' : '#666',
                margin: '8px 0'
            }}>
                {post.likes} likes
            </p>

            <div style={{ marginTop: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#555' }}>
                    Comments ({post.comments.length}):
                </h4>
                <ul style={{ paddingLeft: '20px', margin: '0' }}>
                    {post.comments.map((comment, index) => (
                        <CommentItem key={index} text={comment} />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PostCard;


import React from 'react';

const CommentItem = ({ text }) => {
    return (
        <li style={{
            backgroundColor: '#e9ecef',
            padding: '8px 12px',
            margin: '8px 0',
            borderRadius: '6px',
            listStyleType: 'none',
            fontSize: '14px',
            color: '#333'
        }}>
            {text}
        </li>
    );
};

export default CommentItem;




//



import React, { useState } from 'react';

const App = () => {
    const [formData, setFormData] = useState({});
    const [arr, setArr] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setArr([...arr, formData]);
        setFormData({});
    };

    const handleDelete = (index) => {
        const newArr = [...arr];
        newArr.splice(index, 1);
        setArr(newArr);
    };

    return (
        <div>
            <input
                type="text"
                name="username"
                placeholder="Enter the name"
                onChange={handleChange}
                value={formData.username || ''}
            />
            <input
                type="text"
                name="email"
                placeholder="Enter the email"
                onChange={handleChange}
                value={formData.email || ''}
            />
            <br />
            <button onClick={handleSubmit}>Add</button>

            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {arr.map((el, index) => (
                        <tr key={index}>
                            <td>{el.username}</td>
                            <td>{el.email}</td>
                            <td>
                                <button onClick={() => handleDelete(index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default App;