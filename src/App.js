import { useState, useEffect } from 'react'
import './App.css';
import 'antd/dist/antd.css';
import {Input, Col, Row} from 'antd';
import { useDebounce } from './hooks/useDebounce'
import InfiniteScroll  from 'react-infinite-scroll-component'
import { Link } from 'react-router-dom'


function App() {
  const [userLists, setUserLists] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const [pageLists, setPageLists] = useState(1);
  const debouncedSearch = useDebounce(searchData, 500);

  const handleSearch = (searchUsers) => {
      if (searchUsers) {
        fetch(
          `https://api.github.com/search/users?q=${searchUsers}&page=1`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.total_count !== undefined) {
              setTotalResults(data.total_count);
              return setUserLists(data.items);
            }
          })
          .catch((error) => console.log(error));
    } else {
      return [];
    }
  };

  useEffect(() => {
    if (debouncedSearch) {
      setPageLists(1);
      if (searchData) {
        handleSearch(debouncedSearch);
      }
    } else {
      setTotalResults(0);
      setUserLists([]);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (searchData) {
      fetch(`https://api.github.com/search/users?q=${searchData}&page=${pageLists}`)
        .then((response) => response.json())
        .then((data) => {
          if (pageLists === 1) {
             setUserLists(data.items);
          } else {
         if (data.items) {
          setUserLists((pre) => [...pre, ...data.items]);
         }
          }
        })
        .catch((error) => console.log(error));
    } else {
      setUserLists([]);
      setTotalResults(0);
    }
  }, [pageLists]);

  return (
    <div className="App">
      <div className="search-body">
        <div className="github-icon">
          <img src={'https://www.pngkey.com/png/detail/178-1787508_github-icon-download-at-icons8-white-github-icon.png'} alt="github-icon" />
        </div>
        <Input
          className="input-users"
          placeholder="Search for Username..."
          value={searchData}
          allowClear
          onChange={e => setSearchData(e.target.value)}
        />
      </div>
      <h2 style={{margin: '7px'}}>Results: {totalResults}</h2>
      <InfiniteScroll
        dataLength={userLists.length} 
        next={() => setPageLists((pre) => pre + 1)}
        hasMore={userLists.length < totalResults}
        loader={<h2>Loading...</h2>}
      >
        {userLists.length ? (
        <>
         <Row gutter = {{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {userLists.map((userList, index) => (
            <Col           
              key={index}
              style={{ margin: "0 auto", maxWidth: "300px" }}
              hoverable="true"
              >
                {
                <img
                className="user-avatar"
                  src={userList.avatar_url}
                  alt="github users avatar"
                  />
              }
                <Link to=  {`/${userList.login}`}>
              <h2 className='user-login'>{userList.login} </h2> 
              </Link>
            </Col>
          ))}
        </Row> 
        </>
        ) : (
          <div className="user-not-found">
              <h2>Oops !!!</h2>
              <p>We Couldn't Find The You Were Looking For . Try Again </p>
            </div>
          )}
        
        {/* {userLists.length || } */}
      </InfiniteScroll>
      </div>
  );
}

export default App;
