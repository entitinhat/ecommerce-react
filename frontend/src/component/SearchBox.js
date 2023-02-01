import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';

export default function SearchBox(props) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('all');
    const dispatch = useDispatch();
    const searchSubmitHandler = (e) => {
        e.preventDefault();

        navigate(`/search?query=${searchQuery}`);

    }
    console.log(searchQuery);
    return (
        <div>
            <div className="search-box">
                <form name="search-box" onSubmit={searchSubmitHandler}>
                    <div className="row">
                        <input type="text" placeholder="What are you looking for?"
                            onChange={(e) => setSearchQuery(e.target.value)}></input>
                        <button type="submit" className="search-btn"><i className="fa fa-search search-icon"></i></button>
                    </div>

                </form>
            </div>
        </div>
    )
}
